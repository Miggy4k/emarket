import { Component, OnInit } from '@angular/core';
import {ApisService } from "../apis.service";
@Component({
  selector: 'app-tripinfo',
  templateUrl: './tripinfo.page.html',
  styleUrls: ['./tripinfo.page.scss'],
})
export class TripinfoPage implements OnInit {
keys:any;
obj:any;
  constructor(private api:ApisService) { }

  ngOnInit() {
    this.getRiders();
  }

  getRiders()
  {
    let ref = this;
    this.api.getRiders(function(res:any)
    {
      console.log(res);
      if(res)
      {
        ref.obj= res;
        ref.keys = Object.keys(res);
      }
      else
      {
        ref.obj = {};
        ref.keys = [];
      }

    })
  }

  goto(url:any,data ?:any,key?:any)
  {
    
  this.api.goto(url,data);
  }

}
