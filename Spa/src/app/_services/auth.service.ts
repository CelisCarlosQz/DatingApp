import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/auth/';

  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  login(usertoLogin: any) {
    return this.http.post(this.baseUrl + 'login', usertoLogin).pipe(
      map((response: any) => {
        const tokenObj = response;
          if(tokenObj){
            localStorage.setItem('token', tokenObj.token);
            this.decodedToken = this.jwtHelper.decodeToken(tokenObj.token);
          }
      })
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(usertoRegister: any){
    return this.http.post(this.baseUrl + 'register', usertoRegister);
  }
}
