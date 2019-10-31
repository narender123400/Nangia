import { Component,  OnInit } from '@angular/core';
import { DatabaseService } from "../../_services/databaseService";
import { DialogComponent } from '../../dialog/dialog.component';

import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html'
})
export class EdituserComponent implements OnInit {

  
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
    this.route.params.subscribe(params=>{

      this.userid = params.id;
          if( this.userid ){
            this.getallrole();
            this.get_approver_user();
            this.edit_user();
          }

    });
  
    
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



  saveUser(myform:any){
    console.log(myform);
    console.log(this.form);

    this.form.add_document = this.form.add_document || 0;
    this.form.edit_document = this.form.edit_document || 0;
    this.form.delete_document = this.form.delete_document || 0;
    this.form.download_document = this.form.download_document || 0;
    this.form.view_document = this.form.view_document || 0;
    
  }
  

  edit_user(){
    this.db.FetchData({'userid':this.userid},'User/get_user')
    .subscribe(result=>{
      // console.log(result);
     this.form = result['data'];
     console.log(this.form);
     this.form.add_document=parseInt(this.form.add_document);
     this.form.delete_document=parseInt(this.form.delete_document);
     this.form.view_document=parseInt(this.form.view_document);
     this.form.download_document=parseInt(this.form.download_document);
     this.form.edit_document=parseInt(this.form.edit_document);
     this.form.news_uploader =parseInt(this.form.news_uploader );
     console.log(this.form.delete_document);
     
    })
 
 
  }

  /* updateuser(){
     console.log(this.form);
     this.form.userid = this.form;
     this.db.FetchData({'data':this.form},'User/update_user')
     .subscribe(result=>{
       console.log(result);
     })
   }
*/


approvers:any = [];
get_approver_user(){
  this.db.FetchData( '','User/get_approver_user')
  .subscribe( r =>{
    console.log(r);

    this.approvers = r;

  })
  
}

   updateuser(){
    console.log(this.form);

    this.form.approver  = this.form.approver  ? this.form.approver : '';
    this.form.landline  = this.form.landline  ? this.form.landline : '';
    this.form.email  = this.form.email  ? this.form.email : '';
    if( this.form.access_level != '2')this.form.approver = '';


    this.form.userid = this.userid;
    this.db.FetchData({'data':this.form},'User/update_user')
    .subscribe((result)=>{
      console.log(result);

      if(result['message'] == "Profile Updated Successfully"){
        this.dialog.success('User Updated');
        this.router.navigate(['/user-list']);

      }

    },error=>{
      console.log(error);
      this.dialog.error('Something went wrong !!! Try Again...')
    }
    );
  }







}
