import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../user/auth/auth.guard';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dtos/CreateFeedback.dto';
import { Feedback } from './entities/feedback.entity';

@UseGuards(AuthGuard)
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<void> {
    return await this.feedbackService.create(createFeedbackDto);
  }

  @Get('users/:userId')
  async getAllFeedbacksByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Feedback[]> {
    return await this.feedbackService.getAllFeedbacksByUserId(userId);
  }
}
