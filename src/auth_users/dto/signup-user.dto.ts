import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty!' })
  @IsString()
  password: string;
}
