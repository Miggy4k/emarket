import { Injectable } from '@angular/core';
import {Location} from "@angular/common";
import firebase from 'firebase';
import { environment } from "../environments/environment";
import { Platform, LoadingController, ToastController, AlertController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import {Router,NavigationExtras} from "@angular/router";
import { Observable } from 'rxjs';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import {Geolocation} from "@capacitor/geolocation";


@Injectable({
  providedIn: 'root'
})
export class ApisService {
config: any = environment.firebaseConfig;
  appname: any = environment.appname;
  static email: string = "";
  static role: string = "";
  token:any={};
  static usertype: any;
  constructor(private platform: Platform,private storage:Storage,private loader:LoadingController,private toast:ToastController,private router:Router,private location:Location,private geocoder:NativeGeocoder,private alertCtrl:AlertController) { 
     this.platform.ready().then(() => {
     
      if (firebase.apps.length == 0) {
        firebase.initializeApp(this.config);

      }
      this.setToken();
     

    })
  }

  getToken()
  {
    
      return new Promise((resolve,response)=>{
  
      
       this.storage.get("token").then((token) => {
        resolve(token);
      })
    })
  }

  setToken()
  {
    return new Promise((resolve,response)=>{

    
     this.storage.get("token").then((token) => {
        if(token)
        {
          console.log(token);
        this.token = token;
        ApisService.email = token.email;
        ApisService.usertype = token.type;
        resolve("");
        }
        else{
          resolve("");
        }
      })
    })
  }
   
  //shop insertion , deletion ,updation

   manageShops(obj:any,  key:any, fn:any) {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.AddressToGps(obj.location).then((res:any)=>{
        
       let arr = res.split(',');
       obj.lat = arr[0];
       obj.lng = arr[1];
      
      firebase.database().ref(this.appname + "/shops/" + ApisService.email.replace(/[^\w\s]/gi, '') + "/" + key).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        

      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    },(err)=>{
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
       this.setToken().then(()=>{

       if(ApisService.usertype == "admin")
       {
     ApisService.email = ApisService.email.replace(/[^a-zA-Z0-9 ]/g, '');
     firebase.database().ref(this.appname + "/shops/"+ApisService.email).once('value').then((snapshot1) => {
       ele.dismiss();
       fn(snapshot1.val());
     },(err)=>{
       console.log(err);
       fn(err);
      ele.dismiss();
    })
  }
  else{
    firebase.database().ref(this.appname + "/shops/").once('value').then((snapshot1) => {
      ele.dismiss();
      fn(snapshot1.val());
    },(err)=>{
      console.log(err);
      fn(err);
     ele.dismiss();
   })
  }
  })
   })
   }

   //product insertion ,product edit,product remove

   manageProduct(obj:any,shopid:any,  key:any, fn:any) {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
      firebase.database().ref(this.appname + "/shops/" + ApisService.email.replace(/[^\w\s]/gi, '') + "/" + shopid+"/products/"+key).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
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
    this.setToken().then(()=>{
    ApisService.email = ApisService.email.replace(/[^a-zA-Z0-9 ]/g, '');
    firebase.database().ref(this.appname + "/shops/"+ApisService.email+"/"+shopId+"/products/"+proId).once('value').then((snapshot1) => {
      //ele.dismiss();
      fn(snapshot1.val());
    },(err)=>{
      console.log(err);
      fn(err);
    // ele.dismiss();
   })
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
      this.setToken().then(()=>{
      ApisService.email = ApisService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/orders/").once('value').then((snapshot1) => {
        ele.dismiss();
        fn(snapshot1.val());
      },(err)=>{
        console.log(err);
        fn(err);
       ele.dismiss();
     })
    })
    })
   }
   //manage orders

   manageOrders(obj:any,id:any,fn:any)
   {
     this.loader.create({
       message: "please wait..."
     }).then((ele) => {
 
       ele.present();

       this.setToken().then(()=>{
        obj["useremail"] = ApisService.email.replace(/[^\w\s]/gi, '');
        Geolocation.getCurrentPosition().then((position)=>{

        obj["userlat"] = position.coords.latitude.toString();
        obj["userlng"] = position.coords.longitude.toString();
       firebase.database().ref(this.appname + "/orders/"  + id).set(obj).then(() => {
         ele.dismiss();
 
 
         fn("ok");
         
 
 
       }, (err) => {
         ele.dismiss();
         this.showToast(JSON.stringify(err));
 
       })
      },(err)=>{
        this.showToast(JSON.stringify(err));
      })
     })
     })
   }

   //modify status of order
   modifyStatusOfOrder(id:any,status:any,fn:any)
   {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();

      this.setToken().then(()=>{
       
      firebase.database().ref(this.appname + "/orders/"  + id+"/status/").set(status).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    })
    })
   }
   //assign rider
   assignRider(riderEmail:any,orderId:any,fn:any)
   {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
        // obj["adminemail"] = ApisService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/users/" + riderEmail+"/orderId").set(orderId).then(() => {
        firebase.database().ref(this.appname + "/orders/" + orderId+"/rideremail").set(riderEmail).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    }, (err) => {
      ele.dismiss();
      this.showToast(JSON.stringify(err));

    })
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
      this.setToken().then(()=>{
      firebase.database().ref(this.appname + "/banners/" + ApisService.email.replace(/[^\w\s]/gi, '') + "/" + id).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
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
      this.setToken().then(()=>{
      ApisService.email = ApisService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/banners/"+ApisService.email).once('value').then((snapshot1) => {
        ele.dismiss();
        fn(snapshot1.val());
      },(err)=>{
        console.log(err);
        fn(err);
       ele.dismiss();
     })
    })
    })
  }

  //getting riders

  getRiders(fn:any)
  {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
      ApisService.email = ApisService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/users/").once('value').then((snapshot1) => {
        ele.dismiss();
        fn(snapshot1.val());
      },(err)=>{
        console.log(err);
        fn(err);
       ele.dismiss();
     })
    })
    })
  }
  //manage riders
  manageRider(obj:any,id:any,fn:any)
  {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
        obj["adminemail"] = ApisService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/users/" + obj.email.replace(/[^\w\s]/gi, '')).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    })
    })
  }

  //login
  login(email:any,fn:any)
  {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
      firebase.database().ref(this.appname + "/users/" + email.replace(/[^\w\s]/gi, '') + "/").once('value').then((snapshot1) => {
        ele.dismiss();
        fn(snapshot1.val());
      },(err)=>{
       
        fn(err);
       ele.dismiss();
     })
    })
    })
  }

  //register
  manageUsers(obj:any,fn:any)
  {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
      firebase.database().ref(this.appname + "/users/" + obj.email.replace(/[^\w\s]/gi, '')).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
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

  AddressToGps(address:string)
  {
    return new Promise((resolve,error)=>{

    
    this.geocoder.forwardGeocode(address).then((res:NativeGeocoderResult[])=>{
        if(res)
        {
           resolve(res[0].latitude.toString()+","+res[0].longitude.toString())
        }
        else{
error("unable to get gps");
        }
    },(err)=>{
error(err);
    })
  })
  }

  showAlert(msg:string)
  {
   this.alertCtrl.create({
    message:msg,
    backdropDismiss:false,
    buttons:[{
      text:"ok"
    }]
   }).then((ele)=>{
    ele.present();
   })
  }

}
