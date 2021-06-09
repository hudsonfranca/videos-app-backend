import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
  imports: [
    UserModule,
    JwtModule.register({
      secret: `${process.env.JWT_KEY}`,
      signOptions: { expiresIn: '1 days' },
      
    }),
  ],
})
export class AuthModule {}
