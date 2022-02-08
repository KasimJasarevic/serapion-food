import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from '../order/order.service';

@Injectable()
export class CleanupDatabaseService {
  constructor(private _orderService: OrderService) {}

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_3PM)
  cleanDatabase() {
    this._orderService.cleanupOrders();
  }
}
