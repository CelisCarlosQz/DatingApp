import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerToogle: boolean = false;

  constructor() { }

  ngOnInit() {
    localStorage.removeItem('token');
    localStorage.removeItem('url');
    localStorage.removeItem('gender');
  }

  toogleRegisterMode() {
    this.registerToogle = true;
  }

  cancelRegisterMode(cancelRegister: boolean) {
    this.registerToogle = cancelRegister;
  }

}
