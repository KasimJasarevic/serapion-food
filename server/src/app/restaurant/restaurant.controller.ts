import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { RestaurantDTO } from './restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { WebsocketGatewayService } from '../events/websocket-gateway.service';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'))
export class RestaurantController {
  constructor(
    private _restaurantService: RestaurantService,
    private _websocketGatewayService: WebsocketGatewayService,
  ) {}

  @Post()
  addNewPlace(@Body() payload: RestaurantDTO, @Res() res) {
    this._restaurantService.addNewPlace(payload).subscribe((place) => {
      this._websocketGatewayService.sendNewRestaurantMessage(place);
      res.json(place);
    });
  }

  @Get()
  getAllPlaces(): Observable<RestaurantDTO[]> {
    return this._restaurantService.getAllPlaces();
  }
}
