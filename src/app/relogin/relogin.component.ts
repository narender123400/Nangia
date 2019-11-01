import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "./../_services/databaseService";
import { DialogComponent } from './../dialog/dialog.component';
import {FormControl, Validators,FormGroup,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-relogin',
  templateUrl: './relogin.component.html',
  styleUrls: ['./relogin.component.scss']
})
export class ReloginComponent implements OnInit {
  
  
  constructor( public http: HttpClient, public db:DatabaseService, public dialog:DialogComponent, public router:Router , private formBuilder: FormBuilder , public dialogRef: MatDialogRef<ReloginComponent>   ) { }
  
  
  form:any = {};
  input_type:any = '';
  loginForm: FormGroup;
  public error: string;
  submitted = false;
  hide = true;
  
  ngOnInit() {
    this.db.token = '';
    this.input_type = 'password';
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() { return this.loginForm.controls; }
  

  
  
  
  
  login() {
    console.log(this.loginForm.value);
    
    
    let request_data=  { 'username' : this.loginForm.value.username, 'password' : this.loginForm.value.password }; 
    
    this.http.post<{token: string,data: any}>( this.db.DbUrl+'login/user_login', JSON.stringify(request_data) ).
    subscribe( r =>{ 
      console.log(r);
      
      if(r.token == "")
      {
        this.dialog.error("Invalid ! Password");
        return;  
      }
      console.log(r.data);
      
      localStorage.setItem('access_token', r.token);
      localStorage.setItem('access_result', JSON.stringify(r.data));
      this.db.datauser = r.data;
      this.db.token = r.token;

      this.dialogRef.close(true);
      //  this.db.navigation();
      
    });
  }
  
  
  
  
  
  
}
