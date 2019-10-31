import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../_services/databaseService";

import { DialogComponent } from '../../dialog/dialog.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html'
})
export class CategoryModalComponent implements OnInit {
  form: any = {};
  sendingData = false;
  category:any = [];
  lead:any = [];
  i:any = 0;
  index:any = '0';

  constructor(public db:DatabaseService, public dialog:DialogComponent, public router:Router,) { }


  ngOnInit() {
    this.db.setData();
    this.getallcat();    
  }

  savecat(){
    

    

    console.log(this.form);

    this.db.FetchData({'data':this.form},'Category/add_category')
    .subscribe((result)=>{
      console.log(result);
      if(result['message'] == "Category Added Successfully"){
        this.dialog.success('category Added !!!!');
        // this.router.navigate(['/knowledge-list']);/
        this.getallcat();
        this.sendingData = true;
        
      }
    },error=>{
      console.log(error);
        this.dialog.error('Something went wrong !!! Try Again...')
    });
    this.sendingData = false;
  }

  getallcat(){
    this.db.FetchData({},'Category/get_all_category')
    .subscribe((result)=>{
      console.log(result);
      this.category = result['data'];
      console.log(this.category);
    })
  }



  delete_user(index,id:any){
    console.log(index);
    console.log(id);
    this.dialog.delete('Lead Data').then((result)=>{
      console.log(result);
      if(result){
        this.db.FetchData({'category_id':id},'Category/delete_category')
        .subscribe(res => {
          console.log(res);
          this.lead.splice(index,1);
          this.dialog.success('Category has been deleted');
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
