import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EditResolver implements Resolve<User>{

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService,
        private authService: AuthService){}

    resolve() : Observable<User> {
        const userId = this.authService.getUserId();
        return this.userService.getUser(userId).pipe(catchError(
            error => {
                this.alertify.error('No se pudo obtener información');
                this.router.navigate(['/']);
                return of(null);
            }
        ));
    }
    
}