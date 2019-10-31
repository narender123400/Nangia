import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../_services/databaseService";

import { DialogComponent } from '../../dialog/dialog.component';

import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  form: any = {};
  userid:any = '';

  constructor(public db:DatabaseService, public dialog:DialogComponent, public router:Router,public route:ActivatedRoute,) {


   }
   
   ngOnInit() {
    this.db.setData();

    this.route.params.subscribe(params=>{
      console.log(params);
      this.userid = params.id;
      console.log(this.userid);
      if( this.userid){
        this.edit_user();
      }
    });

  }

   edit_user(){
    this.db.FetchData({'userid':this.userid},'User/get_user')
    .subscribe(result=>{
      // console.log(result);
     this.form = result['data'][0];
     console.log(this.form);
     this.form.add_document=parseInt(this.form.add_document);
     this.form.delete_document=parseInt(this.form.delete_document);
     this.form.view_document=parseInt(this.form.view_document);
     this.form.download_document=parseInt(this.form.download_document);
     this.form.edit_document=parseInt(this.form.edit_document);
    //  console.log(this.form.add_document);
     
    })
 
 
  }


}
