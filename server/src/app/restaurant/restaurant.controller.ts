import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':id')
  getPlaceById(@Param('id') id: number): Observable<RestaurantDTO> {
    return this._restaurantService.getPlaceById(id);
  }

  // 2 places with same name ???
  @Delete(':name')
  deletePlaceByName(@Param('name') name: string, @Res() res) {
    this._restaurantService
      .getPlaceByName(name)
      .subscribe((place: RestaurantDTO) => {
        this._websocketGatewayService.sendNewRestaurantDeletedMessage(place);
        this._restaurantService.deletePlaceById(place.id);

        res.json(place);
      });
  }

  @Put(':id')
  updatePlace(
    @Param('id') withId: number,
    @Body() payload: RestaurantDTO,
    @Res() res,
  ) {
    this._restaurantService.updatePlace(withId, payload).subscribe(() => {
      this._restaurantService.getPlaceById(withId).subscribe((place) => {
        this._websocketGatewayService.sendNewRestaurantUpdateMessage(place);
        res.json(place);
      });
    });
  }
}
