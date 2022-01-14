import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { IUser } from '@core/models/user.model';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { Observable, of, tap } from 'rxjs';
import { IOrder } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { IMessage } from './models/order-chat.model';

@Component({
  selector: 'app-order-chat',
  templateUrl: './order-chat.component.html',
  styleUrls: ['./order-chat.component.scss'],
})
export class OrderChatComponent implements OnInit, OnDestroy {
  @Input() order: IOrder | undefined;
  messages: IMessage[] = [];
  private subs = new SubSink();

  constructor(
    private _orderService: OrderService,
    private _websocketService: WebsocketMessagesService
  ) {}

  ngOnInit(): void {
    if (this.order) {
      this.subs.sink = this._orderService
        .getComments(this.order.id)
        .subscribe((data: IMessage[]) => {
          this.messages = data;
          this.messages.sort((a, b) =>
            a.commentedOn! < b.commentedOn! ? -1 : 1
          );
        });
    }

    this.subs.sink = this._websocketService
      .onCommentReceived()
      .subscribe((data: any) => {
        if (data.order.id === this.order?.id) {
          this.messages.push(data);
          this.messages.sort((a, b) =>
            a.commentedOn! < b.commentedOn! ? -1 : 1
          );
        }
      });
  }

  onAddComment(form: NgForm) {
    const comment: IMessage = {
      comment: form.value.comment,
      user: JSON.parse(
        <string>(
          localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
        )
      ),
      order: this.order,
    };

    this._orderService.addNewComment(comment).subscribe();
    form.resetForm();
  }

  isCurrentUser(user: IUser | undefined): boolean {
    const currentUser = JSON.parse(
      <string>localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
    ).id;

    if (user?.id === currentUser) {
      return true;
    }

    return false;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
