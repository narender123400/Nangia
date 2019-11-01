import { Injectable } from '@angular/core';
import { Router, RouterModule, Routes, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import {SessionStorage} from '../_services/SessionService';
import { DatabaseService } from '../_services/DatabaseService';
import { JwtHelperService } from '@auth0/angular-jwt';

import { DialogComponent } from './../dialog/dialog.component';


@Injectable()
export class AuthGuard implements CanActivate {
    users: any = [];
    token: any = '';

    constructor(public router: Router, public db: DatabaseService ,  public dialog: DialogComponent ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      // console.log( this.router.routerState );
      const current_component = route.routeConfig.component.name;

      console.log(current_component );
      
        const expectedRole = route.data.expectedRole || [];

        this.db.datauser = JSON.parse( localStorage.getItem('access_result') ) || [];
        console.log( this.db.datauser );

        // this.db.getSe().subscribe(
        //     d => {
        //       console.log(d);
              
        //         this.users = d;
        //         // this.token = d.token;
        //     },
        //     error => {
        //         console.log('err');
        //     });

          
            if ( this.db.getSe() && this.db.token && ( !expectedRole.length  || expectedRole.indexOf( parseInt( this.db.datauser.access_level) ) > -1 ) )  {
              const helper = new JwtHelperService();
              console.log( this.db.token );
              // console.log( helper.isTokenExpired( this.db.token ) );
              
              // if( !helper.isTokenExpired( this.db.token )  ) {
                console.log( this.db.token );
                
                // this.db.datauser = this.users;
                // this.db.can_active = '1';
                return true;
              // }
            }else if ( this.db.getSe() && this.db.token )  {
              console.log('No Static permission' );
              console.log( current_component == 'NewsAddComponent' && this.db.datauser.news_uploader == 1  );
              
              if( current_component == 'NewsAddComponent' && this.db.datauser.news_uploader == 1 )
              return true;
              if( current_component == 'KnowledgeDocComponent' && this.db.datauser.add_document == 1 )
              return true;
                  
                this.dialog.error('You have No permission to access page! Redirct you Home Page');
                return  this.db.navigation();
            
          
          }


            this.db.token = '';

              this.db.logoutSession();
              this.router.navigate([''], { queryParams: { returnUrl: state.url }});




            
        }
    }
