import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../_models/Pagination';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  users: User[];

  genderList = [{value: 'male', display: 'Hombres'}, {value: 'female', display:'Mujeres'}];
  userGender: string = localStorage.getItem('gender');
  userParams: any = {};

  pagination: Pagination;

  constructor(private userService: UserService, private alertify: AlertifyService, private routes: ActivatedRoute) { }

  ngOnInit() {
    this.routes.data.subscribe(data => {
      let response = data['user'];
      this.users = response.result;
      this.pagination = response.pagination;
    });

    this.userParams.gender = this.userGender == 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'last-active';
    
  }

  resetFilters(){
    this.userParams.gender = this.userGender == 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'last-active';
    this.loadUsers();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page; // event.page -> Is The Current Page
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe(
      (response: PaginatedResult<User[]>) => {
        this.users = response.result;
        this.pagination = response.pagination;
      }, error => {
        this.alertify.error(error);
      }
    );
  }

}