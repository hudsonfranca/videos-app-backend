import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { VideoService } from '../video/video.service';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => VideoService)) private videoService: VideoService,
  ) {}

  async createComment(comment: string, videoId: string, user: User) {
    const video = await this.videoService.findById(videoId);

    const commentEntity = this.commentRepository.create({
      comment,
      video,
      user,
    });

    try {
      const savedComment = await this.commentRepository.save(commentEntity);

      return await this.commentById(savedComment.id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível salvar o comentário.',
      );
    }
  }

  async commentById(id: string) {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.video', 'video')
      .select([
        'comment.id',
        'comment.comment',
        'user.id',
        'user.username',
        'user.email',
        'user.profilePicture',
        'video.id',
        'video.name',
        'video.url',
        'video.thumbnail',
      ])
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) throw new BadRequestException('Este commentário não existe.');

    return comment;
  }

  async commentsByVideo(videoId: string) {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.video', 'video')
      .select([
        'comment.id',
        'comment.comment',
        'user.id',
        'user.username',
        'user.email',
        'user.profilePicture',
        'video.id',
        'video.name',
        'video.url',
        'video.thumbnail',
      ])
      .where('comment.videoId = :videoId', { videoId })
      .getMany();

    return comments;
  }

  async deleteComment(id: string) {
    const comment = await this.commentById(id);

    try {
      await this.commentRepository.remove(comment);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível remover este comentário.',
      );
    }
  }

  async updateComment(id: string, content: string) {
    const comment = await this.commentById(id);

    comment.comment = content ? content : comment.comment;

    try {
      const savedComment = await this.commentRepository.save(comment);
      return savedComment;
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível atualizar o comentário.',
      );
    }
  }
}
