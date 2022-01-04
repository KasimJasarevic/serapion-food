import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupDatabaseService {
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_3PM)
  cleanDatabase() {
    // TODO: Clean orders, order items, comments in past, keep current day
    console.log('CLEAN database');
  }
}
