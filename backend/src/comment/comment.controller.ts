import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('video/:video_id')
  async createComment(
    @Request() req,
    @Body() comment: { comment: string; parentId?: string },
    @Param('video_id') video_id: string,
  ) {
    const savedComment = await this.commentService.createComment(
      comment.comment,
      video_id,
      req.user,
    );

    return savedComment;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Request() req, @Param('id') id: string) {
    const comment = await this.commentService.commentById(id);

    if (comment.user.id !== req.user.id)
      throw new UnauthorizedException('Você não pode deletar este comentario');

    return await this.commentService.deleteComment(comment.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateComment(
    @Request() req,
    @Param('id') id: string,
    @Body() content: { content: string },
  ) {
    const comment = await this.commentService.commentById(id);

    if (comment.user.id !== req.user.id)
      throw new UnauthorizedException(
        'Você não pode atualizar este comentario',
      );

    return await this.commentService.updateComment(id, content.content);
  }

  @Get('video/:id')
  async commentsByVideo(@Request() req, @Param('id') id: string) {
    const comments = await this.commentService.commentsByVideo(id);

    return comments;
  }

  @Get(':id')
  async commentsById(@Param('id') id: string) {
    const comment = await this.commentService.commentById(id);

    return comment;
  }
}
