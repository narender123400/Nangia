// import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../_services/databaseService";

import { DialogComponent } from '../../dialog/dialog.component';

import { Router } from '@angular/router';

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-add-sub-category-module',
  templateUrl: './add-sub-category-module.component.html'
})
export class AddSubCategoryModuleComponent implements OnInit {
  form: any = {};
  category2:any = [];
  id:any;
  sendingData = false;
  constructor(public db:DatabaseService,public dialog: DialogComponent,public router:Router,private dialogRef: MatDialogRef< AddSubCategoryModuleComponent>,@ Inject( MAT_DIALOG_DATA) data,public alert: MatDialog) { 

    
this. id = data. id;
this.form.id=this. id;
console. log( this. id);
  }

  ngOnInit() {
    this.db.setData();
    this.getallcat();
  }


  subsavecat(){
    // console.log(this.form);
    this.sendingData = true;

    this.db.FetchData({'data':this.form},'Category/add_category ')
    .subscribe( r =>{
        this.sendingData = false;
        console.log( r );

      if( r.msg == 'Success' ){
        this.dialog.success('Category Added Successfully!');
        this.alert.closeAll();
        this.router.navigate(['/category-list']);
      }else if( r.msg == 'Exist' ){
        this.dialog.error('Same Category Already Exist!');

      }else if( r.msg == 'Blank' ){
        this.dialog.warning('Please Enter Category Name!');


      }


    },error=>{
      console.log(error);
        this.dialog.error('Something went wrong !!! Try Again...')
    });


  }

  getallcat(){
    this.db.FetchData({},'Category/get_all_category')
    .subscribe((result)=>{
      console.log(result);
      this.category2 = result['data'];
      console.log(this.category2);

    })
  }

}
