import { UserData } from '../user/user.interface';
import { VideoEntity } from './video.entity';
interface Comment {
  body: string;
}

interface VideoData {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
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

