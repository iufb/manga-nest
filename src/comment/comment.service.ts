import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModel } from './comment.model';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { retry } from 'rxjs';
import { UpdateCommentVoteDto } from './dto/UpdateCommentVote.dto';
import { COMMENT_NOT_FOUND_ERROR } from './comment.constants';
const aggregationProps = [
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
    },
  },
  { $unwind: '$user' },
  {
    $project: {
      __v: 0,
      userId: 0,
      user: {
        _id: 0,
        role: 0,
        createdAt: 0,
        updatedAt: 0,
        email: 0,
        __v: 0,
      },
      commentFor: {
        _id: 0,
      },
    },
  },
];
@Injectable()
export class CommentService {
  constructor(
    @InjectModel('comment') private commentModel: Model<CommentModel>,
  ) {}

  async create(dto: CreateCommentDto) {
    return this.commentModel.create({
      ...dto,
      userId: new Types.ObjectId(dto.userId),
      votedUsers: [],
    });
  }
  async getComments(
    comic: string,
    type: 'comic' | 'page',
    chapter?: number,
    page?: number,
  ) {
    const isPage = type == 'page';
    const matchProps = isPage
      ? {
          type,
          'commentFor.comicId': comic,
          'commentFor.chapterNumber': Number(chapter),
          'commentFor.page': Number(page),
        }
      : { type, 'commentFor.comicId': comic };
    const baseComments = await this.commentModel.aggregate([
      {
        $match: {
          ...matchProps,
          commentLevel: 0,
        },
      },
      ...aggregationProps,
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    const replies = await this.commentModel.aggregate([
      {
        $match: {
          ...matchProps,
          commentLevel: { $ne: 0 },
        },
      },
      ...aggregationProps,
    ]);
    return { comments: baseComments, replies };
  }
  async changeCommentVote({ commentId, userId, liked }: UpdateCommentVoteDto) {
    const comment = await this.commentModel.findOne({
      _id: new Types.ObjectId(commentId),
    });
    const voteValue = liked ? 'votesUp' : 'votesDown';
    // Check if user exists in votedUsers
    const votedUserIndex = comment.votedUsers.findIndex(
      (u) => u.userId == userId,
    );
    if (votedUserIndex == -1) {
      return this.commentModel.updateOne(
        {
          _id: new Types.ObjectId(commentId),
        },
        {
          $set: {
            [voteValue]: liked ? comment.votesUp + 1 : comment.votesDown + 1,
          },
          $push: {
            ['votedUsers']: {
              userId,
              liked,
            },
          },
        },
      );
    }
    const votedUser = comment.votedUsers[votedUserIndex];
    //change vote
    if (votedUser.liked !== liked) {
      const lastVote = votedUser.liked ? 'votesUp' : 'votesDown';
      const newVote = liked ? 'votesUp' : 'votesDown';
      return this.commentModel.updateOne(
        {
          _id: new Types.ObjectId(commentId),
        },
        {
          $set: {
            [`votedUsers.${votedUserIndex}.liked`]: liked,
            [lastVote]: comment[lastVote] - 1,
            [newVote]: comment[newVote] + 1,
          },
        },
      );
    }
    // delete vote
    return this.commentModel.updateOne(
      {
        _id: new Types.ObjectId(commentId),
      },
      {
        $set: {
          [voteValue]: liked ? comment.votesUp - 1 : comment.votesDown - 1,
        },
        $pull: {
          ['votedUsers']: { userId: userId },
        },
      },
    );
  }
  async getUserVote(userId: string, commentId: string) {
    const comment = await this.commentModel.findOne({
      _id: new Types.ObjectId(commentId),
    });
    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND_ERROR);
    }
    const votedUser = comment.votedUsers.filter((u) => u.userId == userId)[0];
    if (!votedUser) {
      return { commentId, vote: 'none' };
    }
    return { commentId, vote: votedUser.liked ? 'up' : 'down' };
  }
}
