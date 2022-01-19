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

  getPlaceByName(name: string): Observable<RestaurantDTO> {
    return from(
      this._restaurantRepo
        .createQueryBuilder('restaurant')
        .where(`restaurant.name = :name`, { name })
        .getOne(),
    );
  }

  getPlaceById(id: number): Observable<RestaurantDTO> {
    return from(
      this._restaurantRepo
        .createQueryBuilder('restaurant')
        .where(`restaurant.id = :id`, { id })
        .getOne(),
    );
  }

  deletePlaceById(id: number) {
    return from(
      this._restaurantRepo
        .createQueryBuilder('restaurant')
        .delete()
        .where('restaurant.id = :id', { id })
        .execute(),
    );
  }

  updatePlace(id: number, payload: RestaurantDTO) {
    return from(
      this._restaurantRepo
        .createQueryBuilder('restaurant')
        .update()
        .set({
          name: payload.name,
          menu: payload.menu,
          phoneNumber: payload.phoneNumber,
        })
        .where('restaurant.id = :id', { id })
        .execute(),
    );
  }
}
