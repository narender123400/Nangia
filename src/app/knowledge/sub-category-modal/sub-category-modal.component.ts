import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../_services/databaseService";

import { DialogComponent } from '../../dialog/dialog.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-category-modal',
  templateUrl: './sub-category-modal.component.html'
})
export class SubCategoryModalComponent implements OnInit {
  form: any = {};
  //sendingData = false;
  category_select:any =[];
  sub_category:any =[];
  lead:any = [];
  i:any = 0;
  index:any = '0';
  constructor(public db:DatabaseService,public dialog:DialogComponent, public router:Router) { }


  getallcat(){
    this.db.FetchData({},'Category/get_all_category')
    .subscribe((result)=>{
      console.log(result);
     // console.log(typeof(result['data']));
      this.category_select = result['data'];
      console.log(this.category_select);
      console.log(typeof(this.category_select));
   });
  }

  getallsubcat(){
    this.db.FetchData({},'Category/get_all_subCategory')
    .subscribe((result)=>{
      console.log(result);
      this.sub_category = result['data'];
      console.log(this.sub_category);

    })
  }

  subsavecat(){
    console.log(this.form);
    this.db.FetchData({'data':this.form},'Category/add_sub_category')
    .subscribe((result)=>{
      console.log(result);
      if(result['message'] == "Sub-Category Added Successfully"){
        this.dialog.success('Subcategory Added !!!!');
        this.router.navigate(['/knowledge-list']);
        this.getallcat();
        this.getallsubcat();
        
      }
    },error=>{
      console.log(error);
      this.dialog.error('Something went wrong !!! Try Again...')        

    })
  }

  ngOnInit() {
    this.db.setData();
    this.getallcat();
    this.getallsubcat();
  }

  delete_user(index,id:any){
    console.log(index);
    console.log(id);
    this.dialog.delete('Lead Data').then((result)=>{
      console.log(result);
      if(result){
        this.db.FetchData({'sub_category_id':id},'Category/delete_sub_category')
        .subscribe(res => {
          console.log(res);
          this.lead.splice(index,1);
          this.dialog.success('Deleted Lead has been deleted');
          this.getallsubcat();
          this.getallcat();
        },err=>{
          console.log(err);
          this.dialog.error('Somthing Went wrong! Try Again....');
          
        }
        )
      }
    })
  
  }

}
