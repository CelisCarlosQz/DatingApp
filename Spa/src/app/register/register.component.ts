import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  usertoRegister: any = {}

  constructor(private authservice: AuthService) { }

  ngOnInit() {
  }

  register() {
    this.authservice.register(this.usertoRegister).subscribe(
      () => {
        console.log('Registered successfully');
      }, error => {
        console.log(error);
      }
    );
  }

  cancelRegisterMode(){
    this.cancelRegister.emit(false);
  }
}