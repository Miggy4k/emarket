import { Component, OnInit } from '@angular/core';

import {ApisService} from "../apis.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
orderIds:any[]=[];
ordersObj:any = {};
userType = ApisService.usertype;
email = ApisService.email;
  constructor(private api:ApisService) { }

  ngOnInit() {
    
  }
  ionViewWillEnter()
  {
    this.getOrders();
  }

  getOrders()
  {
    let ref = this;
    this.api.getOrders(function(res:any)
    {
      
      if(res)
      {
        console.log(res);
        console.log(ApisService.email);
        console.log(ApisService.usertype);
        ref.email = ApisService.email;
        ref.userType = ApisService.usertype;
        ref.ordersObj = res;
        ref.orderIds = Object.keys(res);
        // for(var i = 0;i<ref.orderIds.length;i++)
        // {
        //    ref.getSingleProduct(ref.ordersObj[ref.orderIds[i]]["shopId"],ref.ordersObj[ref.orderIds[i]]["proId"],ref.orderIds[i])
        // }
      }
    })
  }

  getSingleProduct(shopId:any,proId:any,orderId:any)
  {
      let ref = this;
      this.api.getSingleProduct(proId,shopId,function(res:any){
        
      ref.ordersObj[orderId]["product"]= res;
//alert(JSON.stringify(ref.ordersObj[orderId]));
      })
  }

  goto(url:any,data ?:any,id?:any)
{
  if(id)
  {
    data["id"] = id;
  }
  this.api.goto(url,data);
}

modifyStatus(id:any,status:any)
{
  let ref = this;
  this.api.modifyStatusOfOrder(id,status,function()
  {
    ref.api.showToast("status updated !");
    ref.getOrders();
  })

}

}
