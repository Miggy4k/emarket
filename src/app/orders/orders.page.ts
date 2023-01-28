import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';

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
riderObj:any={};
riderKeys:any[]=[];
selectedRider:any = "";
  constructor(private api:ApisService,private change:ChangeDetectorRef) { }

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
        
        ref.email = ApisService.email;
        ref.userType = ApisService.usertype;
        ref.ordersObj = res;
        ref.orderIds = Object.keys(res);
        console.log(res);
        // for(var i = 0;i<ref.orderIds.length;i++)
        // {
        //    ref.getSingleProduct(ref.ordersObj[ref.orderIds[i]]["shopId"],ref.ordersObj[ref.orderIds[i]]["proId"],ref.orderIds[i])
        // }
        ref.getRiders();

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

modifyStatus(id:any,status:any,orderId:any)
{
  if(this.ordersObj[orderId].rideremail)
  {
  let ref = this;
  this.api.modifyStatusOfOrder(id,status,function()
  {
    ref.api.showToast("status updated !");
    if(ref.userType == "admin")
    {
    ref.assignRider(orderId);
    }
    else{
    ref.getOrders();
    }
  })
}
else{
  this.api.showToast("please select any rider");
}

}

getRiders()
{
  let ref = this;
  this.api.getRiders(function(res:any)
  {
     console.log(res);
     if(res)
     {
      ref.riderKeys = Object.keys(res);
      ref.riderObj = res;
      ref.change.detectChanges();
     }
  })
}
assignRider(orderId:any)
{
let ref = this;
this.api.assignRider(this.ordersObj[orderId].rideremail,orderId,function()
{
  ref.api.showToast("rider assigned");
  ref.getOrders();
})
}


navigate(orderId:any)
{
  var url = "https://www.google.com/maps/dir/?api=1&travelmode=walking&dir_action=navigate&destination="+this.ordersObj[orderId].userlat+","+this.ordersObj[orderId].userlng;
  // alert(url);
  window.open(url);
}

getCustomerDetails(orderId:any)
{
let ref = this;
this.api.login(this.ordersObj[orderId].useremail,function(res:any)
{
  let str = "Name:"+res.name+"<br /><br />Email:"+res.email+"<br /><br />Mobile:"+res.mobile;
  ref.api.showAlert(str);
})
}

}
