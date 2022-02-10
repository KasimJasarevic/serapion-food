import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubSink } from '@core/helpers/sub-sink';
import { ModalService } from './services/modal.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

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

  // @ViewChild('confirmDialog') confirmDialog!: ModalComponent;
  // @ViewChild('cancelDialog') cancelDialog!: ModalComponent;
  // openModal() {
  //   console.log(this.confirmDialog.id);
  //   this.confirmDialog.toggleModal();
  // }
  // openModal2() {
  //   console.log(this.cancelDialog.id);
  //   console.log(this.cancelDialog.toggleModal());
  // }
}
