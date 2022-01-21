import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  user: IUser | null;

  constructor(private _userService: UserService, private _router: Router) {
    this.user = this._userService.user;
  }

  ngOnInit(): void {}

  logout() {
    this._userService.removeUser();
    this._router.navigate(['login']);
  }
}
