import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MatchesResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;

    constructor(private userService: UserService, private alertify: AlertifyService,
        private router: Router){}

    resolve(route: ActivatedRouteSnapshot) : Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(catchError(
            error => {
                this.alertify.error('No se pudo obtener información');
                this.router.navigate(['/']);
                return of(null);
            }
        ));
    }
}