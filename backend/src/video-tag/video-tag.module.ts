import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video_Tag } from './video-tag.entity';

@Module({
  providers: [],
  controllers: [],
  imports: [TypeOrmModule.forFeature([Video_Tag])],
  exports: [TypeOrmModule.forFeature([Video_Tag])],
})
export class VideoTagModule {}
