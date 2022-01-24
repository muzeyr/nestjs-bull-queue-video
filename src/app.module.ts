import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { VideoModule } from './video/video.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    VideoModule,
    UserModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
