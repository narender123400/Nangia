import {Component, Inject, OnInit} from '@angular/core';



import { DatabaseService } from "../../_services/databaseService";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-knowledge-request-modal',
  templateUrl: './knowledge-request-modal.component.html'
})


export class KnowledgeRequestModalComponent implements OnInit {
user_id :any = '';
id:any = '';
  constructor(public db:DatabaseService   , @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<KnowledgeRequestModalComponent> ) {
    this.id = data.id; 
    this.user_id = data.user_id;
    console.log(data.user_id);
    
   }

  ngOnInit() {
    this.db.setData();
  }

download_data: any = {};
  
save() {

  this.db.FetchData( { 'request_download' : this.download_data.request_download,'id': this.id , 'user_id' : this.user_id } ,"knowledge/rquestDownloadApprove")
  .subscribe( d =>{
    this.dialogRef.close(true);
  })

}


}
