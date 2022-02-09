import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from '@core/helpers/sub-sink';
import { ModalService } from './services/modal.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

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
    private _modalService: ModalService,
    private _sidebarService: SidebarService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openPlacesDialog() {
    this._modalService.modalOpen();
  }

  hideSidebar() {
    this._sidebarService.toggleSidebar();
  }
}
