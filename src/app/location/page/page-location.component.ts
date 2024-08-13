import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { LocationService } from '../services/location.firestore.service';
import { DestroyService } from '@shared/services/destroy.service';
import { Timestamp, takeUntil } from 'rxjs';
import { icon, marker, tileLayer } from 'leaflet';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';

export interface Location {
  id: string;
  address: string;
  date: Date;
  lat: number;
  lng: number;
  time: Timestamp<number>;
  user: string;
}
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/icons/mobile.png',
  iconUrl: 'assets/icons/mobile.png',
  shadowUrl: 'assets/marker-shadow.png'
});

@Component({
  selector: 'app-page-location',
  templateUrl: './page-location.component.html',
  styleUrls: ['./page-location.component.scss']
})
export class PageLocationComponent implements OnInit {
  public options!: Leaflet.MapOptions;
  public layersControl!: LeafletControlLayersConfig;

  private map!: Leaflet.Map;
  private route!: Leaflet.Polyline;
  private markers: Leaflet.Marker[] = [];

  // Define our base layers so we can reference them multiple times
  private streetMaps: Leaflet.Layer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  private wikiMaps: Leaflet.Layer = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  // Marker for the top of Mt. Ranier
  private summit = marker([46.8523, -121.7603], {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/icons/mobile.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  });

  // Marker for the parking lot at the base of Mt. Ranier trails
  private paradise!: Leaflet.Polyline; 
  private locations: Location[] = [];

  constructor(private locationService: LocationService, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.route = new Leaflet.Polyline([], {
      color: 'red',
      weight: 3,
      opacity: 0.5
    });
    this.layersControl = {
      baseLayers: {
        'Street Maps': this.streetMaps,
        'Wikimedia Maps': this.wikiMaps
      },
      overlays: {
        'Mt. Rainier Summit': this.summit,
        'Mt. Rainier Paradise Start': this.paradise,
        'Mt. Rainier Climb Route': this.route
      }
    };
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
      ],
      zoom: 18,
      maxZoom: 18,
      //maxNativeZoom: 18,
      center: { lat: 43.72, lng: 4.02 }
    };
  }

  public onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.locationService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => this.initMarkers(locations));
  }

  public onMapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  private initMarkers(locations: Location[]) {

    this.locations = locations;
    this.paradise = new Leaflet.Polyline([], {
      color: 'green',
      weight: 3,
      opacity: 0.5
    });
    //this.paradise.addLatLng(this.getUserMarker('samsung-a20e'));
    
    //this.paradise.addTo(this.map);
    

    locations.forEach((location: Location, index: number) => {
      const marker = this.generateMarker(location, index);
      marker.addTo(this.map).bindPopup(`<b>${location.lat},  ${location.lng}</b>`);
      this.map.panTo(location);

      const position = new Leaflet.LatLng(location.lat, location.lng);
      this.route.addLatLng(position);
      this.route.addTo(this.map);

      this.markers.push(marker);
    });
    this.map.fitBounds(this.route.getBounds(), {
      padding: Leaflet.point(24, 24),
      animate: true
    });
  }

  private getUserMarker(user: string): Leaflet.LatLngExpression[] {
    return this.locations
      .filter(location => location.user === user)
      .map(location => ({
        lat: location.lat,
        lng: location.lng
      }));
  }

  private generateMarker(location: Location, index: number) {
    return Leaflet.marker(location, { draggable: false }).on('click', event => this.markerClicked(event, index));
  }

  private markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }
}
