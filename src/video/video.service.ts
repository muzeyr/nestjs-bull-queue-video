import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { VideoEntity } from './video.entity';
import { UserEntity } from '../user/user.entity';
import { CreateVideoDto } from './dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import {VideoRO, VideosRO, CommentsRO} from './video.interface';

const slug = require('slug');

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectQueue('file-upload') private queue: Queue
  ) {}

  async findAll(query): Promise<VideosRO> {

    const qb = await getRepository(VideoEntity)
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.author', 'author');

    qb.where("1 = 1");

    if ('tag' in query) {
      qb.andWhere("video.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }

    qb.orderBy('video.created', 'DESC');

    const videosCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const videos = await qb.getMany();

    return {videos, videosCount};
  }
  
  async findOne(where): Promise<VideoRO> {
    const video = await this.videoRepository.findOne(where);
    return {video};
  }
  
  

  async create(userId: number, videoData: Express.Multer.File): Promise<VideoEntity> {

    let video = new VideoEntity();
    video.title = videoData.originalname;
    const jobId: any = await this.fileQueue(videoData);
    video.jobId  = jobId.id;
    const newvideo = await this.videoRepository.save(video);

    const author = await this.userRepository.findOne({ where: { id: userId }, relations: ['videos'] });
    author.videos.push(video);

    await this.userRepository.save(author);
    return newvideo;

  }

  async update(id: string, videoData: any): Promise<VideoRO> {
    let toUpdate = await this.videoRepository.findOne(id);
    let updated = Object.assign(toUpdate, videoData);
    const video = await this.videoRepository.save(updated);
    return {video};
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.videoRepository.delete(id);
  }

  async fileQueue(file: Express.Multer.File) {
    return await this.queue.add('optimize', {
        file: file
    },{delay:3000});
}
}
