import { Test, TestingModule } from "@nestjs/testing";
import { BannerService } from "./banners.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Banner } from "./entities/banner.entity";
import { Category } from "src/categories/entities/category.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Product } from "src/products/entities/product.entity";
import { RedirectTypeEnum } from "src/enums/RedirectType.enum";
import { CreateBannerDto } from "./dto/create-banner.dto";
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";

describe("BannerService", () => {
  let service: BannerService;

  const mockBannerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoryRepository = {
    findOne: jest.fn(),
  };

  const mockProductsRepository = {
    findOne: jest.fn(),
  };

  const mockCollectionsRepository = {
    findOne: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BannerService,
        { provide: getRepositoryToken(Banner), useValue: mockBannerRepository },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(Collection),
          useValue: mockCollectionsRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  /* create banner test */
  describe("CreateBanner", () => {
    const dto = {
      title: "Test Banner",
      image_url: "https://example.com/banner.jpg",
      status: "active",
      is_active: true,
      redirect_type: RedirectTypeEnum.Category,
      redirect_id: "cat123",
    };

    it("should create a banner successfully", async () => {
      mockBannerRepository.count.mockResolvedValue(15);
      mockCategoryRepository.findOne.mockResolvedValue({ id: "cat123" });
      mockBannerRepository.create.mockReturnValue(dto);
      mockBannerRepository.save.mockResolvedValue({ id: "1", ...dto });

      const res = await service.createBanner(dto as CreateBannerDto);
      expect(res).toEqual({ id: "1", ...dto });
      expect(mockBannerRepository.save).toHaveBeenCalled();
    });

    it("should throw if banner count > 15", async () => {
      mockBannerRepository.count.mockResolvedValue(16);

      await expect(
        service.createBanner(dto as CreateBannerDto),
      ).rejects.toThrow(ConflictException);
    });

    it("should throw NotFoundException for invalid category redirect", async () => {
      mockBannerRepository.count.mockResolvedValue(5);
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createBanner(dto as CreateBannerDto),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException for invalid product redirect", async () => {
      mockBannerRepository.count.mockResolvedValue(5);
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createBanner(dto as CreateBannerDto),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException for invalid collection redirect", async () => {
      mockBannerRepository.count.mockResolvedValue(5);
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createBanner(dto as CreateBannerDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  /* get banner by id test */
  describe("getBannerById", () => {
    it("it should return a banner", async () => {
      const banner = { id: "123", title: "Sample banner" };
      mockBannerRepository.findOne.mockResolvedValue(banner);

      const res = await service.getBannerById("123");
      expect(res).toEqual(banner);
    });

    it("should throw NotFoundException if not found", async () => {
      mockBannerRepository.findOne.mockResolvedValue(null);

      await expect(service.getBannerById("not-found")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* get all banners */
  describe("getAllBanners", () => {
    it("it should return all banners", async () => {
      const banners = [{ id: "1" }, { id: "2" }];
      mockBannerRepository.find.mockResolvedValue(banners);

      const res = await service.getAllBanners();
      expect(res).toEqual({ data: banners, total: 2 });
    });

    it("should throw an InternalServerErrorException on server failure", async () => {
      mockBannerRepository.find.mockRejectedValue(new Error("DB error"));

      await expect(service.getAllBanners()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  /* delete a banner */
  describe("deleteBanner", () => {
    it("should delete a banner successfully!", async () => {
      mockBannerRepository.findOne.mockResolvedValue({ id: "123" });
      mockBannerRepository.delete.mockResolvedValue({});

      const res = await service.deleteBanner("123");
      expect(res).toEqual({
        id: "123",
        message: "banner deleted successfully!",
      });
    });

    it("should throw NotFoundException if banner not found", async () => {
      mockBannerRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteBanner("123")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
