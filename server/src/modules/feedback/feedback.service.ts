import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateFeedbackDto } from './dtos/CreateFeedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a new feedback entry and updates the receiver's reputation.
   * @param createdFeedbackDto - Data transfer object containing senderId, receiverId, message, and rating.
   * @throws NotFoundException if either the sender or receiver does not exist.
   * @throws BadRequestException if the sender and receiver are the same or if the rating is out of bounds.
   */
  async create(createdFeedbackDto: CreateFeedbackDto): Promise<void> {
    const { senderId, receiverId, message, rating } = createdFeedbackDto;
    const existingSender = await this.userService.findById(senderId);
    const existingReceiver = await this.userService.findById(receiverId);

    if (!existingSender || !existingReceiver) {
      throw new NotFoundException();
    }

    if (senderId === receiverId) {
      throw new BadRequestException(
        'Sender and receiver cannot be the same user',
      );
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const feedback = this.feedbackRepository.create({
      message,
      rating,
      sender: existingSender,
      user: existingReceiver,
      created_at: new Date(),
    });

    await this.feedbackRepository.save(feedback);

    await this.userService.updateReputationAsAverage(receiverId);
  }

  /**
   * Retrieves all feedback entries for a specific user by their ID.
   * @param userId - The ID of the user for whom to retrieve feedback.
   * @returns A promise that resolves to an array of Feedback entities.
   * @throws NotFoundException if the user does not exist.
   */
  async getAllFeedbacksByUserId(userId: number): Promise<Feedback[]> {
    const existingUser = await this.userService.findById(userId);

    if (!existingUser) {
      throw new NotFoundException();
    }

    return await this.feedbackRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        sender: true,
      },
    });
  }
}
