import { forwardRef, Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from './video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoTagModule } from '../video-tag/video-tag.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
  imports: [
    TypeOrmModule.forFeature([Video]),
    VideoTagModule,
    forwardRef(() => CommentModule),
  ],
  exports: [VideoService],
})
export class VideoModule {}
