import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  usertoLogin: any = {}

  constructor(public authservice: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login() {
    this.authservice.login(this.usertoLogin).subscribe(next => {
      this.alertify.success('Bienvenido');
    }, error => {
      this.alertify.error(error);
    });
  }

  logout(){
    localStorage.removeItem('token');
    this.alertify.warning('Adiós');
  }

  isLoggedIn() {
    return this.authservice.loggedIn();
  }

}
