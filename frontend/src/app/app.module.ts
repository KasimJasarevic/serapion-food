import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '@environments/environment';
import { MentionModule } from 'angular-mentions';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from 'angularx-social-login';
import { ModalComponent } from './shared/components/modal/modal.component';

const config: SocketIoConfig = {
  url: environment.ws_url,
  options: { transports: ['websocket'] },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    SocialLoginModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '895104585556-t3i4u6236nkjhjf4cnr3ua81l9dq7kt0.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})
export class AppModule {}
