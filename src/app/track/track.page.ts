import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoadingController} from "@ionic/angular";
declare var H:any;
declare var $:any;
@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage implements OnInit {
  platform: any;

  map: any;
  startMarker: any;
  endMarker: any;
  data:any;
  distance: string = "NA";
  
  AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json';
  routingUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json";
  ajaxRequest = new XMLHttpRequest();
  query = '';
  APIKEY = "9UW6Gs7i1XXWjIS6KWdJ8md1PzxvGMTDqMRyn5Ba8Uw";
  response: any;
  routeShape: any;
  routeLine: any;
  constructor(private activatedRoute:ActivatedRoute,private loadingController:LoadingController) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res)=>{
  
  if(res["data"])
  {
  this.data = JSON.parse(res["data"]);
  console.log(this.data);
  }
    
    var that = this;
    setTimeout(function () {
      that.platform = new H.service.Platform({
       
        'apikey':that.APIKEY
      });
      var defaultLayers = that.platform.createDefaultLayers();
      that.map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.raster.terrain.map,
        // defaultLayers.vector.normal.map,
        {
          zoom: 10,
          center: { lat: 52.5, lng: 13.4 },

        });
      var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(that.map));
      var ui = H.ui.UI.createDefault(that.map, defaultLayers);
      var mapSettings = ui.getControl('mapsettings');
      var zoom = ui.getControl('zoom');
      var scalebar = ui.getControl('scalebar');

      mapSettings.setAlignment('top-right');
      zoom.setAlignment('top-right');
      scalebar.setAlignment('top-right');
      let arr = that.data.tripinfo.sGps.split(',');
      let lat = arr[0];
      let lng = arr[1];
      that.PlotMarker(lat,lng,1);
       arr = that.data.tripinfo.eGps.split(',');
       lat = arr[0];
       lng = arr[1];
      that.PlotMarker(lat,lng,2);
    }, 2000)
  })
  }

  PlotMarker(latitude:any, longitude:any, action:any) {
    var ref = this;
    //var locations = e.Response.View[0].Result
    var position = {
      lat: latitude,
      lng: longitude
    };
    if (action == 1) {
    
      if (ref.startMarker) {
        console.log(position);
        ref.startMarker.setGeometry(position);


      }
      else {
        var svgMarkup = '<svg width="24" height="24" ' +
          'xmlns="http://www.w3.org/2000/svg">' +
          '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
          'height="22" /><text x="12" y="18" font-size="12pt" ' +
          'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
          'fill="white">S</text></svg>';
        var icon = new H.map.Icon(svgMarkup);
        ref.startMarker = new H.map.Marker(position, {
          // mark the object as volatile for the smooth dragging
          volatility: true,
          icon: icon
        });
       // ref.startMarker.draggable = true;
        ref.map.addObject(ref.startMarker);


      }
    }
    else {
     

      if (ref.endMarker) {
        console.log(position);
        ref.endMarker.setGeometry(position);
      }
      else {
        var svgMarkup = '<svg width="24" height="24" ' +
          'xmlns="http://www.w3.org/2000/svg">' +
          '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
          'height="22" /><text x="12" y="18" font-size="12pt" ' +
          'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
          'fill="white">E</text></svg>';
        var icon = new H.map.Icon(svgMarkup);
        ref.endMarker = new H.map.Marker(position, {
          // mark the object as volatile for the smooth dragging
          volatility: true,
          icon: icon
        });
       // ref.endMarker.draggable = true;
        ref.map.addObject(ref.endMarker);
        ref.DrawRoute();


      }

    }
    ref.map.setCenter(position);
    ref.map.setZoom(18);
  }

  DrawRoute() {
 
    var ref = this;
    this.loadingController.create({ message: "please wait..." }).then((loadingElement) => {
    loadingElement.present()
   
    var paramObj:any = {};
    paramObj["apiKey"] = "wQJ2nooxwzxOFJwtt8d1PUinND8lrxHE5XC_YMEGMSw";
    paramObj["waypoint0"] = 'geo!' + this.startMarker.getGeometry().lat.toString() + ',' + this.startMarker.getGeometry().lng.toString();
    paramObj["waypoint1"] = 'geo!' + this.endMarker.getGeometry().lat.toString() + ',' + this.endMarker.getGeometry().lng.toString();
    paramObj["mode"] = 'fastest;car;';
    paramObj["representation"] = "display";
    paramObj["routeAttributes"] = "summary";
    paramObj["RouteLegAttributeType"] = "wp,mn";
    paramObj["maneuverattributes"] = "direction,action";
   
    console.log(paramObj);



   
    
    var params = $.param(paramObj);
    this.ajaxRequest.open('GET', this.routingUrl + "?" + params);
    this.ajaxRequest.onerror = function () {
      //$("#ajaxloader").hide();
      //ref.loadingController.dismiss().then(() => {
     loadingElement.dismiss().then(()=>{

     
      ref.DrawRoute();
     })
      //});

    }


    this.ajaxRequest.send();
    this.ajaxRequest.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // ref.loadingController.dismiss().then(() => {
       // $("#ajaxloader").hide();
       loadingElement.dismiss();
        var result = JSON.parse(this.responseText);
        console.log(result);
        if (result.response.route) {
          // Pick the first route from the response:
         let route = result.response.route[0];
        //  ref.distance = (parseInt(route.summary.distance) / 1000).toString() + "KM";
        ref.distance = route.summary.text;
        let routeShape = route.shape;
         ref.drawRouteTemp(routeShape);
         
      
        //});
      }

    }
  }
  

    
    // })
    })
  }

  drawRouteTemp(routeShape:any)
  {
    
    

    var linestring:any;
    var ref = this;
  
    // Pick the route's shape:
   

    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();

    // Push all the points in the shape into the linestring:
    this.routeShape = routeShape;
    
    routeShape.forEach(function (point:any) {
      var parts = point.split(',');
      linestring.pushLatLngAlt(parts[0], parts[1]);
       
    });
   // let temp = 0;
    // for(var i = 0;i<routeShape.length;i++)
    // {
    //   if(i < routeShape.length-1)
    //   {
    //   var point = routeShape[i];
    //   var parts = point.split(',');
    //   var point1 = routeShape[i+1];
    //   var parts1 = point1.split(',');
     
    //  temp += ref.api.calcCrow(parts[0],parts[1],parts1[0],parts1[1]);
    //   }
     
    // }
   

   
    if (ref.routeLine) {
      ref.map.removeObject(ref.routeLine);
    }
    ref.routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: 'blue', lineWidth: 3 }
    });


    ref.map.addObjects([ref.routeLine]);


    ref.map.getViewModel().setLookAtData({ bounds: ref.routeLine.getBoundingBox() });
  

   

  

  }

}
