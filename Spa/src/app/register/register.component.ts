import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  usertoRegister: any = {}

  constructor(private authservice: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authservice.register(this.usertoRegister).subscribe(
      () => {
        this.alertify.success('Registro exitoso');
      }, error => {
        this.alertify.error(error);
      }
    );
  }

  cancelRegisterMode(){
    this.cancelRegister.emit(false);
  }
}