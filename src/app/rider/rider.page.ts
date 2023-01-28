import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ApisService } from "../apis.service";

@Component({
  selector: 'app-rider',
  templateUrl: './rider.page.html',
  styleUrls: ['./rider.page.scss'],
})
export class RiderPage implements OnInit {
riderObj:any = {email:"",name:"",onwork:"0",status:"1",pwd:"",mobile:"",tripInfo:{},type:"rider"}
id:any;
  constructor(private api:ApisService) { }

  ngOnInit() {
  }

  manageRider()
  {
    this.id = Date.now().toString();
    let ref = this;
     this.api.manageRider(this.riderObj,this.id,function()
     {
      ref.riderObj = {};
     })
  }

}
