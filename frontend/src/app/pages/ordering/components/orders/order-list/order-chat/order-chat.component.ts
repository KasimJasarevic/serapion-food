import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { IUser } from '@core/models/user.model';
import { NotificationService } from '@core/services/notification.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
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
export class OrderChatComponent implements OnInit, OnDestroy {
  @Input() order: IOrder | undefined;
  @ViewChild('commentBox', { static: false }) commentBox!: ElementRef;
  orderStatus = OrderStatus;
  users$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  toMention: IUser[] = [];
  messages: IMessage[] = [];
  private subs = new SubSink();
  commentForm = new FormGroup({
    comment: new FormControl(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(140),
    ]),
  });

  constructor(
    private _orderService: OrderService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService,
    private _toastr: ToastrService
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

      this.subs.sink = this._getUsers$().subscribe((users: IUser[]) =>
        this._populateMentionList(users)
      );
    }

    this.subs.sink = this._websocketService
      .onCommentDeleted()
      .pipe(switchMap(() => this._orderService.getComments(this.order!.id)))
      .subscribe((data: IMessage[]) => {
        this.messages = data;
        this.messages.sort((a, b) =>
          a.commentedOn! < b.commentedOn! ? -1 : 1
        );
      });

    this.subs.sink = this._websocketService
      .onOrderItemAdded()
      .pipe(switchMap((data: any) => this._getNewUsers$(data)))
      .subscribe(
        (users: IUser[] | undefined) =>
          users && this._populateMentionList(users)
      );

    this.subs.sink = this._websocketService
      .onOrderItemDeleted()
      .pipe(switchMap((data: any) => this._getNewUsers$(data)))
      .subscribe(
        (users: IUser[] | undefined) =>
          users && this._populateMentionList(users)
      );

    this.subs.sink = this._websocketService
      .onOrderItemUserAdded()
      .pipe(
        switchMap((data: any) => {
          return this._getUsers$();
        })
      )
      .subscribe((users: IUser[] | undefined) => {
        if (users) {
          this._populateMentionList(users);
        }
      });

    this.subs.sink = this._websocketService
      .onOrderItemUserDeleted()
      .pipe(switchMap((data: any) => this._getNewUsers$(data)))
      .subscribe(
        (users: IUser[] | undefined) =>
          users && this._populateMentionList(users)
      );

    this.subs.sink = this._websocketService
      .onCommentReceived()
      .subscribe((data: any) => {
        if (data.order.id === this.order?.id) {
          this.messages.push(data);
          this.messages.sort((a, b) =>
            a.commentedOn! < b.commentedOn! ? -1 : 1
          );

          setTimeout(() => {
            this.commentBox.nativeElement.scroll({
              top: Number.MAX_SAFE_INTEGER,
              left: 0,
              behavior: 'smooth',
            });
          }, 100);
        }
      });
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
        catchError((err) => {
          this._toastr.error('Something went wrong.', 'Hmmm...');
          return of(undefined);
        }),
        switchMap((data) => {
          if (data) {
            // this._toastr.success('Message sent!');
            return this._orderService.getOrderItems(data.order?.id!);
          }

          return of(undefined);
        })
      )
      .subscribe((item: IItem[] | undefined) => {
        if (item) {
          let ids: string[] = [];

          if (!!item.length) {
            item.forEach((data) => {
              data.orderedItems?.forEach((oi) => {
                if (oi.user?.subscriptionId) {
                  ids.push(oi.user.subscriptionId);
                }
              });
            });

            const currentUser = JSON.parse(
              localStorage.getItem(
                LocalStorageTypes.FOOD_ORDERING_CURRENT_USER
              ) as string
            );
            ids = [...new Set(ids)];
            if (currentUser && currentUser.subscriptionId) {
              ids = ids.filter((id) => id !== currentUser.subscriptionId);
            }

            if (!!ids.length) {
              const str = `New message in ${this.order?.restaurant.name}!\n${comment.comment}`;
              this._notificationService.sendNotificationToUsers(ids, str);
            }
          }

          if (!!this.toMention.length) {
            const indAll = this.toMention.findIndex(
              (user) => user.firstName === 'All'
            );

            let ids: string[] = [];
            if (indAll !== -1) {
              this.users$.value.forEach((user: IUser) => {
                if (user.subscriptionId) {
                  ids.push(user.subscriptionId);
                }
              });
            } else {
              this.toMention.forEach((user: IUser) => {
                if (user.subscriptionId) {
                  ids.push(user.subscriptionId);
                }
              });
            }

            const currentUser = JSON.parse(
              localStorage.getItem(
                LocalStorageTypes.FOOD_ORDERING_CURRENT_USER
              ) as string
            );
            ids = [...new Set(ids)];
            if (currentUser && currentUser.subscriptionId) {
              ids = ids.filter((id) => id != currentUser.subscriptionId);
            }

            if (!!ids.length) {
              const str = `New mention in ${this.order?.restaurant.name}!\n${this.order?.user.firstName} ${this.order?.user.lastName}\n${comment.comment}`;
              this._notificationService.sendMentionToUsers(ids, str);
            }
          }
        }
      });

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
    if (id === this.order?.id) {
      this.toMention.push(value);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private _getUsers$ = () => {
    return this._orderService.getOrderItems(this.order!.id).pipe(
      map((data: IItem[]): IUser[] => {
        return data
          .map(({ orderedItems }) => {
            return orderedItems?.map(({ user }) => user);
          })
          .flat() as IUser[];
      })
    );
  };

  private _getNewUsers$ = (thisOrder: IOrder) => {
    return thisOrder.id === this.order?.id
      ? this._orderService.getOrderItems(this.order!.id).pipe(
          map((data: IItem[]): IUser[] => {
            return data
              .map(({ orderedItems }) => {
                return orderedItems?.map(({ user }) => user);
              })
              .flat() as IUser[];
          })
        )
      : of(undefined);
  };

  private _populateMentionList = (users: IUser[]) => {
    const currentUser = JSON.parse(
      localStorage.getItem(
        LocalStorageTypes.FOOD_ORDERING_CURRENT_USER
      ) as string
    );

    if (currentUser && currentUser.subscriptionId) {
      users = users.filter(
        (user) => user.subscriptionId !== currentUser.subscriptionId
      );
    }

    let uniqueUsers: IUser[] = [
      ...new Map(users.map((user) => [user['id'], user])).values(),
    ];

    if (!!uniqueUsers.length) {
      const dummyAll: IUser = {
        id: -1,
        firstName: 'All',
        lastName: 'All',
        email: 'All',
      };

      uniqueUsers.unshift(dummyAll);
    }

    this.users$.next(uniqueUsers);
  };

  isMessageOwner = ({ user }: IMessage): boolean => {
    const currentUser = JSON.parse(
      <string>localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
    );

    if (user) {
      return user.id === currentUser.id;
    }

    return false;
  };

  handleDeleteMessage = ({ id }: IMessage) => {
    if (id) {
      this._orderService.deleteMessageWithId(id).subscribe();
      this.messages = this.messages.filter(
        (message: IMessage) => message.id !== id
      );
    }
  };
}
