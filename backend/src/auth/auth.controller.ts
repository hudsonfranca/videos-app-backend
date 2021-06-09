import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { CreateUserDto } from '../user/dto/create-user.dto';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { extname, resolve } from 'path';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
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
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    const { access_token, user } = await this.authService.signup(
      createUserDto,
      profilePicture,
    );

    response.cookie('authorization', `${access_token}`);

    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.authService.login(req.user);

    response.cookie('authorization', `${access_token}`);

    return { message: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async authenticatedUser(@Request() req) {
    return await this.userService.findUserById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('authorization', ``);

    return { message: 'success' };
  }
}
