import { MaxLength } from 'class-validator';

export class RestaurantDTO {
  id: number;
  @MaxLength(140)
  name: string;
  menu?: string;
  phoneNumber?: string;
}
