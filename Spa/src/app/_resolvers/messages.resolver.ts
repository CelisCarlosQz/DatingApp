import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private userService: UserService, private alertify: AlertifyService,
        private router: Router, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot) : Observable<Message[]> {
        return this.userService.getMessages(this.authService.getUserId(),this.pageNumber, 
            this.pageSize, this.messageContainer).pipe(catchError(
            error => {
                this.alertify.error('No se pudo obtener información');
                this.router.navigate(['/']);
                return of(null);
            }
        ));
    }
}