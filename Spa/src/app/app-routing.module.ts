import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatchesComponent } from './matches/matches.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MatchesDetailComponent } from './matches/matches-detail/matches-detail.component';
import { MatchesDetailResolver } from './_resolvers/matches_detail.resolver';


const routes: Routes = 
  [
    { path: '', component: HomeComponent },
    {
      path: '',
      runGuardsAndResolvers: 'always',
      canActivate: [AuthGuard],
      children: [
        { path: 'matches', component: MatchesComponent },
        { path: 'matches/:id', component: MatchesDetailComponent, resolve: {user: MatchesDetailResolver} },
        { path: 'messages', component: MessagesComponent },
        { path: 'lists', component: ListsComponent }
      ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
