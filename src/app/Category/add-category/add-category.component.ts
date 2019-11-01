import { Component, OnInit } from '@angular/core';
// import {MatDialog} from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddCategoryModuleComponent } from '../add-category-module/add-category-module.component';
import { AddSubCategoryModuleComponent } from '../add-sub-category-module/add-sub-category-module.component';
import { DatabaseService } from "../../_services/databaseService";

import { DialogComponent } from '../../dialog/dialog.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html'
})
export class AddCategoryComponent implements OnInit {
  form: any = {};
  sendingData = false;
  category:any = [];
  lead:any = [];
  i:any = 0;
  index:any = '0';
  categoryup:any = [];
  subcategoryup:any = [];
  subcat = false;
  data:any =[];
  constructor( public dialog: MatDialog,public db:DatabaseService, public diaalog:DialogComponent, public router:Router,  ) { }


  ngOnInit() {
    this.db.setData();
    this.getallcat();
    // this.getallsubcat();
    // this.categoryChange(0);

  }
  openDialog() {
    // const dialogRef = this.dialog.open(AddCategoryModuleComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });

    const dialogConfig = new MatDialogConfig();
    dialogConfig. width='550px',
    dialogConfig. data = {
    id: this. form.id,
    };
    this. dialog. open( AddCategoryModuleComponent, dialogConfig);
  }

  openDialog1(i) {
    // const dialogRef = this.dialog.open(AddSubCategoryModuleComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });

          
      const dialogConfig = new MatDialogConfig();
    dialogConfig. width='550px',
      
      dialogConfig. data = {
      id: this.category_array[i].selected_parent,
      };
      this. dialog. open( AddSubCategoryModuleComponent, dialogConfig);
  }

  getallcat(){
    this.db.FetchData({},'Category/get_all_category')
    .subscribe((result)=>{
      console.log(result);
      this.categoryup = result['data'];
      // this.subcategoryup = result;
      this.category_array.push({'selected_parent':'','child':this.categoryup})
      // console.log(this.subcategoryup);
      // console.log(this.category_array);
    })
    
  }

  // getallsubcat(){
  //   this.db.FetchData({},'Category/get_all_subCategory')
  //   .subscribe((result)=>{
  //     console.log(result);
  //     this.subcategoryup = result['data'];
  //     console.log(this.subcategoryup);
  //   })
  // }

  category_array:any = [];
  len= 0;
  
  categoryChange(id,pop){
    this.subcat = true;
    // console.log(this.subcat);
    for (let i = 0; i < this.len; i++) {
      if(pop <= i){
        // console.log(i);
        // console.log(this.category_array);
        
        this.category_array.pop();
        // console.log(this.category_array);

        
      }
    }

    this.db.FetchData({'category_id':id},'Category/get_subcategory_by_categoryId')
    .subscribe((result)=>{
      console.log(result);
      this.subcategoryup = result;


      // console.log(this.category_array);

     if(this.subcategoryup.length) this.category_array.push({'selected_parent':'','child':this.subcategoryup});
    this.len = this.category_array.length;

      // this.category_array.pop({'selected_parent':'','child':this.subcategoryup})
      // console.log(this.subcategoryup);
      console.log(this.category_array);
    })
  }

  // getChild(){
  //   console.log(this.category_array);

  // }

  subsavecat(){
    console.log(this.form);
   this.db.FetchData({'data':this.form},'Category/add_category')
    .subscribe( r =>{
console.log( r );

      if( r.msg == 'Success' ){
        this.diaalog.success('Category Added Successfully!');
      }else{
        this.diaalog.success('Same Category Already Exist!');

      }

      console.log( r );
    });
  }
  


}
