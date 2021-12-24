import { Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return `Hello from Users!`;
  }

  @Get(':userId')
  findOne(@Param('userId') userId: number) {
    return `Hello from User(${userId})`;
  }

  @Post()
  createUser(): Observable<string> {
    return this.userService.createUser();
  }
}
