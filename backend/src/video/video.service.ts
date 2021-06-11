import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from '../comment/comment.service';
import { User } from '../user/user.entity';
import { Video_Tag } from '../video-tag/video-tag.entity';
import { Repository } from 'typeorm';
import { Video } from './video.entity';
import * as fs from 'fs';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(Video_Tag)
    private videoTagRepository: Repository<Video_Tag>,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
  ) {}

  async videoUpload(
    video: Express.Multer.File,
    thumbnail: Express.Multer.File,
    user: User,
    tags: string[],
    name: string,
  ) {
    const videoTags = tags.map((tag) =>
      this.videoTagRepository.create({ tag: tag }),
    );

    const videoEntity = this.videoRepository.create({
      name,
      url: `/uploads/${video.filename}`,
      filename: video.filename,
      thumbnail: `/uploads/${thumbnail.filename}`,
    });

    videoEntity.user = user;

    try {
      const savedVideo = await this.videoRepository.save(videoEntity);
      videoTags.map(async (vt) => {
        vt.video = savedVideo;
        await this.videoTagRepository.save(vt);
      });
      return this.findById(savedVideo.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Não foi possível fazer o upload do video.',
      );
    }
  }

  async findById(id: string) {
    const video = await this.videoRepository.findOne(id, {
      relations: ['videotags'],
      select: ['id', 'filename', 'name', 'thumbnail', 'url'],
    });

    if (!video) throw new BadRequestException('Este video não existe');

    return video;
  }

  async findVideos() {
    const video = await this.videoRepository.find({
      select: ['id', 'filename', 'name', 'thumbnail', 'url'],
    });

    if (!video) throw new BadRequestException('Este video não existe');

    return video;
  }

  async delete(id: string) {
    const video = await this.findById(id);
    const base = process.env.PWD;
    const {filename} = video;
    try {
      await this.videoRepository.remove(video);
      try {
        fs.unlinkSync(base + `/uploads/${filename}`);
    
        console.log(`video ${filename} deletado.`);
    } catch (error) {
        console.log(error);
    }
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível deletar este video.',
      );
    }
  }

  async videosByTag(tags: string[]) {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.videotags', 'video__tag')
      .where('video__tag.tag IN (:...tags)', { tags })
      .take(10)
      .getMany();

    return videos;
  }

  async searchVideo(name: string) {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .select([
        'video.id',
        'video.name',
        'video.filename',
        'video.url',
        'video.thumbnail',
      ])
      .where('name ILIKE :name', { name: `%${name}%` })
      .getMany();

    return videos;
  }

  async searchVideosByUser(userId: string) {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .select([
        'video.id',
        'video.name',
        'video.filename',
        'video.url',
        'video.thumbnail',
      ])
      .where('video.user.id = :userId', { userId })
      .getMany();

    return videos;
  }
}
