import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../_services/databaseService";


import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';
import{FormGroup,FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-news-add',
  templateUrl: './news-add.component.html'
})
export class NewsAddComponent implements OnInit {

  
  form: any = {};
  x: any = {};
  profileForm : FormGroup;
  categoryup:any = [];
  subcategoryup:any = [];
  category_array:any =[];
  subcat = false;
  fileForm:any =[];
  // fileupload:{};
  // file_name:any =[];
  feature:any=[];
  feature_list:any=[];
  tmp_feature_list:any=[];
  sendingData = false;
  
  
  
  
  // selectedFile=[];
  formData=new FormData();
  constructor(private fb :FormBuilder ,public db:DatabaseService, public dialog:DialogComponent, public router:Router) { }
  
  ngOnInit() {
    this.db.setData();
    // this.getallcat();
    // this.get_tags();
    
    this.fileForm = this.fb.group({
      file_name:['']
    });
  }
  
  getallcat(){
    this.db.FetchData({},'Category/get_all_category')
    .subscribe((result)=>{
      console.log(result);
      this.categoryup = result['data']; 
      // this.subcategoryup = result;
      this.category_array.push({'selected_parent':'','child':this.categoryup})
      // console.log(this.subcategoryup);
      console.log(this.category_array);
    })
    
  }
  
  len= 0;
  
  categoryChange(id,pop){
    this.subcat = true;
    // console.log(this.subcat);
    for (let i = 0; i < this.len; i++) {
      if(pop <= i){
        // console.log(i);
        // console.log(this.category_array);
        
        this.category_array.pop();
        // console.log(this.category_array);
        
        
      }
    }
    
    
    this.db.FetchData({'category_id':id},'Category/get_subcategory_by_categoryId')
    .subscribe((result)=>{
      console.log(result);
      this.subcategoryup = result;
      
      
      // console.log(this.category_array);
      
      if(this.subcategoryup.length) this.category_array.push({'selected_parent':'','child':this.subcategoryup});
      this.len = this.category_array.length;
      
      console.log(this.category_array);
    })
  }
  
  
  // }
  selectedFile: File[]=[];
  i:any = 0;
  onSelectedFile(event){
    console.log(event.target.files);
    for(var i = 0; i< event.target.files.length; i++ ){
      this.selectedFile.push(event.target.files[i]);
      let reader =new FileReader();
      reader.onload = (e:any)=>{
        this.urls.push(e.target.result);
      }
      reader.readAsDataURL(event.target.files[i]);
      // const file_name = event.target.files[0];
      // this.fileForm.get('file_name').setValue(file_name);
      // console.log(this.fileForm);
      
    }
    console.log(this.selectedFile);
    
  }
  
  urls = new Array<string>();
  remove_image(i:any){
    console.log(i);
    this.urls.splice(i,1);
    this.selectedFile.splice(i,1);
  }
  
  
  // i:any=0;
  
  saveupload(){
    
    // if( this.selectedFile.length < 1 ){
    //   this.dialog.warning('Please Choose at least 1 Document!');
    //   return;
    // }

    
    // this.form.search_key = this.feature_list;
    
    console.log(this.form);
    
    this.db.FetchData(this.form,"Knowledge/add_news").subscribe((res)=>{
      console.log(res);
      
      let id=res['id'];
      this.formData.append("id",id); 
      if(this.selectedFile.length > 0) {
        for(var i=0; i<this.selectedFile.length; i++)
        {
          this.formData.append("file_name"+i,this.selectedFile[i],this.selectedFile[i].name);
          
        }
      }else{
       this.dialog.success('News Added Successfully');
       this.router.navigate(['/news-lisit']); 

      
        
      }
      this.db.FileData(this.formData,"Upload/upload_news_files").subscribe((res)=>{
        
        if(res['message'] == "File Upload Successfully"){
          this.dialog.success('News Added Successfully');
          this.sendingData = true;
          
          this.formData=null;
          this.formData = new FormData();
          this.urls = null;
          this.urls = new Array<string>();
          this.selectedFile=[];
          
          if(this.db.datauser.access_level == '2' ) {  this.router.navigate(['/my-upload']); return; }
          this.router.navigate(['/news-lisit']); 
        }
      },error=>{
        console.log(error);
        this.dialog.error('Something went wrong !!! Try Again...')
        
      });
      
    });
  }
  
  
  // test = []; 
  //   storeAttrData(attr_options)
  //   {
  //     if(attr_options)
  //     {
  //       var d = attr_options.split(','); 
  //       for (let i = 0; i < d.length; i++) {
  //       this.test.push(d[i]);
  //       } 
  //       console.log(this.test);
  //       this.feature_list.push({ attr_options: attr_options.split(',')});
  //       this.feature.type = this.feature.value = null;
  //       console.log(this.feature_list);
  
  //       this.tmp_feature_list.push({value:attr_options});
  //     }
  //   }
  
  push_tag()
  {
    console.log( this.feature.value );
    
    this.form.search_key =  this.form.search_key || [];
    
    if(this.feature.value)
    {
      var d = this.feature.value.split(','); 
      this.form.search_key = this.form.search_key.concat(d);
      
    }
    
    this.form.search_key = this.form.search_key.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });
    
    
    this.feature.value = [];
    
  }
  
  removeDuplicateUsingFilter(arr){
    
  }
  
  
  
  
  remove_tag(i)
  {
    
    this.form.search_key.splice(i, 1);
    console.log(this.form.search_key);
    
  }
  
  
  
  
  getKeys(){
    this.subcat = true;
    
  }
  
  
  
  
  keyword = 'name';
  data:any = [];
  
  
  
  
  selectEvent(item) {
    // do something with selected item
    this.feature.value = item.name;
    this.push_tag();
  }
  
  onChangeSearch(val: string = '') {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.feature.value = val;
    // this.db.FetchData({"val":val },"knowledge/getKeysKnldge")
    // .subscribe( d =>{
    //   console.log(d);
    //   this.data = d;
    
    // })
    
  }
  
  onFocused(e){
    // do something when input is focused
  }
  
  
  get_tags(){
    
    this.db.FetchData( {"val":'' },"knowledge/getKeysKnldge")
    .subscribe( d =>{
      console.log(d);
      this.data = d;
      
    })
  }
  
  
}    
