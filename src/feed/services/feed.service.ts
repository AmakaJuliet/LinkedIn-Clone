import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { FeedPostEntity } from '../module/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPost } from '../module/post.interface';
import { Observable, from } from 'rxjs';
import { User } from 'src/auth/module/user.interface';

@Injectable()
export class FeedService {
    constructor (
        @InjectRepository(FeedPostEntity)
        private readonly feedPostRepository: Repository<FeedPostEntity>
    ) {}

    createPost(user: User, feedPost: FeedPost): Observable<FeedPost> {
        feedPost.author = user;
        return from(this.feedPostRepository.save(feedPost));
    }

    findAllPosts(): Observable<FeedPost[]> {
        return from(this.feedPostRepository.find());
    }

    findPosts(take: number = 10, skip: number = 10): Observable<FeedPost[]> {
      return from(
        this.feedPostRepository.findAndCount({ take, skip}).then(([posts]) => {
            return <FeedPost[]>posts;
        }),
      );
    }

    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
        return from(this.feedPostRepository.update(id, feedPost))
    }

    deletePost(id: number): Observable<DeleteResult> {
        return from(this.feedPostRepository.delete(id));
    }
}
