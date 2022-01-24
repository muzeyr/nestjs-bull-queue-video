import {Get, Post, Body, Put, Delete, Query, Param, Controller, UploadedFile, UseInterceptors, Res} from '@nestjs/common';
import { Request, Response } from 'express';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto';
import { VideosRO } from './video.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'typeorm/platform/PlatformTools';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@ApiBearerAuth()
@ApiTags('video')
@Controller('video')
export class  VideoController {

  constructor(private readonly videoService: VideoService,
              @InjectQueue('file-upload') private readonly fileQueue: Queue) {}

  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'Return all videos.'})
  @Get()
  async findAll(@Query() query): Promise<VideosRO> {
    return await this.videoService.findAll(query);
  }

  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'Return all videos.'})
  @Get('all')
  async allVideo(): Promise<VideosRO> {
    return await this.videoService.findAll({});
  }

@Get('job/:id')
async getJobResult(@Res() response: Response, @Param('id') id: string) {
  const job = await this.fileQueue.getJob(id);
  if (!job) {
    return response.sendStatus(404);
  }

  const isCompleted = await job.isCompleted();

  if (!isCompleted) {
    return response.sendStatus(202);
  }

  const result = Buffer.from(job.data);

  const stream = Readable.from(result);

  stream.pipe(response);
}

  @ApiOperation({ summary: 'Create video' })
  @ApiResponse({ status: 201, description: 'The video has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(FileInterceptor("file"))
  @Post()
  async create(@User('id') userId: number, @UploadedFile() videoData) {
    return  this.videoService.create(userId, videoData);;
  }

  @ApiOperation({ summary: 'Update video' })
  @ApiResponse({ status: 201, description: 'The video has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(@Param() params, @Body('video') videoData: CreateVideoDto) {
    // Todo: update slug also when title gets changed
    return await this.videoService.update(params.id, videoData);
  }

  @ApiOperation({ summary: 'Delete video' })
  @ApiResponse({ status: 201, description: 'The video has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async delete(@Param() params) {
    return this.videoService.delete(params.id);
  }
}