import { Component, OnInit } from '@angular/core';
import {ApisService } from "../apis.service";
import {AlertController} from "@ionic/angular";




@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
keys:any[]=[];
obj:any = {};
token:any = {};
  constructor(private api:ApisService,private alertCtrl:AlertController) { }

  ngOnInit() {
    
  }
  ionViewWillEnter()
  {
    this.api.getToken().then((token:any)=>
    {
      this.token= token;
    this.getShops();
    })
  }

  getShops()
  {
    let ref = this;
    this.api.getShops(function(res:any)
    {
      console.log(res);
    

      if(ref.token.type == "admin")
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
    }
    else{
      if(res)
      {
        let k = Object.keys(res);
        let obj:any = {};
       for(var i = 0;i<k.length;i++)
       {
         let objtemp = res[k[i]];
         let ktemp = Object.keys(objtemp);
        for(let j = 0;j<ktemp.length;j++)
        {
          objtemp[ktemp[j]]["adminemail"] = k[i]
          obj[ktemp[j]] = objtemp[ktemp[j]];
        }
       }
       console.log(obj);
      ref.keys = Object.keys(obj);
      ref.obj = obj;
      
      }
      else{
        ref.keys = [];
      ref.obj = {};
      }
       
    }
    })
    
  }
 
  goto(url:any,data ?:any,key?:any)
  {
    if(data)
    {
      if(key)
      {
        data["shopId"] = key;
       
      }
    }
  this.api.goto(url,data);
  }

removeShop(obj:any,key:any)
{
  
  this.alertCtrl.create({
    message:"Do you want to delete?",
    backdropDismiss:false,
    buttons:[{
      text:"OK",
      handler:()=>{
        let ref = this;
  obj["status"] = "0";
        this.api.manageShops(obj, key, function ()
        {
           ref.api.showToast("successfully deleted");
           ref.getShops();

        })
      }
    },{
      text:"Cancel"
    }]
  }).then((ele)=>{
    ele.present();
  })
  
}


}
