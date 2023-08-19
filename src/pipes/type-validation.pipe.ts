import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { typeArray } from 'src/comic/comic.constants';
import { TYPE_VALIDATION_ERROR } from './pipes.constants';

@Injectable()
export class TypeValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type != 'param') {
      return value;
    }
    if (typeArray.indexOf(value) == -1) {
      throw new BadRequestException(TYPE_VALIDATION_ERROR);
    }
    return value;
  }
}
