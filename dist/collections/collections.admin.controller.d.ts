import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionRedirectDto } from './dto/create-collectionRedirect.dto';
import { UpdateCollectionRedirectDto } from './dto/update-collectionRedirectDto';
export declare class CollectionsAdminController {
    private readonly collectionsService;
    constructor(collectionsService: CollectionsService);
    createCollection(collectionDto: CreateCollectionDto): Promise<Collection | null>;
    getCollectionById(id: string): Promise<Collection>;
    getAllCollections(): Promise<{
        data: Collection[];
        total: number;
    }>;
    updateCollection(id: string, collectionDto: UpdateCollectionDto): Promise<Collection | null>;
    deleteCollection(id: string): Promise<{
        id: string;
        message: string;
    }>;
    createCollectionRedirect(collectionRedirectDto: CreateCollectionRedirectDto): Promise<import("./entities/collection-redirect.entity").CollectionRedirect>;
    getCollectionRedirectById(id: string): Promise<import("./entities/collection-redirect.entity").CollectionRedirect>;
    updateCollectionRedirect(id: string, collectionRedirectDto: UpdateCollectionRedirectDto): Promise<import("./entities/collection-redirect.entity").CollectionRedirect | null>;
    deleteCollectionRedirect(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
