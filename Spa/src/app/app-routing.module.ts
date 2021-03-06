import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatchesComponent } from './matches/matches.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MatchesDetailComponent } from './matches/matches-detail/matches-detail.component';
import { MatchesDetailResolver } from './_resolvers/matches_detail.resolver';
import { EditComponent } from './nav/edit/edit.component';
import { EditResolver } from './_resolvers/edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { MatchesResolver } from './_resolvers/matches.resolver';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';


const routes: Routes = 
  [
    { path: '', component: HomeComponent },
    {
      path: '',
      runGuardsAndResolvers: 'always',
      canActivate: [AuthGuard],
      children: [
        { path: 'edit', component: EditComponent, resolve: {user: EditResolver}, 
          canDeactivate: [PreventUnsavedChanges] },
        { path: 'matches', component: MatchesComponent, resolve: {user: MatchesResolver} },
        { path: 'matches/:id', component: MatchesDetailComponent, resolve: {user: MatchesDetailResolver} },
        { path: 'messages', component: MessagesComponent, resolve: {messages: MessagesResolver} },
        { path: 'lists', component: ListsComponent, resolve: {users: ListsResolver} }
      ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }