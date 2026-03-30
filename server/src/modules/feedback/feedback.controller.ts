import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../user/auth/auth.guard';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dtos/CreateFeedback.dto';
import { Feedback } from './entities/feedback.entity';

@ApiTags('feedbacks')
@UseGuards(AuthGuard)
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create feedback' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  async createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<void> {
    return await this.feedbackService.create(createFeedbackDto);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get all feedback for a user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of feedback', type: [Feedback] })
  async getAllFeedbacksByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Feedback[]> {
    return await this.feedbackService.getAllFeedbacksByUserId(userId);
  }
}
