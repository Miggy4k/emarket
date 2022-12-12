import { Component, OnInit } from '@angular/core';
import {ApisService} from "../apis.service";
import {ActivatedRoute} from "@angular/router"
@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.page.html',
  styleUrls: ['./orderdetails.page.scss'],
})
export class OrderdetailsPage implements OnInit {
orderDetails:any;
  constructor(private api:ApisService,private activated:ActivatedRoute) { }

  ngOnInit() {
    this.activated.queryParams.subscribe((res)=>{
      //alert(res["data"]);
      this.orderDetails = JSON.parse(res["data"]);
      
    })
  }

  back()
{
  this.api.back();
}


}
