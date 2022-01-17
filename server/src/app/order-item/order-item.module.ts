import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '../events/events.module';
import { OrderItemUserModule } from '../order-item-user/order-item-user.module';
import { UserModule } from '../user/user.module';
import { OrderItemController } from './order-item.controller';
import { OrderItemEntity } from './order-item.entity';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemEntity]),
    EventsModule,
    UserModule,
    OrderItemUserModule,
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
