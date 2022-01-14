import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { WebsocketGatewayService } from '../events/websocket-gateway.service';
import { AddCommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(
    private _commentService: CommentService,
    private _websocketGatewayService: WebsocketGatewayService,
  ) {}

  @Post()
  addNewOrderItem(@Body() payload: AddCommentDTO, @Res() res) {
    this._commentService.addNewComment(payload).subscribe((comment) => {
      this._websocketGatewayService.sendNewCommentMessage(comment);
      res.json(comment);
    });
  }

  @Get('order/:id')
  getCommentsByOrderId(@Param('id') id: number) {
    return this._commentService.getCommentsByOrderId(id);
  }
}
