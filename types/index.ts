export type chapterType = {
  _id: string;
  comicId: string;
  name: string;
  chapterNumber: number;
  pages: string[];
  comicName: string[];
  createdAt: string;
};
export type filterComic = {
  genres?: string[];
  type?: string[];
  status?: string[];
  translateStatus?: string[];
};
export type listType = 'reading' | 'planned' | 'dropped' | 'finished';
