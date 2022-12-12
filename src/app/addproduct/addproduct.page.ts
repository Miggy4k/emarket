import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import {ApisService } from "../apis.service";
import {Camera,ImageOptions,CameraResultType,CameraSource} from "@capacitor/camera";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {
  keys:any[]=[];
obj:any = {};
  base64:any;
  shop:any;
  shopDisabled:boolean = false;
  proObj:any={imgPath:"",proName:"",proDescription:"",category:"",price:"",status:0,shopId:""}
  btnText:string="Add";
  
  constructor(private api:ApisService,private activatedRoute:ActivatedRoute,private change:ChangeDetectorRef) { }

  ngOnInit() {
this.activatedRoute.queryParams.subscribe((params)=>{
  let data = params["data"];
  
  if(data)
  {
    this.proObj = JSON.parse(data);
   
    this.shop = this.proObj.shopId;
    
    this.shopDisabled = true;
    this.btnText = "Update";
    this.base64 = this.proObj.imgPath;
  }
  else{
    this.shopDisabled = false;
    this.shop = undefined;
  this.proObj={imgPath:"",proName:"",proDescription:"",category:"",price:"",status:0,shopId:""}
  this.btnText="Add";
  }
 
    this.getShops();
    this.change.detectChanges();
  
})

  }
pickImage()
{
  let obj:ImageOptions = {
    resultType:CameraResultType.DataUrl,
    source:CameraSource.Photos

  }
  Camera.getPhoto(obj).then((val)=>{
this.base64 = val.dataUrl;
//this.uploadImage();
  })
}
  uploadImage()
  {
    let ref = this;
    if (this.base64 && this.shop)
    {
      let proId = Date.now().toString();
      if(this.proObj["proId"])
      {
        proId = this.proObj["proId"];
      }
      if(this.base64.search("https") == -1)
      {
      this.api.upload(this.base64, Date.now().toString() + ".png", function (url:string)
      {
        
        if (url)
        {
          ref.proObj.imgPath = url;
          ref.proObj.status =1;
          ref.api.manageProduct(ref.proObj,ref.shop, proId, function ()
          {
            ref.api.showToast("successfully inserted!");
            ref.proObj = {imgPath:"",proName:"",proDescription:"",category:"",price:"",status:0,shopId:""};
          })
         }
      })
      }
      else{
        // ref.proObj.imgPath = this.base64;
        // ref.proObj.status =1;
        ref.api.manageProduct(ref.proObj,ref.shop, proId, function ()
        {
          ref.api.showToast("successfully updated!");
          ref.proObj = {imgPath:"",proName:"",proDescription:"",category:"",price:"",status:0,shopId:""};
        })
      }
    }
  }
back()
{
  this.api.back();
}

getShops()
  {
    let ref = this;
    this.api.getShops(function(res:any)
    {
      
      if(res)
      {
      ref.keys = Object.keys(res);
      ref.obj = res;
      if(ref.keys.length>0 && ref.shop == undefined)
      {
      ref.shop = ref.keys[0];
      }
      }
      else{
        ref.keys = [];
      ref.obj = {};
      }
    })
  }

}
