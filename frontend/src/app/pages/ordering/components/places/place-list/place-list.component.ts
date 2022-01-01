import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IPlace} from '../models/place.model';
import {PlaceService} from '../services/place.service';
import {NotificationService} from "../../../../../core/services/notification.service";
import {SubSink} from "../../../../../core/helpers/sub-sink";
import {WebsocketMessagesService} from "../../../../../core/services/websocket-messages.service";

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
})
export class PlaceListComponent implements OnInit, OnDestroy {
  places: IPlace[] = [];
  private subs = new SubSink();

  constructor(private _placeService: PlaceService,
              private _websocketService: WebsocketMessagesService,
              private _notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.subs.sink = this._placeService.getAllPlaces()
      .subscribe(places => {
        this.places = places;
      });

    this.subs.sink = this._websocketService.onRestaurantAdded()
      .subscribe((data: any) => {
        this.places.push(data);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openRestaurant(name: string) {
    this._notificationService.sendLastCall(name);
  }
}
