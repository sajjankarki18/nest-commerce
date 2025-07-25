import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusEnumType } from 'src/enums/StatusType.enum';

export class SignupCustomerDto {
  @IsNotEmpty({ message: 'username should not be empty!' })
  @IsString({ message: 'enter a valid username' })
  username: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty!' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Please confirm your pasword!' })
  @IsString()
  confirm_password: string;

  @IsOptional()
  @IsNumber()
  phone_number: string;

  @IsOptional()
  @IsEnum(StatusEnumType, {
    message: 'The enum type must be either of {draft/published}',
  })
  status: StatusEnumType;
}
