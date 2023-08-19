import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateListDto } from 'src/list/dto/createList.dto';
import { ListService } from 'src/list/list.service';

describe('ListService', () => {
  let service: ListService;
  const listRepositoryFactory = () => ({
    findByComic: jest.fn(),
    checkUserInList: jest.fn(),
    create: jest.fn(),
    addUserToComicList: jest.fn(),
    changeListType: jest.fn(),
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          useFactory: listRepositoryFactory,
          provide: getModelToken('ListModel'),
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
  });
  describe('addComicToList', () => {
    it('should create a new list when no list exists for the comic', async () => {
      const dto: CreateListDto = {
        comic: 'comicId',
        user: 'userId',
        listType: 'reading',
      };

      listRepositoryFactory.findByComic(dto.comic).mockResolvedValue(null);
      listRepositoryFactory.create.mockResolvedValue({ ...dto });

      const result = await comicListService.addComicToList(dto);

      expect(result).toEqual({ ...dto });
    });

    it('should add user to an existing list when user not in list', async () => {
      const dto: CreateListDto = {
        comic: 'comicId',
        user: 'userId',
        listType: 'reading',
      };

      const existingList = {
        _id: 'listId',
        comic: dto.comic,
        users: [],
      };

      listRepositoryFactory.findByComic.mockResolvedValue(existingList);
      listRepositoryFactory.checkUserInList.mockResolvedValue(null);
      listRepositoryFactory.addUserToComicList.mockResolvedValue({
        ...existingList,
        users: [dto.user],
      });

      const result = await comicListService.addComicToList(dto);

      expect(result).toEqual({ ...existingList, users: [dto.user] });
    });

    it('should change user list type in an existing list when user is in the list', async () => {
      const dto: CreateListDto = {
        comic: 'comicId',
        user: 'userId',
        listType: 'reading',
      };

      const existingList = {
        _id: 'listId',
        comic: dto.comic,
        users: [{ user: dto.user, listType: 'favorite' }],
      };

      listRepositoryFactory.findByComic.mockResolvedValue(existingList);
      listRepositoryFactory.checkUserInList.mockResolvedValue(0);
      listRepositoryFactory.changeListType.mockResolvedValue({
        ...existingList,
        users: [{ user: dto.user, listType: dto.listType }],
      });

      const result = await comicListService.addComicToList(dto);

      expect(result).toEqual({
        ...existingList,
        users: [{ user: dto.user, listType: dto.listType }],
      });
    });
  });
});
