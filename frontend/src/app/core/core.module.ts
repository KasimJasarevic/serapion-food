import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthInterceptorProvider],
})
export class CoreModule {}
