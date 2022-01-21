import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { IPlace } from './models/place.model';
import { PlaceService } from './services/place.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { SubSink } from '@core/helpers/sub-sink';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
})
export class PlacesComponent implements OnInit, OnDestroy {
  filterInput: string = '';
  showModal = false;
  private subs = new SubSink();

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _modalService: ModalService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ID exist - fetch restaurant with specific ID and populate fields
  openPlacesDialog() {
    this._modalService.modalOpen();
  }
}
