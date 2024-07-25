import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { LocationService } from '../services/location.firestore.service';
import { DestroyService } from '@shared/services/destroy.service';
import { takeUntil } from 'rxjs';
import { icon, marker, tileLayer } from 'leaflet';

export interface Location {
  lat: number,
  lng: number
}
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
});

@Component({
  selector: 'app-page-location',
  templateUrl: './page-location.component.html',
  styleUrls: ['./page-location.component.scss']
})
export class PageLocationComponent implements OnInit {

  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 16,
    center: { lat: 43.72, lng: 4.02 }
  }
  route!: Leaflet.Polyline;
    // Define our base layers so we can reference them multiple times
    streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      detectRetina: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
      detectRetina: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  
    // Marker for the top of Mt. Ranier
    summit = marker([ 46.8523, -121.7603 ], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
  
    // Marker for the parking lot at the base of Mt. Ranier trails
    paradise = marker([ 46.78465227596462,-121.74141269177198 ], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: {
      'Mt. Rainier Summit': this.summit,
      'Mt. Rainier Paradise Start': this.paradise,
      'Mt. Rainier Climb Route': this.route
    }
  };

  constructor(private locationService: LocationService, private destroy$: DestroyService) {
  }


  ngOnInit(): void {
    this.route = new Leaflet.Polyline([], {
      color: 'red',
      weight: 3,
      opacity: 0.5
      });
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.locationService.getAll().pipe(takeUntil(this.destroy$)).subscribe(location => this.initMarkers(location));

  }

  initMarkers(locations: Location[]) {
    console.log(locations);
    locations.forEach((location: Location, index: number) => {
      const marker = this.generateMarker(location, index);
      marker.addTo(this.map).bindPopup(`<b>${location.lat},  ${location.lng}</b>`);
      this.map.panTo(location);

      const position = new Leaflet.LatLng(location.lat, location.lng)
      this.route.addLatLng(position)
      this.route.addTo(this.map);

      this.markers.push(marker)
    })
    this.map.fitBounds(this.route.getBounds(), {
      padding: Leaflet.point(24, 24),
      maxZoom: 16,
      animate: true
    });
  }

  generateMarker(location: Location, index: number) {
    return Leaflet.marker(location, { draggable: false })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 

  updateMarker(index: number): void {
    this.markers[index].setLatLng({ lat: 28.625043, lng: 79.810135 });
  }

}

