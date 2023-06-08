import { Module } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './controllers/feed.controller';
import { FeedPostEntity } from './module/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedPostEntity])],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
