import { UserData } from '../user/user.interface';
import { VideoEntity } from './video.entity';
interface Comment {
  body: string;
}

interface VideoData {
  title: string;
  description: string;
  body?: string;
  createdAt?: Date
  updatedAt?: Date
  author?: UserData;
}

export interface CommentsRO {
  comments: Comment[];
}

export interface VideoRO {
  video: VideoEntity;
}

export interface VideosRO {
  videos: VideoEntity[];
  videosCount: number;
}

