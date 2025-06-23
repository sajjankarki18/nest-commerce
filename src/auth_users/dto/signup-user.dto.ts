import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { StatusEnumType } from "src/enums/StatusType.enum";

export class SignupUserDto {
  @IsNotEmpty({ message: "first_name should not be empty" })
  @IsString({ message: "enter a valid first_name" })
  first_name: string;

  @IsNotEmpty({ message: "last_name should not be empty!" })
  @IsString({ message: "enter a valid last_name" })
  last_name: string;

  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Password should not be empty!" })
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  phone_number: number;

  @IsOptional()
  @IsEnum(StatusEnumType, {
    message: "The enum type must be either of {draft/published}",
  })
  status: StatusEnumType;
}
