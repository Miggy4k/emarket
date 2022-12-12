import { Component, OnInit } from '@angular/core';
import {ApisService } from "../apis.service";
import {AlertController} from "@ionic/angular";


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  keys:any[]=[];
  obj:any = {};
  selectedShop:any = "";
  proObj:any = {};
  proKeys:any[] = [];
  constructor(private api:ApisService,private alertCtrl:AlertController) { }

  ngOnInit(): void {
      
  }
  ionViewWillEnter() {
    this.getShops();
  }

  goto(url:any,data ?:any,key?:any)
{
  if(data)
  {
     if(key)
    {
      data["shopId"] = this.selectedShop;
      data["proId"] = key;
    }
  }
this.api.goto(url,data);
}
 

removeProduct(obj:any,key:any)
{
  
  this.alertCtrl.create({
    message:"Do you want to delete?",
    backdropDismiss:false,
    buttons:[{
      text:"OK",
      handler:()=>{
        let ref = this;
  obj["status"] = "0";
        this.api.manageProduct(obj,this.selectedShop, key, function ()
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
getShops()
{
  let ref = this;
  this.api.getShops(function(res:any)
  {
    
    if(res)
    {
    ref.keys = Object.keys(res);
    ref.obj = res;
    if(ref.keys.length > 0)
    {
      ref.selectedShop = ref.keys[0];
    }
    }
    else{
      ref.keys = [];
    ref.obj = {};
    }
  })
}

onShopChanged(event:any)
{
let shopKey = event.target.value;
this.proObj = this.obj[shopKey]["products"];

this.proKeys = Object.keys(this.proObj);
}

}
