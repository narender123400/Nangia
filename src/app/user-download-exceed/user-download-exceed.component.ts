import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from './../_services/databaseService';
import { DialogComponent } from './../dialog/dialog.component';

import {Router} from "@angular/router";
// import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-user-download-exceed',
  templateUrl: './user-download-exceed.component.html'
})
export class UserDownloadExceedComponent implements OnInit {
  
  loader:any = '';
  progress:any = '';
  start:any = "0";
  pagelimit:any = "1";
  search:any = {};
  rqst_count:any = '';
  total_page:any = ''
  lead:any = [];
  lead_count:any = [];
  pagenumber:any = '';
  user:any = [];
  user_count:any = [];
  i:any = 0;
  index:any = '0';
  navigate_type:any = '';
  form:any = {};
  // MobileNumber:any[];
  


  constructor(public db:DatabaseService, public dialog:DialogComponent) { }

  ngOnInit() {
    this.db.setData();
    this.GetUserList();
  }

  GetUserList(pagelimit:any=10,start:any=0,action:any='')
  {
    this.loader = "1";
    this.progress = "1";
    this.pagelimit = pagelimit;
    this.start = start;
    console.log(this.start);
    console.log(action);

    if(action == "refresh"){
      this.search = {};
    }

    this.db.FetchData({'search':this.search,'start':this.start,'pagelimit':this.pagelimit},'User/getExceedLimit')
    .subscribe((result:any)=>{
      console.log(result);
      this.user = result['data']
      console.log(this.user);
      this.user_count = result['user_count'];
      this.rqst_count = result['count'][0]['totalRecords'];
      console.log(this.rqst_count);
      this.total_page = Math.ceil(this.rqst_count/this.pagelimit);
      this.pagenumber = (this.start/this.pagelimit)+1;
      this.loader = '';
      this.progress = '';
      
      

    },error=>{
      console.log(error);
      this.dialog.error('Something went wrong !!! Try again... ');
    });
  }
  




edit_user(index){
  this.index = index;
  console.log(this.index);
  //this.db.navigate_type = '1';
  this.form = Object.assign({}, this.user[index]);
  console.log(this.user);
  console.log(this.form);

}



update_limit(id :any ){

      this.db.FetchData({'id' : id },'User/update_limit')
      .subscribe(res => {
       this.GetUserList(10,0);
        this.dialog.success('User Download Limit increased!');
      },err=>{
        console.log(err);
        this.dialog.error('Somthing Went wrong! Try Again....');
      });
    }
 




 


}
