import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  constructor() { }

  async onLoad(): Promise<any> {
    window.OneSignal = window.OneSignal || [];
    return new Promise((resolve) => {
      window.OneSignal.push(function() {
        resolve(window.OneSignal);
      });
    });
  }

  onInit():void {
    this.onLoad().then((OneSignal)=>{
      OneSignal.init({
        appId: environment.notificationId,
        notifyButton: {
          enable: true
        },
        autoResubscribe: true
      });
    })
  }
}
