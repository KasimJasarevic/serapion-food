import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageTypes } from 'src/app/core/enums/local-storage-types';
import { IUser } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SubSink } from '@core/helpers/sub-sink';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string | null;
  private subs = new SubSink();
  private _jwtHelperService = new JwtHelperService();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _httpClient: HttpClient,
    private _themeService: ThemeService
  ) {
    this.errorMessage = null;
    this._activatedRoute.paramMap.subscribe((params) => {
      const token = params.get('token');

      if (token) {
        //   this.errorMessage = 'Google login failed!';
        // } else {

        try {
          const data = this._jwtHelperService.decodeToken(token);

          if (!data) {
            this.errorMessage = 'Google login failed, token not found!';
          } else {
            localStorage.setItem(
              LocalStorageTypes.FOOD_ORDERING_AUTH_TOKEN,
              token
            );

            const user: IUser = {
              id: data.id,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              photo: data.photo,
            };

            this._userService.user = user;

            this._router.navigate(['']);
          }
        } catch {
          this.errorMessage = "Can't decode recieved token!";
        }
      }
    });
  }

  ngOnInit(): void {}

  googleSignIn() {
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fcallback&scope=profile%20email&client_id=895104585556-t3i4u6236nkjhjf4cnr3ua81l9dq7kt0.apps.googleusercontent.com';
  }

  changeTheme() {
    this._themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
