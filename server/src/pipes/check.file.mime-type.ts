import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  import * as path from 'path';
  
  @Injectable()
  export class CheckFileMimeType implements PipeTransform {
    constructor(private readonly allowedMimeTypes: string[]) {}
  
    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
      if (!file || !file.originalname) {
        return file; 4
      }
  
      const ext = path.extname(file.originalname).replace('.', '').toLowerCase();
  
      if (!this.allowedMimeTypes.includes(ext)) {
        throw new BadRequestException(
          `The file extension ".${ext}" is not allowed`,
        );
      }
  
      return file;
    }
  }
  