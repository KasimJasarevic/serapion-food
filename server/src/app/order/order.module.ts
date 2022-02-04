import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleanupDatabaseService } from '../database/cleanup-database.service';
import { EventsModule } from '../events/events.module';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), EventsModule],
  controllers: [OrderController],
  providers: [OrderService, CleanupDatabaseService],
})
export class OrderModule {}
