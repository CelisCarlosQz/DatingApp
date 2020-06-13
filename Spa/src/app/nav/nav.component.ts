import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  usertoLogin: any = {}

  constructor(public authservice: AuthService, private alertify: AlertifyService, 
      private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authservice.login(this.usertoLogin).subscribe(next => {
      this.alertify.success('Bienvenido');

    }, error => {
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/matches']);
    });
  }

  logout(){
    localStorage.removeItem('token');
    this.alertify.warning('Adiós');
    this.router.navigate(['/home']);
  }

  isLoggedIn() {
    return this.authservice.loggedIn();
  }

}
