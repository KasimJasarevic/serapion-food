import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../order/order.entity';

@Injectable()
export class CleanupDatabaseService {
  constructor(
    @InjectRepository(OrderEntity) private _orderRepo: Repository<OrderEntity>,
  ) {}

  private logger = new Logger(CleanupDatabaseService.name);

  // @Cron('*/10 * * * * *')
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_3PM)
  cleanDatabase() {
    // TODO: Clean orders, order items, comments in past, keep current day
    const today = new Date();
    this.logger.warn(`TIME[${today}]`, `CleanUpDatabaseService`);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    this._orderRepo
      .createQueryBuilder('order')
      .delete()
      .where('order.opened_at <= :date', { date: yesterday })
      .execute();
  }
}
