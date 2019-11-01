import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "./../_services/databaseService";
import { DialogComponent } from './../dialog/dialog.component';

import {MatDialog} from '@angular/material';




@Component({
  selector: 'app-mydocument',
  templateUrl: './mydocument.component.html'
})
export class MydocumentComponent implements OnInit {
  loader:any = '';
  progress:any = '';
  pagelimit:any = '';
  start:any = '';
  search:any = {};
  pagenumber:any = '';
  pageSize:any=50;
  knowcategory:any = [];
  form: any = {};
  user_count:any = [];
  rqst_count:any = '';
  total_page:any = '';
  documentList:any=[];
  removesearch:boolean=false;
  currentPage:any=1;
  newData:any;




  // ,private sanitizer: DomSanitizer

  constructor(public dialog: MatDialog,public db:DatabaseService, public diolog:DialogComponent) { }

  // constructor() { }
  show_actions:any={};
  ngOnInit() {

    this.db.setData();
    this.getuserknowlist();

    
this.get_suggestion();

  }

  getuserknowlist(pagelimit:any=10,start:any=0,action:any=''){
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
    this.db.FetchData({'search':this.search,'start':this.start,'pagelimit':this.pagelimit},'Knowledge/get_user_document')
      .subscribe((result)=>{
      // console.log("hello list");
      
      console.log(result);
      this.knowcategory = result['data'];
      const data = this.knowcategory;

      // const blob = new Blob([data], { type: 'application/octet-stream' });
      // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      console.log(this.knowcategory);
      this.user_count = result['user_count'];
      this.rqst_count = result['count'][0]['totalRecords'];
      // console.log(this.rqst_count);
      this.total_page = Math.ceil(this.rqst_count/this.pagelimit);
      this.pagenumber = (this.start/this.pagelimit)+1;
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
  // fltr_state:any=[];
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


myData(knowledge_id)
{
  this.db.FetchData({knowledge_id},'Knowledge/get_downloads/'+knowledge_id)
  .subscribe((result)=>{console.log(result);
    this.getuserknowlist();
  });
}
search_list(){
  // console.log('hello');
  console.log(this.search.master);
  let value = {'master':this.search.master};
  let value1 = {'search':value};
  
  console.log(value);
  
   this.db.FetchData(value1,'Knowledge/get_user_document').subscribe((response)=>{
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

 deleteFunction(knowledge_id,i) {
  this.db.FetchData({knowledge_id},'Knowledge/document_delete') .subscribe((result)=>{
    console.log(result);
    this.newData=result;
    this.knowcategory.splice(i,1);
   }); 
  }
}
