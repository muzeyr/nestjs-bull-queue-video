import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from './video.entity';
import { UserEntity } from '../user/user.entity';
import { VideoService } from './video.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';
import { VideoProcessor } from './video.processer';
import { BullModule } from '@nestjs/bull';


@Module({
  imports: [
    TypeOrmModule.forFeature([VideoEntity, UserEntity]), UserModule,
    BullModule.registerQueue({
      name: 'file-upload',
    }),],
  providers: [VideoService, VideoProcessor],
  controllers: [
    VideoController
  ]
})
export class VideoModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'videos/feed', method: RequestMethod.GET},
        {path: 'videos', method: RequestMethod.POST},
        {path: 'videos/:slug', method: RequestMethod.DELETE},
        {path: 'videos/:slug', method: RequestMethod.PUT},
        {path: 'videos/:slug/comments', method: RequestMethod.POST},
        {path: 'videos/:slug/comments/:id', method: RequestMethod.DELETE})
  }
}
