import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(private authService: AuthService, private userService: UserService,
      private router: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.router.data.subscribe(
      data => {
        this.users = data['users'].result;
        this.pagination = data['users'].pagination;
      }
    );
    this.likesParam = 'Likers';
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam).subscribe(
      (response: PaginatedResult<User[]>) => {
        this.users = response.result;
        this.pagination = response.pagination;
      }, error => {
        this.alertify.error(error);
      }
    );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page; // event.page -> Is The Current Page
    this.loadUsers();
  }

}
