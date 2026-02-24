import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { DuplicatedEmailException } from 'src/shared/exceptions/DuplictedEmail.exception';
import bcrypt from 'bcrypt';
import { CountryService } from 'src/modules/country/country.service';
import { EditUserDto } from './dtos/EditUserDto';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { FeedbackStats, PostVoteStats, UserWithStats } from 'src/shared/types';
import { assignBadges } from 'src/shared/utils/libs';

enum Auth {
  SALT_ROUNDS = 10,
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly countryService: CountryService,
  ) {}

  /**
   * @param email is required.
   * @returns an existing user account that matches provided email address, otherwise, returns null.
   */
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
  }

  /**
   * @param id is required.
   * @returns an existing user account that matches provided ID, otherwise, returns null.
   */
  findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        country: true,
        posts: true,
        chatMembers: true,
      },
    });
  }

  /**
   * Finds a user account by ID and retrieves associated statistics, including post count, comment count, feedback count, upvote count, downvote count, and badge counts. Throws NotFoundException if the user account is not found.
   * @param id is required. It should be the ID of the user account to be retrieved.
   * @returns a user account along with associated statistics and badge counts.
   */
  async findByIdWithStats(id: number): Promise<UserWithStats> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        country: true,
        posts: true,
        chatMembers: true,
      },
    });

    if (!user) {
      throw new UserDoesNotExistException();
    }

    const postCount = await this.usersRepository.manager
      .getRepository('posts')
      .count({
        where: {
          user: { id },
        },
      });

    const commentCount = await this.usersRepository.manager
      .getRepository('comments')
      .count({
        where: {
          sender: { id },
        },
      });

    const postStats = await this.usersRepository.manager
      .getRepository('posts')
      .createQueryBuilder('post')
      .where('post.user_id = :userId', { userId: id })
      .select('SUM(post.upvotesCount)', 'upvotesCount')
      .addSelect('SUM(post.downvotesCount)', 'downvotesCount')
      .getRawOne<PostVoteStats>();

    const totalUpvotes = Number(postStats?.upvotesCount) || 0;
    const totalDownvotes = Number(postStats?.downvotesCount) || 0;

    const feedbackCount = await this.usersRepository.manager
      .getRepository('feedbacks')
      .count({
        where: {
          user: { id },
        },
      });

    const criteria = [
      { type: 'POST_COUNT' as const, value: postCount },
      { type: 'COMMENT_COUNT' as const, value: commentCount },
      { type: 'POST_UPVOTES' as const, value: totalUpvotes },
      { type: 'POST_DOWNVOTES' as const, value: totalDownvotes },
      { type: 'FEEDBACK_COUNT' as const, value: feedbackCount },
    ];

    const badgeCounts = assignBadges({ criteria });
    return {
      user,
      stats: {
        postsCount: postCount,
        commentsCount: commentCount,
        feedbackCount,
        upvotesCount: totalUpvotes,
        downvotesCount: totalDownvotes,
      },
      badgeCounts,
    };
  }

  /**
   * Creates a new user account with provided information. Throws DuplicatedEmailException if the email address is already in use.
   * @param body is required. It should contain username
   * @returns a newly created user account.
   */
  async create(body: RegisterUserDto): Promise<User> {
    const { username, gender, role, country, email, password } = body;

    const duplicatedUser = await this.findByEmail(email);
    if (duplicatedUser) {
      throw new DuplicatedEmailException(email);
    }

    const countryEntity = await this.countryService.findOrCreateByName(country);

    return this.usersRepository.save(
      this.usersRepository.create({
        username,
        gender,
        role,
        country: countryEntity,
        email,
        reputation: 0,
        password: await this.hashPassword(password),
        created_at: new Date(),
        updated_at: new Date(),
      }),
    );
  }

  /**
   * Updates an existing user account with provided information. Throws an error if the user account is not found.
   * @param editUserDto is required. It should contain username
   * @param id is required. It should be the ID of the user account to be updated.
   * @returns an updated user account.
   */
  async updateUser(editUserDto: EditUserDto, id: number): Promise<User> {
    const { username, gender, role, country, bio } = editUserDto;
    const user = await this.findById(id);

    if (!user) {
      throw new UserDoesNotExistException();
    }

    const countryEntity = await this.countryService.findOrCreateByName(country);

    user.username = username;
    user.gender = gender;
    user.role = role;
    user.country = countryEntity;
    user.bio = bio;
    user.updated_at = new Date();

    return this.usersRepository.save(user);
  }

  /**
   * Calculates the average rating and total feedback count for a user based on received feedback, and updates the user's reputation accordingly.
   * The reputation is set to the average rating rounded to one decimal place if there is at least one feedback entry, otherwise it is set to 0.
   * @param userId is required. It should be the ID of the user for whom to update the reputation.
   * @throws NotFoundException if the user does not exist.
   */
  async updateReputationAsAverage(userId: number): Promise<void> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.feedbacks', 'feedback')
      .where('user.id = :id', { id: userId })
      .select('AVG(feedback.rating)', 'avgRating')
      .addSelect('COUNT(feedback.id)', 'feedbackCount')
      .getRawOne<FeedbackStats>();

    const avg = result?.avgRating ? parseFloat(result.avgRating) : 0;
    const count = result?.feedbackCount ? Number(result.feedbackCount) : 0;

    const reputation = count > 0 ? Number(Math.round(avg * 10) / 10) : 0;
    await this.usersRepository.update(userId, { reputation });
  }

  /**
   * @param password is required.
   * @returns a hashed password, generated using hardcoded salt rounds.
   */
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Auth.SALT_ROUNDS);
  }
}
