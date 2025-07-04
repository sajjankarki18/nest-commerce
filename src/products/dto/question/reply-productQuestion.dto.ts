import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyProductDto {
  @IsNotEmpty({ message: 'reply should not be empty!' })
  @IsString()
  reply: string;
}
