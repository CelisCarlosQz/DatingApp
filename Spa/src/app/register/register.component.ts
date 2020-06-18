import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ignoreElements } from 'rxjs/operators';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  usertoRegister: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>; // For Calendar

  constructor(private authservice: AuthService, private alertify: AlertifyService,
    private formsBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm = this.formsBuilder.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateofBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup){
    return g.get('password').value == g.get('confirmPassword').value ? null : { 'mismatch' : true }
  }

  register() {
    if(this.registerForm.valid){
      this.usertoRegister = Object.assign({}, this.registerForm.value);
      this.authservice.register(this.usertoRegister).subscribe(
      () => {
        this.alertify.success('Registro exitoso');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authservice.login(this.usertoRegister).subscribe(
          () => {
            this.router.navigate(['/matches']);
          }
        );
      }
    );
  }
  }

  cancelRegisterMode(){
    this.cancelRegister.emit(false);
  }
}