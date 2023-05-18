export class ChapterModel {
  id: number;
  comicId: number;
  chapters: {
    chapterNumber: number;
    chapterSource: string;
  }[];
}
