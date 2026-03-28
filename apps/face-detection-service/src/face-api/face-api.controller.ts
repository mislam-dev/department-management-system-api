/// <reference types="multer" />
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFaceApiDto } from './dto/create-face-api.dto';
import { FaceApiService } from './face-api.service';

@Controller('face-api')
export class FaceApiController {
  constructor(private readonly faceApiService: FaceApiService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateFaceApiDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image is required');
    }
    return this.faceApiService.saveUserFace(dto, image);
  }

  @Get()
  findAll() {
    return this.faceApiService.getAll();
  }

  @Post('verify')
  @UseInterceptors(FileInterceptor('image'))
  verify(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('Image is required');
    }
    return this.faceApiService.verifyUserFace(image);
  }
}
