import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import { FeedService } from '../services/feed.service';
import { User } from 'src/auth/module/user.interface';
import { FeedPost } from '../module/post.interface';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private authService: AuthService, private feedService: FeedService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user:User; params: { id: number } } = request; 

    if (!user || !params) return false;

    if (user.role === 'admin') return true; //allowing admins to make requests

    const userId = user.id;
    const feedId = params.id;

    //Determine if logged-in user is the same as the user that created the feed post
    return this.authService.findUserById(userId).pipe(
      switchMap((user: User) => this.feedService.findPostById(feedId).pipe(
        map((feedPost: FeedPost) => {
          let isAuthor = user.id === feedPost.author.id;
          return isAuthor;
        })
      ))
    )
  }
}
