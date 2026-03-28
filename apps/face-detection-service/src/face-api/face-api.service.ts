/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Canvas, Image, ImageData, loadImage } from 'canvas';
import * as faceApi from 'face-api.js';
import * as path from 'path';
import { Repository } from 'typeorm';
import { CreateFaceApiDto } from './dto/create-face-api.dto';
import { FaceApiEntity } from './entities/face-api.entity';

@Injectable()
export class FaceApiService implements OnModuleInit {
  private logger = new Logger(FaceApiService.name);
  private modelsPath = path.join(
    process.cwd(),
    './apps/face-detection-service/src/models',
  );

  constructor(
    @InjectRepository(FaceApiEntity)
    private readonly faceApiRepo: Repository<FaceApiEntity>,
  ) {}

  async onModuleInit() {
    this.configureEnvironment();
    await this.loadModels();
  }

  private configureEnvironment() {
    const faceEnv = faceApi.env;
    faceEnv.monkeyPatch({ Canvas, Image, ImageData } as any);

    this.logger.log('Environment configured');
  }

  async loadModels() {
    try {
      const { ssdMobilenetv1, faceRecognitionNet, faceLandmark68Net } =
        faceApi.nets;
      console.log({ modelsPath: this.modelsPath });
      await ssdMobilenetv1.loadFromDisk(this.modelsPath);
      await faceLandmark68Net.loadFromDisk(this.modelsPath);
      await faceRecognitionNet.loadFromDisk(this.modelsPath);
      this.logger.log('Models loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load models', error);
    }
  }

  async saveUserFace(dto: CreateFaceApiDto, image: Express.Multer.File) {
    const { username } = dto;
    // Convert the Multer buffer to a canvas Image that face-api.js can process
    const imgElement = await loadImage(image.buffer);

    const descriptor = await faceApi

      .detectSingleFace(imgElement as any)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!descriptor) {
      throw new BadRequestException('No face detected in the image');
    }
    const faceData = this.faceApiRepo.create({
      username,
      descriptor: Array.from(descriptor.descriptor),
    });

    const faceSavedData = await this.faceApiRepo.save(faceData);
    return { username: faceSavedData.username, id: faceSavedData.id };
  }

  async getAll() {
    return this.faceApiRepo.find({ select: { id: true, username: true } });
  }

  async verifyUserFace(imageBuffer: Express.Multer.File) {
    const image = await loadImage(imageBuffer.buffer);
    const detection = await faceApi
      .detectAllFaces(image as any)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (!detection) {
      throw new BadRequestException('No face detected in the image');
    }

    const matches: Map<
      string,
      { username: string; id: string; distance: number }
    > = new Map();

    for (const descriptor of detection) {
      const vectorString = `[${descriptor.descriptor.join(',')}]`;

      const closestMatch = await this.faceApiRepo
        .createQueryBuilder('fb')
        .select([
          'fb.id',
          'fb.username',
          'fb.descriptor <-> :vector as distance',
        ])
        .where('fb.descriptor <-> :vector < :threshold', {
          vector: vectorString,
          threshold: 0.6,
        })
        .orderBy('distance', 'ASC')
        .getRawOne();
      if (closestMatch) {
        if (!closestMatch.fb_id) continue;
        const id = closestMatch.fb_id as string;
        if (matches.has(id)) {
          const exiting = matches.get(id)!;
          if (closestMatch.distance < exiting.distance) {
            matches.set(id, {
              ...exiting,
              distance: closestMatch.distance as number,
            });
          }
        } else {
          matches.set(id, {
            username: closestMatch.fb_username as string,
            id,
            distance: closestMatch.distance as number,
          });
        }
      }
    }

    return Array.from(matches.values());
  }
}
