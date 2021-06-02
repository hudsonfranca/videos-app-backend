import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Request } from 'express';

const cookieExtractor = function (req: Request) {
  let token = null;

  if (req && req.cookies['authorization']) {
    token = req.cookies['authorization'];
  }
  
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: true,
      secretOrKey:"c2VjcmV0",
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserByIdWithPassword(payload.sub);
    return user;
  }
}
