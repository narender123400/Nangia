// import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../_services/databaseService";

import { DialogComponent } from '../../dialog/dialog.component';

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category-module',
  templateUrl: './add-category-module.component.html'
})
export class AddCategoryModuleComponent implements OnInit {
  form: any = {};
  sendingData = false;
  category:any = [];
  lead:any = [];
  i:any = 0;
  index:any = '0';
id :any;
constructor(public db:DatabaseService,public dialog: DialogComponent,public router:Router,private dialogRef: MatDialogRef< AddCategoryModuleComponent>,@ Inject( MAT_DIALOG_DATA) data) {    
  this. id = data. id;
  this.form.id=this. id;
  console. log( this. id);
    }

    ngOnInit() {
      this.db.setData();
  
    }

  savecat(){  
    this.sendingData = true;

    console.log(this.form);

    this.db.FetchData({'data':this.form},'Category/add_category')
    .subscribe( r =>{
          console.log(r);
          this.sendingData = false;

      if( r.msg == 'Success' ){
        this.dialog.success('Category Added Successfully!');
        this.router.navigate(['/category-list']);
      }else if( r.msg == 'Exist' ){
        this.dialog.success('Same Category Already Exist!');

      }else if( r.msg == 'Blank' ){
        this.dialog.success('Please Enter Category Name!');


      }


    },error=>{
      this.sendingData = false;

      console.log(error);
        this.dialog.error('Something went wrong !!! Try Again...')
    });
  }



}
