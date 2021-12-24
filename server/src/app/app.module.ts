import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { UserOrderItemModule } from './user-order-item/user-order-item.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    RestaurantModule,
    CommentModule,
    OrderModule,
    OrderItemModule,
    UserOrderItemModule,
  ],
})
export class AppModule {}
