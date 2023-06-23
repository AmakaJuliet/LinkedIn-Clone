import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { User } from '../module/user.interface';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../module/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) 
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne(
      {
        where: { id },
        relations: ['feedPosts']})
    ).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      }),
    );
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  findImageNameByUserId(id: number): Observable<string>{
    return from(this.userRepository.findOneBy({ id })).pipe(
        map((user: User) => {
            delete user.password;
            return user.imagePath
        }),
    );
  }
}
