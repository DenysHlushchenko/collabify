import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GenderType, RoleType } from 'src/shared/enums/enums';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { DuplicatedEmailException } from 'src/shared/exceptions/DuplictedEmail.exception';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CountryService } from 'src/modules/country/country.service';
import { Country } from 'src/modules/country/entities/country.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  let userService: UserService;
  let authService: AuthService;
  let countryService: CountryService;

  let mockUserRepository: {
    findOne: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
  };

  let mockCountryRepository: {
    findOne: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    mockCountryRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        CountryService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    countryService = module.get<CountryService>(CountryService);
  });

  it('AuthService and UserService should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(countryService).toBeDefined();
  });

  it('userRepository and countryRepository should be defined', () => {
    expect(mockUserRepository).toBeDefined();
    expect(mockCountryRepository).toBeDefined();
  });

  describe('POST /auth/register', () => {
    const dto: RegisterUserDto = {
      username: 'testuser',
      gender: GenderType.FEMALE,
      role: RoleType.LEARNER,
      country: 'England',
      email: 'test@test.com',
      password: 'Password123',
    };

    it('should create a new user with hashed password', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockCountryRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const createdUser = { ...dto, password: 'hashedPassword' };
      mockCountryRepository.create.mockResolvedValue({
        name: dto.country,
      });
      mockCountryRepository.save.mockResolvedValue({
        name: dto.country,
      });
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      await authService.register(dto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
        },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockCountryRepository.create).toHaveBeenCalled();
      expect(mockCountryRepository.save).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should throw if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(authService.register(dto)).rejects.toThrow(
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
      username: 'test',
      email: dto.email,
      password: 'hashedPassword',
    } as User;

    it('should return access token on valid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwt-token');

      const result = await authService.login(dto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          username: user.username,
          id: user.id,
        },
        String(process.env.JWT_SECRET_KEY),
        {
          expiresIn: '1h',
        },
      );
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('should throw if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(
        UserDoesNotExistException,
      );
    });

    it('should throw if password is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id with country relation', async () => {
      const user = {
        id: 1,
        username: 'test',
        gender: GenderType.FEMALE,
        reputation: 0,
        country: {
          id: 10,
          name: 'England',
        },
      } as User;

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findById(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: {
          country: true,
          posts: true,
          chatMembers: true,
        },
      });

      expect(result).toEqual(user);
    });

    it('should return null if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('PUT /users/:id (updateUser)', () => {
    const editDto = {
      username: 'updatedUser',
      gender: GenderType.MALE,
      country: 'Germany',
    };

    it('should update existing user', async () => {
      const existingUser = {
        id: 1,
        username: 'oldUser',
        gender: GenderType.FEMALE,
        reputation: 0,
        country: { id: 1, name: 'England' },
        updated_at: new Date(),
      } as User;

      const newCountry = { id: 2, name: 'Germany' } as Country;

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      const findOrCreateByNameMock = jest.fn().mockResolvedValue(newCountry);
      countryService.findOrCreateByName = findOrCreateByNameMock;

      mockUserRepository.save.mockResolvedValue({
        ...existingUser,
        username: editDto.username,
        gender: editDto.gender,
        country: newCountry,
      });

      const result = await userService.updateUser(editDto, 1);

      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(findOrCreateByNameMock).toHaveBeenCalledWith(editDto.country);
      expect(mockUserRepository.save).toHaveBeenCalled();

      expect(result.username).toBe(editDto.username);
      expect(result.gender).toBe(editDto.gender);
      expect(result.country).toEqual(newCountry);
    });

    it('should throw error if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.updateUser(editDto, 999)).rejects.toThrow(
        'User not found',
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
