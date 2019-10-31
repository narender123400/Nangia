import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import {SessionStorage} from '../_services/SessionService';
import { DatabaseService } from '../_services/DatabaseService';
import { DialogComponent } from './../dialog/dialog.component';

@Injectable()
export class AuthGuardLog implements CanActivate {
   constructor(private router: Router, public db: DatabaseService , public dialog: DialogComponent) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
            // this.db.getSe().subscribe(
            //   data => {
            //         console.log(data);
                    
            //    },
            //    error => {
            //       console.log('error');
            // });


            if (  this.db.getSe() ) {
                  console.log(  this.db.getSe()  );
                  
                   this.db.navigation();
                  console.log( this.db.token);

                  return false;
                  
            } else {
                  this.db.datauser = {};
                  this.db.token = '';
                  localStorage.removeItem('access_result');
                  localStorage.removeItem('access_token');
                  console.log( this.db.token );
                  

                  console.log( 'not');

                  return true;

            }


      }
}

