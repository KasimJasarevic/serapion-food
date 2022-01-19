import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  private element: any;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    // this.element.addEventListener('click', (el) => {
    //   if (el.target.className === 'jw-modal') {
    //     this.close();
    //   }
    // });

    // add self (this modal instance) to the modal service so it's accessible from controllers
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.element.remove();
  }

  // open modal
  open(): void {
    this.element.classList.add = 'flex';
    this.element.classList.remove = 'hidden';
  }

  // close modal
  close(): void {
    this.element.classList.remove = 'flex';
    this.element.classList.add = 'hidden';
  }
}
