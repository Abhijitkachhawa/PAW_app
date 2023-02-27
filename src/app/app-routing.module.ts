import { NonauthGuard } from './../guard/nonauth.guard';
import { AuthGuard } from './../guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
  path:"auth",loadChildren:()=> import('./auth/auth.module').then((m)=> m.AuthModule),canActivate:[NonauthGuard]
},
{
  path:"page",loadChildren:()=> import('./page/page.module').then((m)=> m.PageModule),canActivate:[AuthGuard]
},
{ path: '', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
