import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get()
  findAll() {
    return `Hello from Users!`;
  }

  @Get(':userId')
  findOne(@Param('userId') userId: number) {
    return `Hello from User(${userId})`;
  }
}
