import { Body, Controller, Get, Param, Put } from '@nestjs/common';
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

  @Put()
  updateOne(@Body() user: UserDTO): Observable<UserDTO> {
    return this.userService.updateOne(user);
  }

  @Put('update-subscription-id/:userId/:subId')
  updateSubscriptionId(@Param('userId') userId: number, @Param('subId') subId: string): Observable<boolean> {
    return this.userService.updateSubscriptionId(userId, subId);
  }
}
