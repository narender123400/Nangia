import { Component, OnInit } from '@angular/core';

import { DialogComponent } from '../../dialog/dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import{FormGroup,FormBuilder} from '@angular/forms';
import { DatabaseService } from "../../_services/databaseService";


@Component({
  selector: 'app-knowledge-edit',
  templateUrl: './knowledge-edit.component.html'
})
export class KnowledgeEditComponent implements OnInit {

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
  constructor(private fb :FormBuilder ,public db:DatabaseService, public dialog:DialogComponent, public router:Router ,public routee:ActivatedRoute) { }

  knowledge_id:any = '';
  ngOnInit() {
    this.db.setData();
    this.routee.params.subscribe(params=>{
      console.log(params);
      this.knowledge_id  = params.id;
    
    if(this.knowledge_id )this.get_knowledge();
      console.log(this.knowledge_id);
    });


    // this.getallcat();
    this.onChangeSearch();
    this.fileForm = this.fb.group({
      file_name:['']
    });
  }

  allData:any=[];
  name:any=[];
  searchTag:any=[];
  docs:any=[];
  get_knowledge(){
    this.db.FetchData({'knowledge_id':this.knowledge_id},'Knowledge/get_knowledge_details')
    .subscribe((result:any)=>{
    console.log(result);    
    this.form=result['knowdetails'];// for details
    this.name=result['userdowndetails'];//for another detail
    this.form.search_key = result['tagdetails'];
    this.docs = result['ng_knowledge_base_image'];
    this.allData.push(this.form,this.name,this.searchTag);
    console.log(this.docs);
    this.getallcatEdit( this.form.category_id );
    
    })
  }

  getallcatEdit( id ){

    this.db.FetchData( {} ,'Category/get_all_category')
    .subscribe((result)=>{
      console.log(result);
      this.categoryup = result['data'];
      // this.subcategoryup = result;

       this.category_array.push({'selected_parent': this.form.category_id ,'child':this.categoryup});


       this.db.FetchData( {'category_id': this.form.category_id } ,'Category/get_subcategory_by_categoryId')
       .subscribe((result)=>{
         console.log(result);
         this.categoryup = result['data'];
         // this.subcategoryup = result;
   
          this.category_array.push({'selected_parent': this.form.category_id2 ,'child':this.categoryup});
   

          this.db.FetchData( {'category_id': this.form.category_id2 } ,'Category/get_subcategory_by_categoryId')
          .subscribe((result)=>{
            console.log(result);
            this.categoryup = result['data'];
            // this.subcategoryup = result;
      
             this.category_array.push({'selected_parent': this.form.category_id3 ,'child':this.categoryup});
      
          });

       });

    })
    
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

console.log(this.category_array);
this.form.category_id   = 0 ;
this.form.category_id_2 = 0 ;
this.form.category_id_3 = 0 ;
this.form.category_id_4 = 0 ;
    for (let i = 0; i < this.len; i++) {


      if(i == 0) this.form.category_id   = this.category_array[0].selected_parent;
      if(i == 1) this.form.category_id_2 = this.category_array[1].selected_parent;
      if(i == 2) this.form.category_id_3 = this.category_array[2].selected_parent;
      if(i == 3) this.form.category_id_4 = this.category_array[3].selected_parent;

       
        
    }

    // this.form.search_key = this.feature_list;
    
console.log(this.form);

     this.db.FetchData(this.form,"Knowledge/add_document").subscribe((res)=>{
       console.log(res);
       
    let id=res['last_insert_id'];
    this.formData.append("id",id); 
    if(this.selectedFile.length > 0) {
      for(var i=0; i<this.selectedFile.length; i++)
      {
          this.formData.append("file_name"+i,this.selectedFile[i],this.selectedFile[i].name);

      }
    }else{
      this.router.navigate(['/knowledge-list']);

    }
    this.db.FileData(this.formData,"Upload/upload_files").subscribe((res)=>{
      
      if(res['message'] == "File Upload Successfully"){
        this.dialog.success('File Added Successfully');
        this.sendingData = true;
        
        this.formData=null;
        this.formData = new FormData();
        this.urls = null;
        this.urls = new Array<string>();
        this.selectedFile=[];

        this.router.navigate(['/knowledge-list']);
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
  this.db.FetchData({"val":val },"knowledge/getKeysKnldge")
  .subscribe( d =>{
    console.log(d);
    this.data = d;

  })

}

onFocused(e){
  // do something when input is focused
}



}    
