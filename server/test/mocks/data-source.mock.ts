import { DataSource } from 'typeorm';

export const mockDataSourceProvider = {
  provide: DataSource,
  useValue: {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        findOneOrFail: jest.fn(),
        increment: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      },
    }),
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
    }),
  } as unknown as DataSource,
};
