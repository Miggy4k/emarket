import { Component, OnInit } from '@angular/core';
declare var H:any;
@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage implements OnInit {
  platform: any;

  map: any;
  constructor() { }

  ngOnInit() {
    var that = this;
    setTimeout(function () {
      that.platform = new H.service.Platform({
       
        'apikey':'9UW6Gs7i1XXWjIS6KWdJ8md1PzxvGMTDqMRyn5Ba8Uw'
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
     
    }, 2000)
  }

}
