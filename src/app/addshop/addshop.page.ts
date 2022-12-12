import { Component, OnInit } from '@angular/core';
import {ApisService } from "../apis.service";
import {Camera,ImageOptions,CameraResultType,CameraSource} from "@capacitor/camera";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-addshop',
  templateUrl: './addshop.page.html',
  styleUrls: ['./addshop.page.scss'],
})
export class AddshopPage implements OnInit {
  base64:any;
  shopObj:any={imgPath:"",shopName:"",shopDescription:"",category:"",location:"",status:0};
  btnText:string="Add";
  constructor(private api:ApisService,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params)=>{
      let data = params["data"];
      
      if(data)
      {
        this.shopObj = JSON.parse(data);
       
        
        this.btnText = "Update";
        this.base64 = this.shopObj.imgPath;
      }
      else{
        
      this.shopObj={imgPath:"",shopName:"",shopDescription:"",category:"",location:"",status:0};
      this.btnText="Add";
      }
     
        
      
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
    if (this.base64)
    {
      let shopId = Date.now().toString();
      if(this.shopObj["shopId"])
      {
        shopId = this.shopObj["shopId"];
      }
      if(this.base64.search("https") == -1)
      {
      this.api.upload(this.base64, Date.now().toString() + ".png", function (url:string)
      {
        
        if (url)
        {
          ref.shopObj.imgPath = url;
          ref.shopObj.status =1;
          ref.api.manageShops(ref.shopObj, shopId, function ()
          {
            ref.api.showToast("successfully inserted!");

            ref.shopObj = {imgPath:"",shopName:"",shopDescription:"",category:"",location:"",status:0};
          })
         }
      })
    }
    else{
      ref.api.manageShops(ref.shopObj, shopId, function ()
      {
        ref.api.showToast("successfully updated!");

        ref.shopObj = {imgPath:"",shopName:"",shopDescription:"",category:"",location:"",status:0};
      })
    }
      }
  }
back()
{
  this.api.back();
}
}
