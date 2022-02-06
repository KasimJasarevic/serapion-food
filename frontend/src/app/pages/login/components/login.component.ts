import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LocalStorageTypes} from 'src/app/core/enums/local-storage-types';
import {UserService} from 'src/app/core/services/user.service';
import {HttpClient} from '@angular/common/http';
import {SubSink} from '@core/helpers/sub-sink';
import {ThemeService} from 'src/app/shared/services/theme.service';
import {GoogleLoginProvider, SocialAuthService} from "angularx-social-login";

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
    private _themeService: ThemeService,
    private _socialAuthService: SocialAuthService
  ) {
    this.errorMessage = null;
  }

  ngOnInit(): void {
    this.subs.sink = this._socialAuthService.authState.subscribe((user) => {
      if (user !== null && this._userService.user === null) {
        this._httpClient.post('auth/google/callback', user).subscribe((response: any) => {
          if (response.token) {
            try {
              const data = this._jwtHelperService.decodeToken(response.token);

              if (!data) {
                this.errorMessage = 'Google login failed, token not found!';
              } else {
                localStorage.setItem(
                  LocalStorageTypes.FOOD_ORDERING_AUTH_TOKEN,
                  response.token
                );

                this._userService.user = {
                  id: data.id,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email,
                  photo: data.photo,
                };

                this._router.navigate(['']);
              }
            } catch {
              this.errorMessage = "Can't decode recieved token!";
            }
          }
        });
      }
    });
  }

  googleSignIn() {
    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  changeTheme() {
    this._themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
