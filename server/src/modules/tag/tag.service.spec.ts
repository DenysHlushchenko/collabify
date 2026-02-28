import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';

describe('TagService - getPopularTags', () => {
  let tagService: TagService;

  const mockTagRepo = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    loadRelationCountAndMap: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useValue: mockTagRepo,
        },
      ],
    }).compile();

    tagService = module.get<TagService>(TagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return top 10 tags ordered by post count (desc)', async () => {
    const mockTags = [
      { id: 1, name: 'javascript', postCount: 45 },
      { id: 2, name: 'typescript', postCount: 38 },
      { id: 3, name: 'nestjs', postCount: 19 },
    ];

    const mockQueryBuilder = {
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockTags),
    };

    mockTagRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const result = await tagService.getPopularTags();

    expect(result).toEqual(mockTags);
    expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      expect.stringContaining('COUNT(*) FROM post_tags'),
      'DESC',
    );
  });
});
