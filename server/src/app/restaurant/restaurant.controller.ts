import { Body, Controller, Get, Post } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { RestaurantDTO } from './restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private _restaurantService: RestaurantService) {}

  @Post()
  addNewPlace(@Body() payload: RestaurantDTO): Observable<RestaurantDTO> {
    return from(this._restaurantService.addNewPlace(payload));
  }

  @Get()
  getAllPlaces(): Observable<RestaurantDTO[]> {
    return from(this._restaurantService.getAllPlaces());
  }
}
