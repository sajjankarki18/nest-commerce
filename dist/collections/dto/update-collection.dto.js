"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCollectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_collection_dto_1 = require("./create-collection.dto");
class UpdateCollectionDto extends (0, swagger_1.PartialType)(create_collection_dto_1.CreateCollectionDto) {
    id;
}
exports.UpdateCollectionDto = UpdateCollectionDto;
//# sourceMappingURL=update-collection.dto.js.map