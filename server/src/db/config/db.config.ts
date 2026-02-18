import { Chat } from '../../chat/entities/chat.entity';
import { ChatMember } from '../../chat/entities/chat_members.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Country } from '../../country/entities/country.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Message } from '../../messages/entities/message.entity';
import { MessageReaction } from '../../messages/entities/message_reaction.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Post } from '../../post/entities/post.entity';
import { PostTag } from '../../tag/entities/post_tag.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import { DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config();

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
    Country,
    Feedback,
    Message,
    MessageReaction,
    Notification,
    PostTag,
    Tag,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
};
