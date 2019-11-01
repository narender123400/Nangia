import { OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from "./_services/databaseService";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'nangia';

  constructor( public db:DatabaseService, private router: Router)
  {
    console.log(this.db.datauser);    
    console.log(this.db.token);    
    // this.db.getSe();

  }

  ngOnInit(){
    this.db.getSe();
  }

  islogged(){
  
    return this.db.getToken() ? true : false;
  }


}