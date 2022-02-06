import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {IUser} from '@core/models/user.model';
import {UserService} from '@core/services/user.service';
import {SidebarService} from 'src/app/shared/services/sidebar.service';
import {ThemeService} from 'src/app/shared/services/theme.service';
import {SocialAuthService} from "angularx-social-login";
import {find} from "rxjs";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  user: IUser | null;
  isHidden$ = this._sidebarService.isHidden$;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _sidebarService: SidebarService,
    private _themeService: ThemeService,
    private _socialAuthService: SocialAuthService
  ) {
    this.user = this._userService.user;
  }

  async logout() {
    try {
      await this._socialAuthService.signOut(true);
    } finally {
      this._userService.removeUser();
      await this._router.navigate(['login']);
    }
  }

  openSidebar() {
    this._sidebarService.toggleSidebar();
  }

  changeTheme() {
    this._themeService.toggleTheme();
  }
}
