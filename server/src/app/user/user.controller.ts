import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll(): Observable<UserDTO[]> {
    return this.userService.getAll();
  }

  @Get(':userId')
  getOne(@Param('userId') userId: number): Observable<UserDTO> {
    return this.userService.getOne(userId);
  }
}
