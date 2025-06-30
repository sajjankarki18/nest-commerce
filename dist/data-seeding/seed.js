"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const typeorm_1 = require("typeorm");
const seed_data_1 = require("./seed-data");
async function runSeeder() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    await (0, seed_data_1.seedData)(dataSource);
    await app.close();
}
void runSeeder();
//# sourceMappingURL=seed.js.map