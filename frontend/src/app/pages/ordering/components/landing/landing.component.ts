import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { IUser } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isHidden$ = this._sidebarService.isHidden$;

  constructor(
    private _userService: UserService,
    private _sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    // User id doesn't exist
    const currentUser: IUser = this._userService.user!;

    const subsId = localStorage.getItem(LocalStorageTypes.SUBSCRIPTION_ID);

    // Get user by email for this to work
    if (subsId) {
      this.subs.sink = this._userService
        .getAllUsers()
        .pipe(
          switchMap((users: IUser[]) => {
            const user = users.find((user) => user.email === currentUser.email);

            if (user) {
              user.subscriptionId = subsId;
              this._userService.user = user;
              return this._userService.updateOne(user);
            }

            return users;
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
