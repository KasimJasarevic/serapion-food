import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { LandingComponent } from './components/landing/landing.component';
import {PlaceFormComponent} from "./components/places/place-form/place-form.component";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'restaurant/add',
    component: PlaceFormComponent
  },
  {
    path: 'restaurant/edit/:id',
    component: PlaceFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderingRoutingModule {}
