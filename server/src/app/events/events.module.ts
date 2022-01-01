import { Module } from '@nestjs/common';
import { WebsocketGatewayService } from './websocket-gateway.service';

@Module({
  providers: [WebsocketGatewayService],
  exports: [WebsocketGatewayService],
})
export class EventsModule {}
