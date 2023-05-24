import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileElementResponse } from './dto/file-element.response';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[], comicName: string) {
    const uploadFolder = `${path}/uploads/comics/${comicName}`;
    await ensureDir(uploadFolder);
    const res: FileElementResponse[] = [];
    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({
        url: `${uploadFolder}/${file.originalname}`,
        name: file.originalname,
      });
    }
    return res;
  }
  async convertToWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp().toBuffer();
  }
}
