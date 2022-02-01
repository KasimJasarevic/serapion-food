import {
  AfterContentInit,
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
import { UserService } from '@core/services/user.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { OrderStatus } from '../../models/order-status-types';
import { IOrder } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { IItem } from '../order-items/models/order-item.model';
import { IMessage } from './models/order-chat.model';

@Component({
  selector: 'app-order-chat',
  templateUrl: './order-chat.component.html',
  styleUrls: ['./order-chat.component.scss'],
})
export class OrderChatComponent
  implements
    OnInit,
    OnDestroy,
    AfterViewChecked,
    AfterViewInit,
    AfterContentInit
{
  @Input() order: IOrder | undefined;
  @ViewChild('commentBox', { static: false }) private _commentBox!: ElementRef;
  orderStatus = OrderStatus;
  // items$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  users$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  toMention: IUser[] = [];

  messages: IMessage[] = [];
  private subs = new SubSink();

  commentForm = new FormGroup({
    comment: new FormControl(null, Validators.required),
  });

  constructor(
    private _orderService: OrderService,
    private _userService: UserService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._userService.getAllUsers().subscribe((data) => {
      // const users: string[] = ['All'];
      // data.forEach((user: IUser) => {
      //   users.push(`${user.firstName}`);
      // });
      const dummyAll: IUser = {
        id: -1,
        firstName: 'All',
        lastName: 'All',
        email: 'All',
      };

      data.unshift(dummyAll);
      this.users$.next(data);
      // this.items$.next(users);
    });

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

          this._commentBox.nativeElement.scrollTop =
            this._commentBox.nativeElement.scrollHeight;
        }
      });
  }

  ngAfterContentInit(): void {}

  ngAfterViewInit(): void {
    this._commentBox.nativeElement.scrollIntoView({ block: 'end' });
    // this.users.forEach((user) => {
    //   this.items.push(user.firstName);
    // });
  }

  ngAfterViewChecked(): void {
    // this.subs.sink = this._userService
    //   .getAllUsers()
    //   .subscribe((data: IUser[]) => {
    //     data.forEach((user) => {
    //       this.users.push(user.firstName);
    //     });
    //   });
    // this._commentBox.nativeElement.scrollTop =
    //   this._commentBox.nativeElement.scrollHeight;
    // this.subs.sink = this._websocketService
    //   .onCommentReceived()
    //   .subscribe(
    //     (next) =>
    //       (this._commentBox.nativeElement.scrollTop =
    //         this._commentBox.nativeElement.scrollHeight)
    //   );
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

    this._orderService
      .addNewComment(comment)
      .pipe(
        switchMap((data) => {
          return this._orderService.getOrderItems(data.order?.id!);
        })
      )
      .subscribe((item: IItem[]) => {
        let ids: string[] = [];

        // If items are found
        if (!!item.length) {
          item.forEach((data) => {
            data.orderedItems?.forEach((oi) => {
              if (oi.user?.subscriptionId) {
                ids.push(oi.user.subscriptionId);
              }
            });
          });

          ids = [...new Set(ids)];

          const str = `New message in ${this.order?.restaurant.name}!\n${this.order?.user.firstName} ${this.order?.user.lastName}\n${comment.comment}`;
          this._notificationService.sendNotificationToUsers(ids, str);
        }
      });

    if (!!this.toMention.length) {
      // console.log('Mention!');
      // const matches = [...comment.comment!.matchAll(/@(\w+)/g)];
      // for (const match of matches) {
      //   const matchedName = match[1];
      // console.log(match[1]);
      const indAll = this.toMention.findIndex(
        (user) => user.firstName === 'All'
      );

      let ids: string[] = [];
      if (indAll !== -1) {
        // console.log('All users');
        this.users$.value.forEach((user: IUser) => {
          if (user.subscriptionId) {
            ids.push(user.subscriptionId);
          }
        });
      } else {
        // console.log('Specific users');
        this.toMention.forEach((user: IUser) => {
          if (user.subscriptionId) {
            ids.push(user.subscriptionId);
          }
        });
      }

      ids = [...new Set(ids)];

      if (!!ids.length) {
        const str = `New mention in ${this.order?.restaurant.name}!\n${this.order?.user.firstName} ${this.order?.user.lastName}\n${comment.comment}`;
        this._notificationService.sendNotificationToUsers(ids, str);
      }
    }

    this.toMention = [];
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

  onItemSelected(value: any, id: number) {
    // console.log(value);
    // console.log(id);
    if (id === this.order?.id) {
      this.toMention.push(value);
      // console.log(this.toMention);
    }

    // Use this later !!!
    // const str = 'The @quick, brown fox @jumps @over @a lazy @dog.';
    // const matches = [...str.matchAll(/@(\w+)/g)];
    // for (const match of matches) {
    //   console.log(match[1]);
    // }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
