/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GenderType } from 'src/shared/enums/gender-type';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import bcrypt from 'bcrypt';
import { DuplicatedEmailException } from 'src/shared/exceptions/DuplictedEmail.exception';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  let mockUserRepository: {
    findOne: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
  };

  let mockJwtService: {
    signAsync: jest.Mock;
  };

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(mockUserRepository).toBeDefined();
  });

  describe('POST /auth/register', () => {
    const dto: RegisterUserDto = {
      username: 'testuser',
      gender: GenderType.FEMALE,
      country: 'England',
      email: 'test@test.com',
      password: 'Password123',
    };

    it('should create a new user with hashed password', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const createdUser = { ...dto, password: 'hashedPassword' };
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      await service.register(dto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        select: {
          id: true,
          username: true,
          gender: true,
          reputation: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
        where: { email: dto.email },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should throw if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(service.register(dto)).rejects.toThrow(
        DuplicatedEmailException,
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/login', () => {
    const dto = {
      email: 'test@test.com',
      password: 'Password123',
    };

    const user = {
      id: 1,
      email: dto.email,
      password: 'hashedPassword',
    } as User;

    it('should return access token on valid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login(dto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        userId: user.id,
      });
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('should throw if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(
        UserDoesNotExistException,
      );
    });

    it('should throw if password is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
