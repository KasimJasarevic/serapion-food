import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from 'src/app/core/services/user.service';
import {IPlace} from './models/place.model';
import {PlaceService} from './services/place.service';
import {WebsocketMessagesService} from "@core/services/websocket-messages.service";
import {SubSink} from "@core/helpers/sub-sink";

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
})
export class PlacesComponent implements OnInit, OnDestroy {
  showModal = false;
  private subs = new SubSink();

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _placeService: PlaceService,
    private _websocketService: WebsocketMessagesService
  ) {
  }

  ngOnInit(): void {

  }

  logout() {
    this._userService.removeUser();
    this._router.navigate(['login']);
  }

  onSubmit(form: NgForm) {
    const place: IPlace = {
      name: form.value.name,
      menu: form.value.menu,
      phoneNumber: form.value.phone,
    };

    this._placeService.addNewPlace(place).subscribe();
    this.showModal = !this.showModal;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ID exist - fetch restaurant with specific ID and populate fields
  openPlacesDialog(id?: number) {
    if (!id) {
      // Open dialog
    }
  }
}
