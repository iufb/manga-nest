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
  transform(value: { type: string }, metadata: ArgumentMetadata) {
    if (metadata.type != 'query') {
      return value;
    }
    if (typeArray.indexOf(value.type) == -1) {
      throw new BadRequestException(TYPE_VALIDATION_ERROR);
    }
    return value;
  }
}
