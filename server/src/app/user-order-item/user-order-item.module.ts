import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrderItemController } from './user-order-item.controller';
import { UserOrderItemEntity } from './user-order-item.entity';
import { UserOrderItemService } from './user-order-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrderItemEntity])],
  controllers: [UserOrderItemController],
  providers: [UserOrderItemService],
})
export class UserOrderItemModule {}
