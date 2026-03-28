import { PartialType } from '@nestjs/mapped-types';
import { CreateFaceApiDto } from './create-face-api.dto';

export class UpdateFaceApiDto extends PartialType(CreateFaceApiDto) {}
