import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import * as crypto from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          crypto.randomBytes(16, (err, res) => {
            if (err) {
              return cb(err, null);
            }
            return cb(null, res.toString('hex') + extname(file.originalname));
          });
        },
      }),
    }),
  )
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    const user = await this.userService.createUser(
      createUserDto,
      profilePicture,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const user = await this.userService.findUserById(id);

    if (user.id !== req.user.id)
      throw new UnauthorizedException(
        'Você não pode acessar os dados deste usuário.',
      );
    return user;

    // return req.user;
  }

  @Get()
  async findUsers() {
    const user = await this.userService.findUsers();
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          crypto.randomBytes(16, (err, res) => {
            if (err) {
              return cb(err, null);
            }
            return cb(null, res.toString('hex') + extname(file.originalname));
          });
        },
      }),
    }),
  )
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    return await this.userService.update(
      updateUserDto,
      req.user,
      profilePicture,
    );
  }
}
