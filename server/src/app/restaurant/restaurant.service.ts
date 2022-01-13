import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { RestaurantDTO } from './restaurant.dto';
import { RestaurantEntity } from './restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private _restaurantRepo: Repository<RestaurantEntity>,
  ) {}

  addNewPlace(place: RestaurantDTO): Observable<RestaurantDTO> {
    return from(this._restaurantRepo.create(place).save());
  }

  getAllPlaces(): Observable<RestaurantDTO[]> {
    return from(
      this._restaurantRepo
        .createQueryBuilder('restaurant')
        .leftJoinAndSelect('restaurant.order', 'order')
        .where(`order.id is null`)
        .getMany(),
    );
  }
}
