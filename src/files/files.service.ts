import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile, remove, readdir, unlink } from 'fs-extra';
import * as sharp from 'sharp';
import * as AdmZip from 'adm-zip';
import { path } from 'app-root-path';

@Injectable()
export class FilesService {
  async saveAvatars(file: Express.Multer.File, name: string) {
    const avatarFolder = `${path}/uploads/avatars/${name}`;
    const fileName = file.originalname ? file.originalname : 'avatar';
    const filePath = `${avatarFolder}/${fileName}`;
    const webpPath = `${avatarFolder}/${fileName.split('.')[0]}.webp`;
    await ensureDir(avatarFolder);
    for (const file of await readdir(avatarFolder)) {
      await unlink(`/${avatarFolder}/${file}`);
    }
    await writeFile(filePath, file.buffer);
    await this.convertToWebP(filePath, webpPath);
    await remove(filePath);
    return { url: `avatars/${name}/${fileName.split('.')[0]}.webp` };
  }
  async convertToWebP(buffer: Buffer | string, outPutPath: string) {
    return sharp(buffer).toFormat('webp').toFile(outPutPath);
  }
  async saveZip(file: Express.Multer.File, name: string) {
    const zipPath = `/opt/app/uploads/comics/${name}`;
    await ensureDir(zipPath);
    await writeFile(`${zipPath}/${file.originalname}`, file.buffer);
    return { file: `${zipPath}/${file.originalname}`, folderPath: zipPath };
  }
  async unzipAndSave(file: Express.Multer.File, name: string) {
    const zipPath = await this.saveZip(file, name);
    const res = [];
    try {
      const zip = new AdmZip(zipPath.file);
      const zipEntries = zip.getEntries();
      for (let i = 0; i < zipEntries.length; i++) {
        if (!zipEntries[i].isDirectory) {
          const entryPath = `${zipPath.folderPath}/${zipEntries[i].entryName}`;
          const outputWebPPath = `${zipPath.folderPath}/${i + 1}.webp`;
          res.push(outputWebPPath);
          const buffer = zipEntries[i].getData();
          await ensureDir(zipPath.folderPath);
          await writeFile(entryPath, buffer);
          await this.convertToWebP(entryPath, outputWebPPath);
          await remove(entryPath);
        }
      }

      console.log('Extraction and conversion completed successfully.');
    } catch (error) {
      console.error('Error extracting and converting files:', error);
    }
    return res;
  }
}
