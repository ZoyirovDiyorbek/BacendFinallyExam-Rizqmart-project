import {
  ArgumentMetadata,
  BadRequestException,
  Global,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
@Global()
export class CheckFileSize implements PipeTransform {
  constructor(private readonly size: number) {}
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (file) {
      if (file.size > this.size) {
        throw new BadRequestException(
          `The ${file.originalname}'s size must less than ${(this.size / 1024 / 1024).toFixed(2)}`,
        );
      }
      return file;
    } else {
      return file;
    }
  }
}
