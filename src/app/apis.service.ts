import { Injectable } from '@angular/core';
import {Location} from "@angular/common";
import firebase from 'firebase';
import { environment } from "../environments/environment";
import { Platform, LoadingController, ToastController, AlertController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import {Router,NavigationExtras} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ApisService {
config: any = environment.firebaseConfig;
  appname: any = environment.appname;
  email: string = "";
  role: string = "";
  token:any={};
  constructor(private platform: Platform,private storage:Storage,private loader:LoadingController,private toast:ToastController,private router:Router,private location:Location) { 
     this.platform.ready().then(() => {
     
      if (firebase.apps.length == 0) {
        firebase.initializeApp(this.config);

      }
      this.storage.get("token").then((token) => {
        this.token = token;
        this.email = "niks9489@gmail.com";
        this.token = "admin";
      })

    })
  }

  //shop insertion , deletion ,updation

   manageShops(obj:any,  key:any, fn:any) {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      
      firebase.database().ref(this.appname + "/shops/" + this.email.replace(/[^\w\s]/gi, '') + "/" + key).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        

      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    })
   }
//getting shop details
   getShops(fn:any)
   {
     this.loader.create({
       message:"please wait..."
     }).then((ele)=>{
       ele.present();
     this.email = this.email.replace(/[^a-zA-Z0-9 ]/g, '');
     firebase.database().ref(this.appname + "/shops/"+this.email).once('value').then((snapshot1) => {
       ele.dismiss();
       fn(snapshot1.val());
     },(err)=>{
       console.log(err);
       fn(err);
      ele.dismiss();
    })
   })
   }

   //product insertion ,product edit,product remove

   manageProduct(obj:any,shopid:any,  key:any, fn:any) {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      
      firebase.database().ref(this.appname + "/shops/" + this.email.replace(/[^\w\s]/gi, '') + "/" + shopid+"/products/"+key).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    })
   }

   //getting single product
   getSingleProduct(proId:any,shopId:any,fn:any)
   {
    // this.loader.create({
    //   message:"please wait..."
    // }).then((ele)=>{
    //   ele.present();
    this.email = this.email.replace(/[^a-zA-Z0-9 ]/g, '');
    firebase.database().ref(this.appname + "/shops/"+this.email+"/"+shopId+"/products/"+proId).once('value').then((snapshot1) => {
      //ele.dismiss();
      fn(snapshot1.val());
    },(err)=>{
      console.log(err);
      fn(err);
    // ele.dismiss();
   })
  //})
   }

   //get orders
   getOrders(fn:any)
   {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.email = this.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/orders/"+this.email).once('value').then((snapshot1) => {
        ele.dismiss();
        fn(snapshot1.val());
      },(err)=>{
        console.log(err);
        fn(err);
       ele.dismiss();
     })
    })
   }
  //banner insertion , remove
  manageBanner(obj:any,id:any,fn:any)
  {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      
      firebase.database().ref(this.appname + "/banners/" + this.email.replace(/[^\w\s]/gi, '') + "/" + id).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    })
  }

  //getting banners

  getBanners(fn:any)
  {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.email = this.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/banners/"+this.email).once('value').then((snapshot1) => {
        ele.dismiss();
        fn(snapshot1.val());
      },(err)=>{
        console.log(err);
        fn(err);
       ele.dismiss();
     })
    })
  }
  
  showToast(msg:any) {

    this.toast.create({
      message: msg,
      duration: 3000,
      


    }).then((ele) => {
      ele.present();
    })
  }

  upload(base64:any, fileName:any, fn:any) {
    let ref = this;
    this.loader.create({
      message: "uploading file..."
    }).then((ele) => {

      ele.present();

      // window.app.firebasetemp.database().ref(window.app.appName+"/images/"+id+"/").set(obj, function (err) {

      //   ele.dismiss();
      // })
      var storageref = firebase.storage().ref();

      var childRef = storageref.child(fileName);
      childRef.putString(base64, "data_url").then((snapshot) => {
        ele.dismiss();
        snapshot.ref.getDownloadURL().then((downloadURL) => {

          fn(downloadURL)
        }, (err) => {
          ele.dismiss();
          console.log(err);
        });
      }, (err) => {
        ele.dismiss();
        console.log(err);
      })


    })
  }

  goto(url:any,data ? :any)
  {
    if(data)
    {
      let navigationExtras: NavigationExtras = {
        queryParams: {
           data: JSON.stringify(data),
            
        }
    };
this.router.navigate([url],navigationExtras);
    }
    else{
      this.router.navigate([url]);
    }
  }

  back()
  {
    this.location.back();
  }

}
