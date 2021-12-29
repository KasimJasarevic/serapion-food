import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignedInGuard } from 'src/app/core/guards/signed-in.guard';
import { LoginComponent } from './components/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [SignedInGuard],
  },
  {
    path: ':token',
    component: LoginComponent,
    canActivate: [SignedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
