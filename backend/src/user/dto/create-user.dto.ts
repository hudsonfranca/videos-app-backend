import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsDefined()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsDefined()
  password: string;
}
