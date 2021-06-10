import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './config/database-connection.service';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { AuthModule } from './auth/auth.module';
import { VideoTagModule } from './video-tag/video-tag.module';
import { CommentModule } from './comment/comment.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: DatabaseConnectionService }),
    UserModule,
    VideoModule,
    AuthModule,
    VideoTagModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
