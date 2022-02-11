import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { SubSink } from '@core/helpers/sub-sink';
import { IPlace } from '../models/place.model';
import { ModalService } from '../services/modal.service';
import { PlaceService } from '../services/place.service';

@Component({
  selector: 'app-place-modal',
  templateUrl: './place-modal.component.html',
  styleUrls: ['./place-modal.component.scss'],
})
export class PlaceModalComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs = new SubSink();
  public showModal: boolean = false;
  public place: IPlace | undefined;

  placeForm = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(140),
    ]),
    phone: new FormControl(
      null,
      Validators.pattern('^\\d{3}\\s\\d{3,4}\\s\\d{3,4}$')
    ),
    menu: new FormControl(
      null,
      Validators.pattern(
        '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\//)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$'
      )
    ),
  });

  get name() {
    return this.placeForm.get('name')!;
  }

  get phone() {
    return this.placeForm.get('phone')!;
  }

  get menu() {
    return this.placeForm.get('menu')!;
  }

  constructor(
    private _modalService: ModalService,
    private _placeService: PlaceService
  ) {}

  closeModal() {
    this.place = undefined;
    this.placeForm.reset();
    this.showModal = false;
  }

  public onSubmit() {
    const newPlace: IPlace = {
      phoneNumber: this.placeForm.get('phone')?.value,
      ...this.placeForm.value,
    };

    if (this.place) {
      const withId = this.place.id;
      this.subs.sink = this._placeService
        .updatePlace(withId!, newPlace)
        .subscribe();
    } else {
      this.subs.sink = this._placeService.addNewPlace(newPlace).subscribe();
    }

    this.closeModal();
  }

  ngOnInit(): void {
    this.subs.sink = this._modalService.showModal$.subscribe((next) => {
      this.showModal = true;

      if (next) {
        this._placeService.getPlaceById(next).subscribe((next: IPlace) => {
          this.place = next;
          this.placeForm.patchValue({
            name: next.name,
            menu: next.menu,
            phone: next.phoneNumber,
          });
        });
      }
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
