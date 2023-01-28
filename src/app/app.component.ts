import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Router} from "@angular/router";
import { Storage } from "@ionic/storage";
import {MenuController,ModalController} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  navigate:any[] = [];
   admin:boolean = false;
   username:string="";
  constructor(
    private platform: Platform,
   
    private router:Router,
    private storage:Storage,
    private menu:MenuController,
    private modal: ModalController)
  {
    this.platform.ready().then(() => {
      if(this.admin)
      {
        this.navigate = [
       
        {
          icon:"assets/images/orders.png",
          title:"Orders",
          url:"/orders"
          },
         {
          icon:"assets/images/shop.png",
          title:"Shop",
          url:"/shop"
          },
         {
          icon:"assets/images/products.png",
          title:"Products",
          url:"/products"
        },
        
        {
          icon:"assets/images/track.png",
          title:"Track Rider",
          url:"/tripinfo"
        },
        {
          icon:"assets/images/insights.png",
          title:"Insights",
          url:"/insights"
        },
        {
          icon:"assets/images/banner.png",
          title:"Banner",
          url:"/banner"
        },
        {
          icon:"assets/images/track.png",
          title:"Rider",
          url:"/rider"
        },
        
       
      ]
    }
    else{
      this.navigate = [
       
        {
          icon:"assets/images/orders.png",
          title:"Orders",
          url:"/orders"
          },
         {
          icon:"assets/images/shop.png",
          title:"Shop",
          url:"/shop"
          }
       
        
       
      ]
    }
    })
  }

   goto(obj:any) {
    
     this.menu.close().then(() => {
        

       this.router.navigate([obj.url]);
     })

     
  }

  onMenuOpen()
  {
   
   this.storage.get("token").then((token)=>{
    if(token)
    {
      this.username = token.name;
      if(token.type == "admin")
      {
        this.admin = true;
        this.navigate = [
       
          {
            icon:"assets/images/orders.png",
            title:"Orders",
            url:"/orders"
            },
           {
            icon:"assets/images/shop.png",
            title:"Shop",
            url:"/shop"
            },
           {
            icon:"assets/images/products.png",
            title:"Products",
            url:"/products"
          },
          
          {
            icon:"assets/images/track.png",
            title:"Track Rider",
            url:"/tripinfo"
          },
          {
            icon:"assets/images/insights.png",
            title:"Insights",
            url:"/insights"
          },
          {
            icon:"assets/images/banner.png",
            title:"Banner",
            url:"/banner"
          },
          {
            icon:"assets/images/track.png",
            title:"Rider",
            url:"/rider"
          },
          
         
        ]
      }
      else if(token.type == "user")
      {
        this.admin = false;
        this.navigate = [
       
          {
            icon:"assets/images/orders.png",
            title:"Orders",
            url:"/orders"
            },
           {
            icon:"assets/images/shop.png",
            title:"Shop",
            url:"/shop"
            }
         
          
         
        ]
      }
      else{
        this.admin = false;
        this.navigate = [
       
          {
            icon:"assets/images/orders.png",
            title:"Orders",
            url:"/orders"
            }
           
         
          
         
        ]
      }
    }
   })
  }


  Logout() {
    this.menu.close().then(()=>{
    this.storage.clear().then(() => {
      this.router.navigate(["/splash"]);
    })
  })
  }
}
