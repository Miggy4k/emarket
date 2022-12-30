import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApisService } from "../apis.service";
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
  constructor(private activatedRoute:ActivatedRoute,private api:ApisService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params)=>{
     
      this.shopInfo = JSON.parse(params["data"]);
      if(this.shopInfo.products)
      {
        this.productsInfo = this.shopInfo.products;
        this.proObj = this.productsInfo;
        this.proKeys = Object.keys(this.proObj);
      }
      
     
      
      
     
        
      
    })
  }
  back()
{
  this.api.back();
}

}
