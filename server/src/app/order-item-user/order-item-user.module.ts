import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemUserController } from './order-item-user.controller';
import { OrderItemToUserEntity } from './order-item-user.entity';
import { OrderItemUserService } from './order-item-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemToUserEntity])],
  controllers: [OrderItemUserController],
  providers: [OrderItemUserService],
  exports: [OrderItemUserService],
})
export class OrderItemUserModule {}
