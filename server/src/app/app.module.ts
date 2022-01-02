import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ConfigModule } from '@nestjs/config';
import { MainConfig } from 'src/main.config';
import { DatabaseConfig } from 'src/database.config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [MainConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    UserModule,
    RestaurantModule,
    CommentModule,
    OrderModule,
    OrderItemModule,
    AuthModule,
    EventsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'front'),
    }),
  ],
})
export class AppModule {}
