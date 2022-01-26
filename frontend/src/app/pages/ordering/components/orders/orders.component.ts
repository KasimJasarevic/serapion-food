import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  user: IUser | null;
  isHidden$ = this._sidebarService.isHidden$;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _sidebarService: SidebarService,
    private _themeService: ThemeService
  ) {
    this.user = this._userService.user;
  }

  ngOnInit(): void {}

  logout() {
    this._userService.removeUser();
    this._router.navigate(['login']);
  }

  openSidebar() {
    this._sidebarService.isHidden$.next(false);
  }

  changeTheme() {
    this._themeService.toggleTheme();
  }
}
