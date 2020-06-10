import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/auth/';

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

  register(usertoRegister: any){
    return this.http.post(this.baseUrl + 'register', usertoRegister);
  }
}
