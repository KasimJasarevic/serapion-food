import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  getAll(): Observable<UserDTO[]> {
    return from(this.userRepo.find());
  }

  findByGoogleId(googleId: string): Observable<UserDTO> {
    // return from(this.userRepo.find(params));
    return from(
      this.userRepo
        .createQueryBuilder('user')
        .where('user.googleId = :googleId', { googleId: googleId })
        .getOne(),
    );
  }

  findByEmail(email: string): Observable<UserDTO> {
    // return from(this.userRepo.find(params));

    return from(
      this.userRepo
        .createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .getOne(),
    );
  }

  getOne(userId: number): Observable<UserDTO> {
    console.log(userId);

    return from(
      this.userRepo
        .createQueryBuilder('user')
        .select('user')
        .where('user.id = :id', { id: userId })
        .getOne(),
    );
  }

  getOneById(userId: number): Observable<UserEntity> {
    console.log(userId);

    return from(
      this.userRepo
        .createQueryBuilder('user')
        .select('user')
        .where('user.id = :id', { id: userId })
        .getOne(),
    );
  }

  store(user: UserDTO): Observable<UserDTO> {
    return from(this.userRepo.create(user).save());
  }

  // This solution is not good!
}
