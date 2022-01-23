import { Process, Processor, OnQueueActive, OnGlobalQueueCompleted } from '@nestjs/bull';
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

      const videoData = this.videoService.findOne({jobId: job.id});

      const writeFile = promisify(fs.writeFile);
      writeFile(`/Users/mozcan/Desktop/2022/video/nestjs-realworld-example-app/uploads/${fileData.file.originalname}`, fileData.file.buffer.toString(), 'utf8');
      await sleep(5000);
      const findVideo = this.videoService.findOne({jobId: job.id});

      let updated = Object.assign(findVideo);
      updated.jobEnd = new Date();
      const video = this.videoService.update(updated.id,updated);
  
      return fileData;
}

  @OnQueueActive()
  onActive(job: Job) {
    const videoData = this.videoService.findOne({id: job.id});
    let updated = Object.assign(videoData);
    updated.size = job.data.file.size;
    this.videoService.update(updated.id,updated);


    console.log(
      `Processing job ${job.id} of type ${job.data.file.filename} with data ${job.data.file.size}...`,
    );
  }

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, result: any) {


    console.log('(Global) on completed: job: '+jobId+ ' Result:' + result);
  }

}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
