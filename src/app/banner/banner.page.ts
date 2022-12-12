import { Component, forwardRef, OnInit } from '@angular/core';
import {ApisService } from "../apis.service";
import {Camera,ImageOptions,CameraResultType,CameraSource} from "@capacitor/camera";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.page.html',
  styleUrls: ['./banner.page.scss'],
})
export class BannerPage implements OnInit {
  bannerObj:any={imgPath:"",status:0};
  keys:any[]=[];
  obj:any = {};
    base64:any;
  constructor(private api:ApisService) { }

  ngOnInit() {
  }
  ionViewWillEnter()
  {
    this.getBanners();
  }

  pickImage()
{
  let obj:ImageOptions = {
    resultType:CameraResultType.DataUrl,
    source:CameraSource.Photos

  }
  Camera.getPhoto(obj).then((val)=>{
this.base64 = val.dataUrl;
 this.uploadImage();
  })
}
  uploadImage()
  {
    let ref = this;
    if (this.base64)
    {
      let bannerId = Date.now().toString();
      
      if(this.base64.search("https") == -1)
      {
      this.api.upload(this.base64, Date.now().toString() + ".png", function (url:string)
      {
        
        if (url)
        {
          ref.bannerObj.imgPath = url;
          ref.bannerObj.status =1;
          ref.api.manageBanner(ref.bannerObj,bannerId, function ()
          {
            ref.api.showToast("successfully inserted!");
            ref.bannerObj = {imgPath:"",status:0};
          })
         }
      })
      }
      else{
        // ref.proObj.imgPath = this.base64;
        // ref.proObj.status =1;
        ref.bannerObj.status =1;
          ref.api.manageBanner(ref.bannerObj,bannerId, function ()
          {
            ref.api.showToast("successfully deleted!");
            ref.bannerObj = {imgPath:"",status:0};

          })
      }
    }
  }

  getBanners()
  {
    let ref = this;
    this.api.getBanners(function(res:any)
    {
      if(res)
      {
ref.keys = Object.keys(res);
ref.obj = res;
      }
      else{
        ref.keys = [];
        ref.obj = {};
      }
    })
  }

}
