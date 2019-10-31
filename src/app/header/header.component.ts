import { Component, OnInit, Renderer2 } from '@angular/core';
import { DatabaseService } from '../_services/DatabaseService';

import { Router } from '@angular/router';
import { DialogComponent } from './../dialog/dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  show_tabs:any;
  constructor(private renderer: Renderer2,public db:DatabaseService, public router: Router , public dialog:DialogComponent, ) {
    
   }
   ngOnInit(){
    this.db.setData();

   }

  status:boolean = false;
  toggleHeader() {
      this.status = !this.status;
      if(this.status) {
          this.renderer.addClass(document.body, 'active');
      }
      else {
          this.renderer.removeClass(document.body, 'active');
      }
  }
  show_actions:any={};

 
logout(){
  this.db.logoutSession();
  this.router.navigate(['']);

}

limitExceed(){

  this.db.FetchData( '','Knowledge/limitExceed')
  .subscribe((result)=>{
    this.dialog.success('Request send for 25 Downloads Limit!');

    
    this.db.datauser.toady_download_request = '1';
    
     this.db.setStorage();

  });
  
}


}
