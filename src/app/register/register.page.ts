
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {ApisService} from "../apis.service";
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private api:ApisService) { }

  ngOnInit() {
  }
  onSubmit(form: NgForm) {
    if(!form.valid) return;
   console.log(form.value);
   let obj:any = {};
   obj["email"] = form.value.email;
   obj["status"] = "1";
   obj["type"] = "user";
   obj["pwd"] = form.value.password;
   obj["mobile"] = form.value.phone;
   obj["name"]  = form.value.name;
   let ref = this;
   this.api.manageUsers(obj,function()
   {
         ref.api.showToast("user added!"); 
      
   });
  }



}
