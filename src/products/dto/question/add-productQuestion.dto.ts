import { IsNotEmpty, IsString } from 'class-validator';

export class AddProductQuestionDto {
  @IsNotEmpty({ message: 'Question should not be empty!' })
  @IsString()
  question: string;
}
