import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  usertoLogin: any = {}
  username: string = '';
  photoUrl: string;

  constructor(public authservice: AuthService, private alertify: AlertifyService, 
      private router: Router) { }

  ngOnInit() {
    this.username = this.authservice.getUsername();
    this.authservice.currentPhotoUrl.subscribe(serviceUrl => this.photoUrl = serviceUrl);
  }

  login(loginForm: NgForm) {
    this.authservice.login(this.usertoLogin).subscribe(next => {
      this.username = this.authservice.getUsername();
      this.alertify.success('Bienvenido');
      loginForm.reset();
    }, error => {
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/matches']);
    });
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('url');

    this.alertify.warning('Adiós');
    this.router.navigate(['/home']);
  }

  isLoggedIn() {
    return this.authservice.loggedIn();
  }

}