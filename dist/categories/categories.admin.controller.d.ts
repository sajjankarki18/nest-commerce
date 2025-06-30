import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class CategoriesAdminController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    createCategory(categoryDto: CreateCategoryDto): Promise<Category | null>;
    getAllCategories(page?: number, limit?: number, status?: StatusEnumType): Promise<{
        data: Category[];
        page: number;
        limit: number;
        total: number;
    }>;
    getCategoryById(id: string): Promise<Category>;
    updateCategory(id: string, categoryDto: UpdateCategoryDto): Promise<Category | null>;
    deleteCategory(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
