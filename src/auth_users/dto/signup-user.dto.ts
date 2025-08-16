import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusEnumType } from 'src/enums/StatusType.enum';

export class SignupUserDto {
  @IsNotEmpty({ message: 'First_name should not be empty.' })
  @IsString({ message: 'First name should be a valid string.' })
  first_name: string;

  @IsNotEmpty({ message: 'Last_name should not be empty.' })
  @IsString({ message: 'Last name should be a vallid string.' })
  last_name: string;

  @IsNotEmpty({ message: 'Email should not be empty.' })
  @IsEmail({}, { message: 'Invalid Email.' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty!' })
  password: string;

  @IsNotEmpty({ message: 'Please, confirm your password.' })
  confirm_password: string;

  @IsOptional()
  @IsNumber()
  phone_number: number;

  @IsOptional()
  @IsEnum(StatusEnumType, {
    message: 'The enum type must be either of {draft/published}',
  })
  status: StatusEnumType;
}
