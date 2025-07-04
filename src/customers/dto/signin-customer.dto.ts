import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninCustomerDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty!' })
  @IsString()
  password: string;
}
