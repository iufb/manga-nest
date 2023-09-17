import { ComicModel } from 'src/comic/comic.model';

export type chapterType = {
  _id: string;
  comicId: string;
  name: string;
  chapterNumber: number;
  pages: string[];
  comicName: string[];
  createdAt: string;
};
export type updateLatestChapters = Omit<
  chapterType,
  'pages' | 'name' | 'chapterNumber'
> & {
  chapterNumbers: {
    chapter: number;
    name: string;
  }[];
  comic: {
    comicCover: string;
    title: string;
    alternativeTitle: string;
  };
};
export type lastChapterType = {
  chapter: number;
  page: number;
};
export type filterComic = {
  genres?: string[];
  type?: string[];
  status?: string[];
  translateStatus?: string[];
  sortType: string;
  sortDirection: 'asc' | 'desc';
};
export type listType = 'reading' | 'planned' | 'dropped' | 'finished';
export type sortDirectionType = 'asc' | 'desc';
