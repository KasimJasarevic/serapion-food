import {Injectable, Logger} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupDatabaseService {
  private logger = new Logger(CleanupDatabaseService.name);

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_3PM)
  cleanDatabase() {
    // TODO: Clean orders, order items, comments in past, keep current day
    this.logger.log("Database cleaned");
  }
}
