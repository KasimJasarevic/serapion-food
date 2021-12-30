import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable } from 'rxjs';
import { RestaurantDTO } from './restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private _restaurantService: RestaurantService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  addNewPlace(@Body() payload: RestaurantDTO): Observable<RestaurantDTO> {
    return from(this._restaurantService.addNewPlace(payload));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllPlaces(): Observable<RestaurantDTO[]> {
    return from(this._restaurantService.getAllPlaces());
  }
}
