import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule} from "./material.module";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WelcomeComponent } from './welcome/welcome.component';
import {AppRoutingModule} from "./app-routing.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import {AuthService} from "./auth/auth.service";
import {TrainingService} from "./training/training.service";
import {environment} from "../environment/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {UIService} from "./shared/ui.service";
import {AuthModule} from "./auth/auth.module";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {StoreModule} from "@ngrx/store";
import {appReducer} from "./app.reducer";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatSlideToggleModule,
    AppRoutingModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    AngularFirestoreModule,
    StoreModule.forRoot({ui: appReducer})
  ],
  providers: [AuthService,TrainingService,UIService],
  bootstrap: [AppComponent],
})
export class AppModule { }
