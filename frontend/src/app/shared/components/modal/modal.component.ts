import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, take } from 'rxjs';
import { SharedModalService } from './service/shared-modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  isVisible$: Observable<string> = this._sharedModalService.showModal$;
  actionResult$: Observable<boolean> = this._sharedModalService.result$;

  constructor(private _sharedModalService: SharedModalService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  yesModal = () => {
    this._sharedModalService.yesModal(this.id);
    this._sharedModalService.toggleModal(this.id);
  };

  noModal = () => {
    this._sharedModalService.noModal(this.id);
    this._sharedModalService.toggleModal(this.id);
  };

  toggleModal = (id: string) => {
    this._sharedModalService.toggleModal(id);
    return this.actionResult$.pipe(take(1));
  };
}
