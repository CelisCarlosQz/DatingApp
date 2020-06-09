import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  values: any;

  constructor(private myHttp: HttpClient) { }

  ngOnInit() {
    this.getValues();
  }

  getValues() {
    this.myHttp.get('http://localhost:5000/values/getvalue').subscribe(
      (response) => {
        this.values = response;
      }, error => { console.log(error); }
    );
  }

}