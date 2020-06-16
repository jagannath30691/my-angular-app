import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TelephoneComponent } from './telephone/telephone.component';


const routes: Routes = [
  { path: '', component: TelephoneComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
