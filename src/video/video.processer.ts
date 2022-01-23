import { Process, Processor, OnQueueActive, OnGlobalQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { write } from 'fs';
import { promisify } from 'util';
import * as fs from 'fs';
import { VideoService } from './video.service';




@Processor('file-upload')
export class VideoProcessor {

  constructor(private readonly videoService: VideoService){
  
  }

  @Process('optimize')
  async handleOptimization(job: Job) {
      const fileData: any = job.data;
      console.log('(handleOptimization) starting: job: '+job.id);
      let updated = {size :job.data.file.size};
      this.videoService.updateJob(job.id,updated);
      await sleep(5000);
  

      const writeFile = promisify(fs.writeFile);
      writeFile(`/Users/mozcan/Desktop/2022/video/nestjs-realworld-example-app/uploads/${fileData.file.originalname}`, fileData.file.buffer.toString(), 'utf8');
      const findVideo = this.videoService.findOne({jobId: job.id});
  
      return fileData;
}

  @OnQueueActive()
  onActive(job: Job) {
    let updated = {jobStart: new Date()};
    this.videoService.updateJob(job.id,updated);

    console.log(
      `Processing job ${job.id} of type ${job.data.file.filename} with data ${job.data.file.size}...`,
    );
  }

  @OnGlobalQueueCompleted()
  onGlobalCompleted(jobId: number, result: any) {
    console.log('(Global) on completed: job: '+jobId);
    let updated = {jobEnd: new Date()};
    this.videoService.updateJob(''+jobId, updated);

  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    console.log(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
