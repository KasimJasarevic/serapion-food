import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'order-app-redesign';
  darkTheme$: Observable<boolean>;

  constructor(private _themeService: ThemeService) {
    this.darkTheme$ = this._themeService.darkTheme$;
  }
}
