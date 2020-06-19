import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { NgxGalleryModule } from 'ngx-gallery';

import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { MatchesComponent } from './matches/matches.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { MatchesCardComponent } from './matches/matches-card/matches-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MatchesDetailComponent } from './matches/matches-detail/matches-detail.component';
import { UserService } from './_services/user.service';
import { MatchesDetailResolver } from './_resolvers/matches_detail.resolver';
import { EditComponent } from './nav/edit/edit.component';
import { EditResolver } from './_resolvers/edit.resolver';

import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoeditorComponent } from './nav/edit/photoeditor/photoeditor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MatchesResolver } from './_resolvers/matches.resolver';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MatchesMessagesComponent } from './matches/matches-detail/matches-messages/matches-messages.component';

export function tokenGetter() {
  return localStorage.getItem('token');
};

export class CustomHammerConfig extends HammerGestureConfig  {
  overrides = {
      pinch: { enable: false },
      rotate: { enable: false }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ValueComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MatchesComponent,
    MessagesComponent,
    ListsComponent,
    MatchesCardComponent,
    MatchesDetailComponent,
    EditComponent,
    PhotoeditorComponent,
    TimeAgoPipe,
    MatchesMessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
    FileUploadModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    JwtModule.forRoot({
      config:
      {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/auth']  
      }
    })
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
    AuthService,
    UserService,
    AlertifyService,
    MatchesDetailResolver, // When Tryinh To Get One User
    EditResolver,
    MatchesResolver,
    MessagesResolver,
    ListsResolver,
    AuthGuard,
    PreventUnsavedChanges,
    ErrorInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }