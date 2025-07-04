import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ProductService } from './products.service';
import { AddProductQuestionDto } from './dto/question/add-productQuestion.dto';

@Controller('/account/products')
export class productAuthController {
  constructor(private readonly productService: ProductService) {}

  @Post('/add-question/:productId')
  addQuestion(
    @Param('productId') productId: string,
    @Body() productQuestionDto: AddProductQuestionDto,
    @Req() req: { user: { userId: string } },
  ) {
    const customerId: string = req.user?.userId;
    return this.productService.addQuestion(
      productId,
      productQuestionDto,
      customerId,
    );
  }

  @Get('/questions')
  getAllQuestions(
    @Param('page') page: number = 1,
    @Param('limit') limit: number = 10,
  ) {
    return this.productService.getAllQuestions({ page, limit });
  }
}
