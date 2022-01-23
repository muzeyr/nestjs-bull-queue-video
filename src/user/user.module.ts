import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [
    UserController
  ],
  exports: [UserService]
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude( 
      { path: 'user', method: RequestMethod.GET }, 
      { path: 'user', method: RequestMethod.PUT },
      { path: 'user', method: RequestMethod.POST })
      .forRoutes(
        { path: 'video', method: RequestMethod.GET }, 
        { path: 'video', method: RequestMethod.PUT },
        { path: 'video', method: RequestMethod.POST }

     
      );


  }
}
