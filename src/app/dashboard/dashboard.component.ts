import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../_services/DatabaseService';
import * as CanvasJS from '../../assets/canvasjs.min';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
    
})
export class DashboardComponent implements OnInit {
    
    constructor(public db:DatabaseService, ) { }
    
    ngOnInit() {
        this.db.setData();
        this.dashboard();
        this.filter.user_download = 'today';
        this.filter.user_upload_date = '';
        this.filter.top_user_download = 'today'
        this.filter.top_doc_download = '';
        this.filter.total_docs = '';
        this.filter.total_doc_downloads = '';
        
        
    }
    
    dashboard_data :any = {}; 
    loader : any = '';
    filter : any = {};
    
    doc_arr : any = [];
    doc_chart(){
        this.doc_arr = [];
        
        
        this.dashboard_data.top_doc_download.forEach(element => {
            this.doc_arr.push( { y : parseInt( element.total_downloads ) , label : element.subject } )
        });
        
        console.log( this.doc_arr );
        
        
        let chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Top 10 Document Downloads",
                fontSize: 18
            },
            data: [{
                type: "column",
                dataPoints: []
            }]
        });
        
        console.log( chart );
        console.log( chart.options.data[0] );
        
        chart.options.data[0].dataPoints = this.doc_arr;
        // chart.data.dataPoints = this.doc_arr;
        
        chart.render();
        
        
    }
    
    dashboard(){
        console.log( this.filter.top_user_download );
        console.log( this.filter.user_upload_date );
        console.log( this.filter.top_doc_download );
        console.log( this.filter.total_docs );
        console.log( this.filter.total_doc_downloads );
        
        
        if(this.filter.top_user_download )
        this.filter.top_user_download = ( String( this.filter.top_user_download ).indexOf('India') > -1  ) ? this.db.pickerFormat( this.filter.top_user_download ) : this.filter.top_user_download ;
        
        if(this.filter.user_upload_date )
        this.filter.user_upload_date = ( String( this.filter.user_upload_date ).indexOf('India') > -1  ) ? this.db.pickerFormat( this.filter.user_upload_date ) : this.filter.user_upload_date ;
        
        if(this.filter.top_doc_download )
        this.filter.top_doc_download = ( String( this.filter.top_doc_download ).indexOf('India') > -1  ) ? this.db.pickerFormat( this.filter.top_doc_download ) : this.filter.top_doc_download ;
        
        if(this.filter.total_docs )
        this.filter.total_docs = ( String( this.filter.total_docs ).indexOf('India') > -1  ) ? this.db.pickerFormat( this.filter.total_docs ) : this.filter.total_docs ;
        
        if(this.filter.total_doc_downloads )
        this.filter.total_doc_downloads = ( String( this.filter.total_doc_downloads ).indexOf('India') > -1  ) ? this.db.pickerFormat( this.filter.total_doc_downloads ) : this.filter.total_doc_downloads ;
        
        
        
        this.db.FetchData({ 'filter':this.filter },'Dashboard/dashboard_data')
        .subscribe( r=>{
            console.log(r);
            this.dashboard_data = r;
            this.loader = '';
            this.doc_chart();
            
            if( this.db.datauser.access_level == '2' ){
                this.getUserDocs( this.db.datauser.id );
                return;
            }
            
            if( this.dashboard_data.top_user_upload.length > 0 ){
                this.getUserDocs(  this.dashboard_data.top_user_upload[0].user_id );
            }
            
            
            
        },error=>{ this.loader = ''; });
        
    }
    
    user_id : any = '';
    user_docs : any = [];
    getUserDocs(id){
        this.user_id = id;
        this.db.FetchData({ 'user_id': id, 'filter':this.filter },'Dashboard/getUserDocs')
        .subscribe( r=>{
            console.log(r);
            this.user_docs = r;
            this.loader = '';
        },error=>{ this.loader = ''; });
        
    }
    
}
