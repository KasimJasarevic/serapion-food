import { Injectable } from '@angular/core';
import { OneSignalService } from 'onesignal-ngx';
import { UserService } from './user.service';
import { LocalStorageTypes } from '../enums/local-storage-types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private _oneSignal: OneSignalService,
    private _http: HttpClient,
    private _userService: UserService
  ) {}

  init() {
    this._oneSignal
      .init({
        appId: environment.notificationId,
      })
      .then(() => {
        this._oneSignal.getUserId((userId) => {
          console.log("USER ID", userId);
          if (userId) {
            localStorage.setItem(LocalStorageTypes.SUBSCRIPTION_ID, userId);
          }
        });
      });
  }

  sendOpenRestaurantMessage(restaurant: string) {
    const content = this.createContent(restaurant + ' is opened.');
    this.sendNotification(content);
  }

  sendOrderItemAddedMessage(orderItem: string) {
    const content = this.createContent(orderItem);
    this.sendNotification(content);
  }

  sendCloseRestaurantMessage(restaurant: string) {
    const content = this.createContent(restaurant + ' is closed.');
    this.sendNotification(content);
  }

  sendLastCall(restaurant: string) {
    const content = this.createContent(
      'Last call in ' + restaurant + ' order.'
    );
    this.sendNotification(content);
  }

  sendNotificationToUsers(ids: string[], message: string) {
    const content = this.createContentForUsers(ids, message);
    this.sendNotification(content);
  }

  sendMentionToUsers(ids: string[], message: string) {
    const content = this.createContentForUsers(ids, message);
    this.sendNotification(content);
  }

  private createContent(message: string) {
    return {
      app_id: environment.notificationId,
      contents: { en: message },
      included_segments: ['Active Users', 'Inactive Users'],
    };
  }

  private getHeaders() {
    return new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('Authorization', 'Basic ' + environment.signal_one_api_key);
  }

  private sendNotification(content: any) {
    this._http
      .post('https://onesignal.com/api/v1/notifications', content, {
        headers: this.getHeaders(),
      })
      .subscribe();
  }

  private createContentForUsers(ids: string[], message: string) {
    return {
      app_id: environment.notificationId,
      contents: { en: message },
      include_player_ids: ids,
    };
  }
}
