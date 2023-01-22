import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ApisService} from "../apis.service";
import {Storage} from "@ionic/storage";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  type: boolean = true;
  isLogin = false;
  constructor(private api:ApisService,private storage:Storage,private router:Router) { }
email:string="";
pwd:string="";
  ngOnInit() {
  }

  showPassword() {
    this.type = !this.type;
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if(!form.valid) return;
    //this.login(form);
    this.email = form.value.email;
    this.pwd = form.value.password;
    let ref = this;
    this.api.login(this.email,function(res:any)
    {
      if(res)
      {
          console.log(res);
          if(res.pwd == ref.pwd)
          {
             ref.storage.set("token",res).then(()=>{
              ref.api.setToken().then(()=>{

              
                 ref.router.navigate(["/splash"]);
              })
             })
          }
          else{
            ref.api.showToast("Invalid Credentials !");
          }
      }
      else{
        ref.api.showToast("Invalid Credentials !");
      }
    })
  }

  login()
  {
    

  }

}
