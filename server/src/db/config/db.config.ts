import { Chat } from '../../modules/chat/entities/chat.entity';
import { ChatMember } from '../../modules/chat/entities/chat_members.entity';
import { Comment } from '../../modules/comment/entities/comment.entity';
import { Country } from '../../modules/country/entities/country.entity';
import { Feedback } from '../../modules/feedback/entities/feedback.entity';
import { Message } from '../../modules/messages/entities/message.entity';
import { MessageReaction } from '../../modules/messages/entities/message_reaction.entity';
import { Notification } from '../../modules/notification/entities/notification.entity';
import { Post } from '../../modules/post/entities/post.entity';
import { PostTag } from '../../modules/tag/entities/post_tag.entity';
import { Tag } from '../../modules/tag/entities/tag.entity';
import { User } from '../../modules/user/entities/user.entity';
import { DataSourceOptions, DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
import { PostVote } from '../../modules/post/entities/post_vote.entity';
import { CommentVote } from '../../modules/comment/entities/comment_vote.entity';

dotenv.config();

const ssl = process.env.NODE_ENV !== 'development' && {
  rejectUnauthorized: false,
};

const synchronize = process.env.NODE_ENV === 'production' ? false : true;

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [
    User,
    Post,
    Chat,
    ChatMember,
    Comment,
    CommentVote,
    Country,
    Feedback,
    Message,
    MessageReaction,
    Notification,
    PostTag,
    PostVote,
    Tag,
  ],
  synchronize,
  ssl,
  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/migrations/*.js']
      : ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: process.env.NODE_ENV === 'production',
};

export const AppDataSource = new DataSource(databaseConfig);
