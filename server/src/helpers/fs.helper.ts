import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FsHelper {
  private readonly fileFolder = path.join(process.cwd(), 'uploads');

  async ensureUploadDirExists() {
    if (!fs.existsSync(this.fileFolder)) {
      fs.mkdirSync(this.fileFolder, { recursive: true });
    }
  }

  async uploadFile(files: Express.Multer.File[]) {
    await this.ensureUploadDirExists();

    const res: string[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname) || '.jpg';
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}${ext}`;

      await fsPromises.writeFile(path.join(this.fileFolder, fileName), file.buffer);
      res.push(fileName);
    }

    return {
      fileUrl: res,
    };
  }

  async unlinkFile(file: string) {
    const filePath = path.join(this.fileFolder, file);

    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath);
    }
  }
}
