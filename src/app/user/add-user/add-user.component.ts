import { Component,  OnInit } from '@angular/core';
import { DialogComponent } from '../../dialog/dialog.component';

import { DatabaseService } from "../../_services/databaseService";

import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html'
})
export class AddUserComponent implements OnInit {


  form: any = {};
  sendingData = false;
  formData: any = {};
  user:any = [];
  i:any = 0;
  index:any = '0';
  navigate_type:any = '';
  userid:any = '';
  role:any ='' ;
  hide = true;

  constructor(public db:DatabaseService, public dialog:DialogComponent, public router:Router,public route:ActivatedRoute,) { 
  }

  
  ngOnInit() {

    this.db.setData();

    this.getallrole();
    this.get_approver_user();

    this.form.default_download_limit = 15;
    
  }

  getallrole(){
    this.db.FetchData({},'User/get_role')
    .subscribe((result)=>{
      console.log(result);
      this.role=result;
      // this.role = result['data'];
      console.log(this.role);
    })
    
  }


  approvers:any = [];
  get_approver_user(){
    this.db.FetchData( '','User/get_approver_user')
    .subscribe( r =>{
      console.log(r);

      this.approvers = r;

    })
    
  }

  submitted:any = false;
  submituser(f){
    this.submitted = true; 
    console.log(this.form);
       
    this.form.edit_document = this.form.edit_document || 0;
    this.form.delete_document = this.form.delete_document || 0;
    this.form.download_document = this.form.download_document || 0;
    this.form.view_document = this.form.view_document || 0;
    this.form.approver  = this.form.approver  ? this.form.approver : '';
    this.form.landline  = this.form.landline  ? this.form.landline : '';
    this.form.email  = this.form.email  ? this.form.email : '';

    if( this.form.access_level != '2')this.form.approver = '';

    this.db.FetchData({'data':this.form},'User/add_user')
    .subscribe((result)=>{
      console.log(result);

    this.submitted = false; 

      if(result['message'] == "User Added Successfully"){
        this.dialog.success('User Added !!!');
        this.router.navigate(['/user-list']);
      }else{
        this.dialog.error( result['message'] );

      }
      },error=>{
        this.submitted = false; 
        console.log(error);
        this.dialog.error('Something went wrong !!! Try Again...')
      
      
      
    });

   
  }
  




}
