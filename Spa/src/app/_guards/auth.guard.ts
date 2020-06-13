import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private alertify: AlertifyService, private router: Router,
      private authService: AuthService) {}

  canActivate(): boolean {
    if(this.authService.loggedIn()){
      return true;
    }
    this.alertify.error('No tiene permisos para acceder');
    this.router.navigate(['/home']);
    return false;
  }
  
}
