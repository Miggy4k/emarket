import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private storage: Storage,private router:Router) { }

  ngOnInit() {
   

  }
  ionViewDidEnter() {
    // Only called once on first enter.
    setTimeout(() => {
      this.storage.get("token").then((token) => {
        if (token == null) {
          this.router.navigate(["/login"]);
        }
        else {
          if(token.type == "admin")
          {
          this.router.navigate(["/orders"]);
          }
          else if(token.type == "user"){
            this.router.navigate(["/orders"]);
          }
        }

        
      })
    }, 3000)
  }

}
