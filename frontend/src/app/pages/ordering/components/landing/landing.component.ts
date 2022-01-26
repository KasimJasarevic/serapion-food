import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { IUser } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { switchMap } from 'rxjs';
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
    const currentUser = this._userService.user?.id;

    const subsId = localStorage.getItem(LocalStorageTypes.SUBSCRIPTION_ID);

    if (subsId) {
      this.subs.sink = this._userService
        .getById(<number>currentUser)
        .pipe(
          switchMap((user: IUser) => {
            user.subscriptionId = subsId;
            return this._userService.updateOne(user);
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
