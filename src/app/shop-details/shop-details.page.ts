import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApisService } from "../apis.service";
import {Storage} from "@ionic/storage";
@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.page.html',
  styleUrls: ['./shop-details.page.scss'],
})
export class ShopDetailsPage implements OnInit {
  shopInfo:any;
  productsInfo:any;
  selectedItem:any="foods"
  proObj:any;
  proKeys:any;
  token:any = {};
  totalPrice:any = 0;
  items:any[]=[];
  constructor(private activatedRoute:ActivatedRoute,private api:ApisService,private storage:Storage) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params)=>{
     this.storage.get("token").then((token)=>{

      this.token = token;
      this.shopInfo = JSON.parse(params["data"]);
      console.log(this.shopInfo);
      if(this.shopInfo.products)
      {
        this.productsInfo = this.shopInfo.products;
        this.proObj = this.productsInfo;
        this.proKeys = Object.keys(this.proObj);
      }

    })
     
      
      
     
        
      
    })
  }

  placeOrder()
  {
    console.log(this.proObj);
    let orderObj:any = {};
    for(var i = 0;i<this.proKeys.length;i++)
    {
      if(this.proObj[this.proKeys[i]].qty)
      {
        this.items.push(this.proObj[this.proKeys[i]]);
        this.totalPrice += parseInt(this.proObj[this.proKeys[i]].price) * this.proObj[this.proKeys[i]].qty;
      }
    }
    if(this.items.length > 0)
    {
      orderObj["createdDate"] = new Date().toISOString().split("T")[0]+ " "+new Date().toTimeString().split("GMT")[0].trim();
      orderObj["shopId"] = this.shopInfo.shopId;
      orderObj["items"] = this.items;
      orderObj["status"] = "pending";
      orderObj["totalPrice"] = this.totalPrice;
      orderObj["adminemail"] = this.shopInfo.adminemail;
      orderObj["rideremail"] = "";
      orderObj["shopName"] = this.shopInfo.shopName;
      orderObj["shoplat"] = this.shopInfo.lat;
      orderObj["shoplng"] = this.shopInfo.lng;
      let ref = this;
      this.api.manageOrders(orderObj,Date.now().toString(),function()
      {
          ref.api.showToast("order placed !");
          orderObj = {};
          ref.api.goto("/orders")
      })
      console.log(orderObj);

    }
    else{
      this.api.showToast("please select items before submit");
    }
  }
  back()
{
  this.api.back();
}
addQty(key:any)
{
  if(this.proObj[key].qty == undefined)
  {
    this.proObj[key].qty = 0;
    
    
    
  }
  else{
    this.proObj[key].qty++;
  }
}
minusQty(key:any)
{
  if(this.proObj[key].qty == undefined)
  {
    this.proObj[key].qty = 0;
  }
  else{
   
    if(this.proObj[key].qty != 0)
    {
    
    this.proObj[key].qty--
    }
  }
}

}
