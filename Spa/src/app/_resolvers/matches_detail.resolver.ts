import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MatchesDetailResolver implements Resolve<User> {

    constructor(private userService: UserService, private alertify: AlertifyService,
        private router: Router){}

    resolve(route: ActivatedRouteSnapshot) : Observable<User> {
        return this.userService.getUser(route.params['id']).pipe(catchError(
            error => {
                this.alertify.error('No se pudo obtener información');
                this.router.navigate(['/matches']);
                return of(null);
            }
        ));
    }
}