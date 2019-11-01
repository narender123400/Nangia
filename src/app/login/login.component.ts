import { Component, OnInit } from '@angular/core';
//import { SessionserviceService } from "../sessionservice.service";
import {FormControl, Validators,FormGroup,FormBuilder} from '@angular/forms';
import { DatabaseService } from "./../_services/databaseService";
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DialogComponent } from './../dialog/dialog.component';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  form:any = {};
  input_type:any = '';
  loginForm: FormGroup;
  public error: string;
  submitted = false;
  hide = true;

  constructor(  public http: HttpClient,private formBuilder: FormBuilder, public dialog:DialogComponent,  public db:DatabaseService, private router: Router) { }

  ngOnInit() {
    this.db.token = '';
    this.input_type = 'password';
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() { return this.loginForm.controls; }

  // public login() 
  // {
  //   this.submitted = true; 
  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   else
  //   {
  //     this.auth.login(this.loginForm.value.username, this.loginForm.value.password)
  //     .pipe(first())
  //     .subscribe(
  //       result => {
  //         let resp_result = JSON.parse(localStorage.getItem('access_result'));
  //         console.log(resp_result);
  //         this.router.navigate(['/dashboard']);
         
          
  //         },
  //       err => this.error = 'Could not authenticate'
  //     );
  //   }
  // }





  login() {
console.log(this.loginForm.value);

   
    let request_data=  { 'username' : this.loginForm.value.username, 'password' : this.loginForm.value.password }; 
    
    this.http.post<{token: string,data: any}>( this.db.DbUrl+'login/user_login', JSON.stringify(request_data) ).
    subscribe( r =>{ 
console.log(r);

      if(r.token == "")
      {
        this.dialog.error("Invalid ! Credentials ");
        return;  
      }
      console.log(r.data);

      localStorage.setItem('access_token', r.token);
      localStorage.setItem('access_result', JSON.stringify(r.data));
      this.db.datauser = r.data;
      this.db.token = r.token;
           this.db.navigation();

     });
    }

  


}
