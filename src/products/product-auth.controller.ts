import { Body, Controller, Get, Param, Post, Req, Query } from '@nestjs/common';
import { ProductService } from './products.service';
import { AddProductQuestionDto } from './dto/question/add-productQuestion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Product Auth') // Group in Swagger
@Controller('/account/products')
export class productAuthController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Add a question to a product (by authenticated customer)
   */
  @Post('/add-question/:productId')
  @ApiOperation({
    summary: 'Add a product question',
    description:
      'Allows a logged-in customer to add a question for a specific product.',
  })
  @ApiParam({
    name: 'productId',
    type: String,
    required: true,
    description: 'The ID of the product to ask a question for',
    example: 'f727acce-eeff-4447-b8bf-b50fbf884a02',
  })
  @ApiBody({
    type: AddProductQuestionDto,
    description: 'The question details to add',
  })
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

  /**
   * Get all questions of products (paginated)
   */
  @Get('/questions')
  @ApiOperation({
    summary: 'Get all product questions',
    description: 'Fetches all questions asked by customers with pagination.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number (default 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of questions per page (default 10)',
    example: 10,
  })
  getAllQuestions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.getAllQuestions({ page, limit });
  }
}
