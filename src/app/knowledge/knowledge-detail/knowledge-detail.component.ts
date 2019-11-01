import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../_services/databaseService";

import { DialogComponent } from '../../dialog/dialog.component';
import { ActivatedRoute,Router } from "@angular/router";
import {MatDialog, MatDialogRef} from '@angular/material';
import { KnowledgeRequestModalComponent } from '../knowledge-request-modal/knowledge-request-modal.component';

@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html'
})
export class KnowledgeDetailComponent implements OnInit {
  formm: any = {};
  knowledge_id:any = '';
  user_id:any = '';
  constructor(public db:DatabaseService, public dialog:DialogComponent, public dialogs:MatDialog, public router:Router,public routee:ActivatedRoute) {
   }
   


   ngOnInit() {
    this.db.setData();

      console.log( this.db.token );
      console.log( this.db.datauser );

    this.routee.params.subscribe(params=>{
      this.knowledge_id  = params.id;
      this.user_id  = params.user_id || 0;
  
            if( this.db.datauser.access_level == '2' ){
  
              this.user_id = this.db.datauser.id;
  
            }
  
           
            if( this.knowledge_id ){
  
              this.get_knowledge();
            }
  
  
      });
  

  }

  allData:any=[];
   name:any=[];
   searchTag:any=[];
   docs:any=[];
   get_knowledge(){
     this.db.FetchData({'knowledge_id':this.knowledge_id,'user_id':this.user_id},'Knowledge/get_knowledge_details')
     .subscribe((result:any)=>{
     console.log(result);    
     this.formm=result['knowdetails'];// for details
     this.name=result['userdowndetails'];//for another detail
     this.searchTag=result['tagdetails'];
     this.docs = result['ng_knowledge_base_image'];
     this.allData.push(this.formm,this.name,this.searchTag);
     console.log(this.docs);
     
     })
   }




   download(knowledge_id,kid, n)
   {
     this.db.FetchData({knowledge_id,kid},'Knowledge/get_downloads_detail')
     .subscribe((result)=>{console.log(result);
      this.db.datauser.free_download--;
      this.db.datauser.toady_download++;
      this.db.datauser.total_download++;
      
       this.db.setStorage();
       this.db.setData();
console.log( this.db.datauser );

     window.location.href='http://knowledge.nangia.com/nangia_api/uploads/' + n;


      this.get_knowledge();
     });
   }

   


   rquestDownload(id)
   {
     this.db.FetchData({ 'id' : id  },'Knowledge/rquestDownload')
     .subscribe((result)=>{console.log(result);
    this.get_knowledge();
     });
   }

   

   rquestDownloadApprove( id ): void {
    const dialogRef = this.dialogs.open(KnowledgeRequestModalComponent, {
      width: '520px',  data: {
        id: id , user_id: this.user_id
      }
    });
  }



}
