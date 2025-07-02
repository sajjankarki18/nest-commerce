"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const rate_limitter_exception_1 = require("./global-exception/rate-limitter.exception");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Store-Backend')
        .setDescription('store -> Admin/Front API')
        .setVersion('1.0')
        .addTag('sotre-backend')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new rate_limitter_exception_1.CustomThrottlerExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map