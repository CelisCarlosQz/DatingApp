import { Component, OnInit, ViewChild, Host, HostListener } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  user: User;

  @ViewChild('editForm', {static: true}) editForm: NgForm;
  
  constructor(private routes: ActivatedRoute, private alertify: AlertifyService, private userService: UserService,
    private authService: AuthService) { }

  ngOnInit() {
    this.routes.data.subscribe(
      data => {
        this.user = data['user'];
      }
    );
  }

  updateUser(){
    this.userService.updateUser(this.authService.getUserId(), this.user).subscribe(
      next => {
        this.editForm.reset(this.user);
        this.alertify.success('Perfil actualizado');
      }, error => {
        this.alertify.error(error);
      }
    );
    
  }

}