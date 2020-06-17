import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl =  environment.apiUrl +  'auth/';

  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  login(usertoLogin: any) {
    return this.http.post(this.baseUrl + 'login', usertoLogin).pipe(
      map((response: any) => {
        const tokenObj = response;
          if(tokenObj){
            localStorage.setItem('token', tokenObj.token);
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

  getUserId(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return token['nameid'];
  }

  getUsername(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    return token['unique_name'];
  }
}