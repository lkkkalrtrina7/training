import {NgModule} from "@angular/core";
import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";
import {Routes, RouterModule} from "@angular/router";

const routes:Routes = [
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  ];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class AuthRoutingModule {

}
