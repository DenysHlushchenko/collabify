import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1774095708085 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create countries table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "countries" ("id" SERIAL NOT NULL, "name" character varying NOT NULL UNIQUE, PRIMARY KEY ("id"))`,
    );

    // Create tags table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL UNIQUE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), PRIMARY KEY ("id"))`,
    );

    // Create users table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "gender" character varying NOT NULL, "role" character varying NOT NULL, "reputation" numeric(5,2) NOT NULL DEFAULT '0', "bio" character varying, "email" character varying NOT NULL UNIQUE, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "country_id" integer, PRIMARY KEY ("id"), CONSTRAINT "FK_users_country" FOREIGN KEY ("country_id") REFERENCES "countries"("id"))`,
    );

    // Create posts table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "group_size" integer NOT NULL, "upvotesCount" integer NOT NULL DEFAULT '0', "downvotesCount" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, PRIMARY KEY ("id"), CONSTRAINT "FK_posts_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"))`,
    );

    // Create comments table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "comments" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "upvotesCount" integer NOT NULL DEFAULT '0', "downvotesCount" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" integer, "sender_id" integer, PRIMARY KEY ("id"), CONSTRAINT "FK_comments_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id"), CONSTRAINT "FK_comments_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id"))`,
    );

    // Create chats table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "chats" ("id" SERIAL NOT NULL, "title" character varying, "max_members" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), PRIMARY KEY ("id"))`,
    );

    // Create chat_posts join table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "chat_posts" ("chat_id" integer NOT NULL, "post_id" integer NOT NULL, PRIMARY KEY ("chat_id", "post_id"), CONSTRAINT "FK_chat_posts_chat" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE, CONSTRAINT "FK_chat_posts_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE)`,
    );

    // Create chat_members table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "chat_members" ("id" SERIAL NOT NULL, "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "chat_id" integer, "user_id" integer, PRIMARY KEY ("id"), UNIQUE ("chat_id", "user_id"), CONSTRAINT "FK_chat_members_chat" FOREIGN KEY ("chat_id") REFERENCES "chats"("id"), CONSTRAINT "FK_chat_members_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"))`,
    );

    // Create messages table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "messages" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "isChatJoinMessage" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chat_id" integer NOT NULL, "sender_id" integer NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "FK_messages_chat" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE, CONSTRAINT "FK_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );

    // Create message_reactions table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "message_reactions" ("id" SERIAL NOT NULL, "reaction" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "message_id" integer, "user_id" integer, PRIMARY KEY ("id"), UNIQUE ("message_id", "user_id"), CONSTRAINT "FK_message_reactions_message" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE, CONSTRAINT "FK_message_reactions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );

    // Create post_tags join table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "post_tags" ("post_id" integer NOT NULL, "tag_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), PRIMARY KEY ("post_id", "tag_id"), CONSTRAINT "FK_post_tags_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE, CONSTRAINT "FK_post_tags_tag" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE)`,
    );

    // Create vote_type enum
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_type_enum') THEN CREATE TYPE "vote_type_enum" AS ENUM('like', 'dislike'); END IF; END $$`,
    );

    // Create post_votes table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "post_votes" ("id" SERIAL NOT NULL, "type" "vote_type_enum" DEFAULT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" integer, "user_id" integer, PRIMARY KEY ("id"), UNIQUE ("post_id", "user_id"), CONSTRAINT "FK_post_votes_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE, CONSTRAINT "FK_post_votes_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"))`,
    );

    // Create comment_votes table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "comment_votes" ("id" SERIAL NOT NULL, "type" "vote_type_enum" DEFAULT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "comment_id" integer, "user_id" integer, PRIMARY KEY ("id"), UNIQUE ("comment_id", "user_id"), CONSTRAINT "FK_comment_votes_comment" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE, CONSTRAINT "FK_comment_votes_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"))`,
    );

    // Create feedbacks table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "feedbacks" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "rating" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "sender_id" integer, PRIMARY KEY ("id"), CONSTRAINT "FK_feedbacks_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"), CONSTRAINT "FK_feedbacks_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id"))`,
    );

    // Create notifications table
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "notifications" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "content" character varying NOT NULL, "postId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "from_user_id" integer, "user_id" integer, PRIMARY KEY ("id"), CONSTRAINT "FK_notifications_from_user" FOREIGN KEY ("from_user_id") REFERENCES "users"("id"), CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "feedbacks" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "comment_votes" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "post_votes" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "post_tags" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "message_reactions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "messages" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "chat_members" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "chat_posts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "chats" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "comments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "posts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tags" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "countries" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "vote_type_enum"`);
  }
}
