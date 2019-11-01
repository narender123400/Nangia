import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "./../_services/databaseService";
import { DialogComponent } from './../dialog/dialog.component';

import { ActivatedRoute,Router } from "@angular/router";
@Component({
  selector: 'app-mydocdetail',
  templateUrl: './mydocdetail.component.html'
})
export class MydocdetailComponent implements OnInit {
  formm: any = {};
  knowledge_id:any = '';
  constructor(public db:DatabaseService, public dialog:DialogComponent, public router:Router,public routee:ActivatedRoute) { 
    this.get_knowledge();    
    this.routee.params.subscribe(params=>{
      console.log(params);
      this.knowledge_id  = params.id;
      console.log(this.knowledge_id);
    });
  }
  ngOnInit() {
    this.db.setData();
    this.get_knowledge();

  }
  allData:any=[];
   name:any=[];
   searchTag:any=[];
   get_knowledge(){
     this.db.FetchData({'knowledge_id':this.knowledge_id},'Knowledge/get_knowledge_details')
     .subscribe((result:any)=>{
     console.log(result);    
     this.formm=result['knowdetails'];// for details
     this.name=result['userdowndetails'];//for another detail
     this.searchTag=result['tagdetails'];
     this.allData.push(this.formm,this.name,this.searchTag);
     console.log(this.allData);
     
     })
   }

}
