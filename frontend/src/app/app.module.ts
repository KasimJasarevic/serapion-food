import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {environment} from "@environments/environment";

const config: SocketIoConfig = {url: environment.ws_url, options: {transports: ['websocket']}};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
