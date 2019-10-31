import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { SubCategoryModalComponent } from '../sub-category-modal/sub-category-modal.component';
import { DatabaseService } from "../../_services/databaseService";
import { DialogComponent } from '../../dialog/dialog.component';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-knowledge-list',
  templateUrl: './knowledge-list.component.html'
})
export class KnowledgeListComponent implements OnInit {
  form: any = {};
  knowcategory:any = [];
  categoryup:any = [];
  subcategoryup:any = [];
  loader:any = '';
  progress:any = '';
  fileUrl;
  start:any = "0";
  pagelimit:any = "20";
  search:any = {};
  rqst_count:any = '';
  total_page:any = '';
  pagenumber:any = '';
  user_count:any = [];
  removesearch:boolean=false;
  documentList:any=[];
  currentPage:any=1;
  newData:any;
pageSize:any=50;  
  // nger:any=[];
  // MobileNumber:any=[];

  constructor(public dialog: MatDialog,public db:DatabaseService, public diolog:DialogComponent,private sanitizer: DomSanitizer) { }

  openDialog() {
    const dialogRef = this.dialog.open(CategoryModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog1() {
    const dialogRef = this.dialog.open(SubCategoryModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  show_actions:any={};
  ngOnInit() {

    this.db.setData();
    this.getallknowlist();
    this.get_suggestion();
    this.access_result();
  }

  access_result(){

    

  }

  closeDialog()
  {
    const dialogRef = this.dialog.closeAll();
  }

  getallknowlist(pagelimit:any=20,start:any=0,action:any=''){
    this.loader = "1";
    this.progress = "1";
    this.pagelimit = pagelimit
    this.start = start;
    // console.log(this.start);
    // console.log(action);
    // console.log("hello roti list");
    // console.log(this.search);
    

    if(action == "refresh"){
      this.search = {};
    }
    this.db.FetchData({'search':this.search,'start':this.start,'pagelimit':this.pagelimit},'Knowledge/get_all_knowledge_base')
      .subscribe( r=>{
      console.log(r);
      this.knowcategory = r['data'];
      this.user_count = r['count'];
      // this.rqst_count = r['count'][0]['totalRecords'];
      // this.total_page = Math.ceil(this.rqst_count/this.pagelimit);
      // this.pagenumber = (this.start/this.pagelimit)+1;
      this.loader = '';
      this.progress = '';
    },error=>{
      // console.log(error);
      this.loader = '';      
    }
    
    )
  }

  all_sug:any=[];
  get_suggestion()
  {
    this.db.FetchData("","knowledge/get_searchData")
    .subscribe(resp=>{
      console.log(resp);
      this.all_sug=resp;
    })
  }

  fltr_state:any=[];
  filter_array(data,array,index_val)
  {
    console.log(data);
    if(data !='')
    {
      this.fltr_state=this.filter(data.toUpperCase(),array);
    }
    else
    {
      this.fltr_state=[];
    }
    
  }



  
new_array:any=[];
filter(search_word,search_array)
{
  this.new_array=[];
  for(var i=0; i<search_array.length; i++)
  {
    if(search_array[i].toUpperCase().search(search_word) !==-1)
    {
      this.new_array.push(search_array[i]);
    }
  }
  return this.new_array;
}


deleteFunction(knowledge_id,i) {
  this.db.FetchData({knowledge_id},'Knowledge/document_delete') .subscribe((result)=>{
    console.log(result);
    this.newData=result;
    this.knowcategory.splice(i,1);
   }); 
  }









  // getallcat(){
  //   this.db.FetchData({},'Category/get_all_category')
  //   .subscribe((result)=>{
  //     console.log(result);
  //     this.categoryup = result['data'];
  //     console.log(this.categoryup);
  //   })
    
  // }
  // getallsubcat(){

  //   this.db.FetchData({'category_id':this.form.category_id},'Category/get_subcategory_by_categoryId')
  //   .subscribe((result)=>{
  //     console.log(result);
  //     this.subcategoryup = result['data'];
  //     console.log(this.subcategoryup);
  //   })

  // }

  myData(knowledge_id)
  {
    this.db.FetchData({knowledge_id},'Knowledge/get_downloads/'+knowledge_id)
    .subscribe((result)=>{console.log(result);
      this.getallknowlist();
    });
  }

  search_list(){
    // console.log('hello');
    console.log(this.search.master);
    let value = {'master':this.search.master};
    let value1 = {'search':value};
    
    console.log(value);
    
     this.db.FetchData(value1,'Knowledge/get_all_knowledge_base').subscribe((response)=>{
       console.log(response);
       this.search_list=response['search_arr'];
       console.log(this.search_list);
     });
  }

  searchFilter(){
    console.log(this.search.master);
    this.documentList({ "currentPage": this.currentPage,
      "pageSize": this.pageSize,"segmentCode":this.search.master});
      this.removesearch=true;
  }
  removesearchfilter(){
    this.search.master='';
    this.documentList({ "currentPage": this.currentPage,
    "pageSize": this.pageSize,"segmentCode":this.search.master,});
    this.removesearch=false;
 
   }



   knowladge_delete( knowledge_id ) {

    this.db.FetchData({ 'id' : knowledge_id },'Knowledge/knowladge_delete') .subscribe( r =>{

      this.getallknowlist();

    }); 

  }
  

  
}
