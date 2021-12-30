import { Component } from '@angular/core';
import {OneSignalService} from "./core/services/one-signal.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'order-app-redesign';

  constructor(private _oneSignal: OneSignalService) {
    this._oneSignal.onInit();
  }
}
