import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { IUser } from '@core/models/user.model';
import { NotificationService } from '@core/services/notification.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { Observable, of, tap } from 'rxjs';
import { OrderStatus } from '../../models/order-status-types';
import { IOrder } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { IMessage } from './models/order-chat.model';

@Component({
  selector: 'app-order-chat',
  templateUrl: './order-chat.component.html',
  styleUrls: ['./order-chat.component.scss'],
})
export class OrderChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() order: IOrder | undefined;
  @ViewChild('commentBox', { static: false }) private _commentBox!: ElementRef;
  orderStatus = OrderStatus;

  messages: IMessage[] = [];
  private subs = new SubSink();

  commentForm = new FormGroup({
    comment: new FormControl(null, Validators.required),
  });

  constructor(
    private _orderService: OrderService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService
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

  ngAfterViewChecked(): void {
    this._commentBox.nativeElement.scrollTop =
      this._commentBox.nativeElement.scrollHeight;
    this.subs.sink = this._websocketService
      .onCommentReceived()
      .subscribe(
        (next) =>
          (this._commentBox.nativeElement.scrollTop =
            this._commentBox.nativeElement.scrollHeight)
      );
  }

  onAddComment() {
    const comment: IMessage = {
      comment: this.commentForm.get('comment')?.value,
      user: JSON.parse(
        <string>(
          localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
        )
      ),
      order: this.order,
    };

    this._orderService.addNewComment(comment).subscribe();

    let ids: string[] = [];
    this.order?.orderItems.forEach((next) => {
      next.orderedItems?.forEach((item) => {
        if (item.user?.subscriptionId) {
          ids.push(item.user.subscriptionId);
        }
      });
    });
    ids = [...new Set(ids)];
    // console.log(ids);
    const str = `New message in ${this.order?.restaurant.name}!\n${this.order?.user.firstName} ${this.order?.user.lastName}\n${comment.comment}`;

    this._notificationService.sendNotificationToUsers(ids, str);
    this.commentForm.reset();
  }

  isCurrentUser(user: IUser | undefined): boolean {
    const currentUser = JSON.parse(
      <string>localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
    );

    if (currentUser) {
      if (user?.id === currentUser.id) {
        return true;
      }
    }

    return false;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
