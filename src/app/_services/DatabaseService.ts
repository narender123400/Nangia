import { Injectable ,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { DialogComponent } from './../dialog/dialog.component';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Crypto } from '../_Pipes/Crypto.pipe';
import { DatePikerFormat } from '../_Pipes/DatePikerFormat.pipe';
import { PushNotificationsService} from 'ng-push';
import { map } from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import { ReloginComponent } from '../relogin/relogin.component'; //import the module
import {MatDialog, MatDialogRef} from '@angular/material';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    
    // MyUrl:string = "http://nextstep.net.in/nangia/";
    // DbUrl:string = "http://nextstep.net.in/nangia/index.php/";
    
    myurl:string = "http://knowledge.nangia.com/nangia_api/";
    DbUrl:string = "http://knowledge.nangia.com/nangia_api/index.php/";
    
    public datauser: any = {};
   public token: any = '';
    loading: any;
    
    constructor(
        public location: Location, 
        public http: HttpClient,
        public dialog: DialogComponent,
        private router: Router,
        public route: ActivatedRoute,
        public _pushNotificationService: PushNotificationsService,
        public dialogs:MatDialog
        ) {
            this._pushNotificationService.requestPermission();
            console.log('in');
            
            
        }
        

        getSe() {
            this.datauser = JSON.parse( localStorage.getItem('access_result') ) || [];
            this.token = localStorage.getItem('access_token')  || '';
            return  this.token ;
        }

        getToken(){
            return this.token;
        }

        setData() {
            this.datauser = JSON.parse( localStorage.getItem('access_result') ) || [];
            this.token = localStorage.getItem('access_token')  || '';
        }
        
        setStorage(){
            localStorage.setItem('access_result', JSON.stringify( this.datauser ));
        }
        

        logoutSession() {

            this.datauser = {};
            this.token = '';
            localStorage.removeItem('access_result');
            localStorage.removeItem('access_token');
            this.dialog.warning('Your Session Out!');
            
        //   var  home_page= this.route.snapshot.queryParams['returnUrl'] || '';
        //   this.router.navigate([''], { queryParams: { returnUrl: state.url }});


        }
        
        
            
        navigation(){
            
            // this.nextUrl = this.route.snapshot.queryParams['returnUrl'] || home_page;/

                var home_page = '';

                if(   this.datauser.access_level == '1'  ){
                home_page = '/dashboard';
    
                }else if(  this.datauser.access_level == '2'  ){
                home_page = '/dashboard';
    
                }else if(  this.datauser.access_level == '3'  ){
                home_page = '/dashboard';
              

                }else if(this.datauser.access_level ){
          
                this.dialog.error('Your permission not set!');
                this.logoutSession();
                this.router.navigate(['']);

                return false;
    
                }

                home_page = this.route.snapshot.queryParams['returnUrl'] || home_page;

                this.router.navigate([ home_page ]);

                return false;
        }

        



        header:any = new HttpHeaders();
        
        auth_rqust(request_data: any, fn: any) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this.http.post(this.myurl + fn , request_data, {headers: headers});
        }

        
        FetchData(request_data:any, fn:any):any
        {
            if( !this.chek_seission() )
            return false;
            // this.noificaton();
            
            let header = new HttpHeaders();
            
            header = header.append('Authorization','Bearer ' + this.token);
            header = header.append("Content-Type", "application/x-www-form-urlencoded");
            
            
            console.log(this.token);
            return this.http.post(this.DbUrl+fn, JSON.stringify(request_data), {headers:header});
        }
        
        
        
        get_rqst(fn: any):any
        {
            
            
            if( !this.chek_seission() )
            return false;
            // this.noificaton();
            
            let header = new HttpHeaders();
            header = header.append('Authorization','Bearer ' + this.token);
            header = header.append("Content-Type", "application/json");
            console.log(this.token);
            
            return this.http.get(this.DbUrl + fn, {headers: header}). 
            pipe(

                    // map((r:any) => { 
                    //     console.log((r) );
                    //  }),

                retry(3),
         
                );
                
            }
            
            FileData(request_data:any, fn:any)
            {
                let header = new HttpHeaders();
                header = header.append('Authorization','Bearer ' + this.token);
                header = header.append("Content-Type", "multipart/encrypted");
                
                return this.http.post( this.DbUrl+fn, request_data, {headers : this.header});
            }
            
            
            chek_seission(){
                this.token =  localStorage.getItem('access_token')  || '';
                if( this.token){
                    return true;
                }else{
                    this.dialog.error('Your session Expired! pls login and continue!') ;
                    
                      
                        const dialogRef = this.dialogs.open(ReloginComponent, {
                            width: '520px'
                            });
                            dialogRef.afterClosed().subscribe(result => {
                                if (result) { this.dialog.success('Your login Successfully! Please try agian.'); return; }
                                this.router.navigate([''] , { queryParams: { returnUrl: this.router.url }});

                            });
                              
                        

                    return false;
                }
                
            }
            
            
            crypto(val, mode:any = true){
                if(val) return new Crypto().transform( val, mode);
                else return '';
            }
            
            pickerFormat(val, format:any = 'Y-M-D'){
                if(val) return new DatePikerFormat().transform( val, format);
            }
            
            goBack() {
                window.history.back();
            }
            
            
            noificaton_rqst():any {
                let headers = new HttpHeaders().set('Content-Type', 'application/json');
                headers = headers.set('Token', 'Bearer ' + this.token);
                return this.http.post(this.myurl + 'stockdata/getNotification', JSON.stringify({'login_id': this.datauser.id}), {headers: headers}).
                pipe(
                    retry(3), 
                    );
                }
                
                notifications:any = [];
                all_notifications:any = [];
                noificaton(){
                    this.noificaton_rqst().subscribe(d => { 
                        console.log(d);
                        this.all_notifications =  d.notifications;
                        if( d.notify.length > 0 && !this.offNotifiy){
                            this.offFlag = false;
                            this.notifications = d.notify;
                            this.sendNotify(0);
                        }
                    }); 
                }
                
                offFlag:any = false;
                offNotifiy:any = false;
                sendNotify( index ) {
                    if(this.offFlag)return;
                    var e = this.notifications[ index ];
                    console.log(index);
                    
                    console.log(e);
                    if(!e)return;
                    
                    const title = e.title;
                    let options = {
                        body : e.message,
                        icon : 'favicon.ico'
                    }
                    
                    this._pushNotificationService.create(title, options).subscribe((notif) => {
                        if (notif.event.type === 'show') {
                            console.log('onshow');
                            setTimeout(() => {
                                notif.notification.close();
                                this.sendNotify(++index);
                                console.log(index);
                                
                            }, 3000);
                        }
                        if (notif.event.type === 'click') {
                            console.log('click');
                            this.offFlag = true;
                            notif.notification.close();
                            
                        }
                        if (notif.event.type === 'close') {
                            console.log('close');
                        }
                        
                    },
                    (err) => {
                        console.log(err);
                    });
                }


                
            }
            
            
            
            
            