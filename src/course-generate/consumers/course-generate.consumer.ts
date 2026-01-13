import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiService } from 'src/ai/ai.service';
import { CourseGenerateService } from '../course-generate.service';
import { COURSE_SCHEDULE_QUEUE } from '../course-schedule.constants';
import { CourseGenerateDto } from '../dto/create-course-generate.dto';
import { CourseGenerateStatus } from '../entities/course-generate.entity';

@Processor(COURSE_SCHEDULE_QUEUE)
export class CourseGenerateConsumer extends WorkerHost {
  private readonly logger = new Logger(CourseGenerateConsumer.name);
  constructor(
    private readonly aiService: AiService,
    private readonly courseGenerateService: CourseGenerateService,
  ) {
    super();
  }
  async process(job: Job<CourseGenerateDto & { id: string }, any, string>) {
    await job.updateProgress(1);
    const dto = job.data;
    const data = await this.aiService.courseScheduleAssistant({
      semesters: {
        start: dto.semesterStart,
        end: dto.semesterEnd,
        ids: dto.semesterIds,
      },
    });
    // todo remove on productions
    // const data: string = await new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve('data');
    //   }, 4000);
    // });
    await this.courseGenerateService.saveData(data, dto.id);
    await job.updateProgress(100);

    return {};
  }

  @OnWorkerEvent('active')
  async onActive(job: Job<CourseGenerateDto & { id: string }, any, string>) {
    this.logger.log(`course generate active ${job.data.id}`);
    await this.courseGenerateService.updateStatus(
      CourseGenerateStatus.IN_PROGRESS,
      job.data.id,
    );
  }

  @OnWorkerEvent('completed')
  async onComplete(job: Job<CourseGenerateDto & { id: string }, any, string>) {
    this.logger.log(`course generate completed ${job.data.id}`);
    await this.courseGenerateService.updateStatus(
      CourseGenerateStatus.COMPLETED,
      job.data.id,
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<CourseGenerateDto & { id: string }, any, string>) {
    this.logger.log(`course generate failed ${job.data.id}`);
    await this.courseGenerateService.updateStatus(
      CourseGenerateStatus.FAILED,
      job.data.id,
    );
  }
}
