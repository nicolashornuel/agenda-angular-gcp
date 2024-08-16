import { Component, OnInit } from '@angular/core';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { DestroyService } from '@shared/services/destroy.service';
import { UtilService } from '@shared/services/util.service';
import * as Leaflet from 'leaflet';
import { takeUntil } from 'rxjs';
import { GeoLocation, layersControl, mapOptions, markerOptions } from '../models/locations.constant';
import { LocationFunctionService, LocationService } from '../services/location.firestore.service';

@Component({
  selector: 'app-page-location',
  templateUrl: './page-location.component.html',
  styleUrls: ['./page-location.component.scss']
})
export class PageLocationComponent implements OnInit {

  public options: Leaflet.MapOptions = mapOptions;
  public layersControl: LeafletControlLayersConfig = layersControl;
  public isLoading = false;

  private map!: Leaflet.Map;
  private locations: GeoLocation[] = [];

  constructor(private locationService: LocationService, private destroy$: DestroyService, private util: UtilService, private locationFunctionService: LocationFunctionService) {}

  ngOnInit(): void {
    this.fetchLocations();
  }

  public onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.layersControl.overlays = {
      'Polyline': this.polylineLayer,
      'Markers': this.markersLayer
    }
  }

  public onMapClicked($event: any) {
    const position = new Leaflet.LatLng($event.latlng.lat, $event.latlng.lng);
    new Leaflet.Popup().setLatLng(position).setContent(`${position}`).addTo(this.map);
  }

  private fetchLocations(): void {
        this.isLoading = true;
/*     this.locationService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => {
        this.locations = this.util.sortInByDesc(locations, 'time');
        this.isLoading = false;
      }); */

      /* this.locationFunctionService.findByDateRange('time', 1723523904126, 1723527401078).then(locations => {
        console.log(locations);
        this.locations = this.util.sortInByDesc(locations.data, 'time');
        this.isLoading = false;
      }); */

    this.isLoading = true;
    this.locationService.firstPage('date', 50).then(locations => {
      this.locations = this.util.sortInByDesc(locations.items, 'time');
      this.isLoading = false;
    });
  }

  private getUserMarker(user: string): Leaflet.LatLngExpression[] {
    let set = new Set(this.locations.map(location => location.user));
    console.log(set);
    return this.locations
      .filter(location => location.user === user)
      .map(location => ({
        lat: location.lat,
        lng: location.lng
      }));
  }


  private get markersLayer(): Leaflet.Layer {
    const markers: Leaflet.Marker[] = this.locations.map(location => {
      const marker = this.generateMarker(location);
      marker.bindPopup(`<b>${this.getDisplayDate(location)}</b> <br /> ${location.address} <br /> ${location.lat},  ${location.lng}`);
      this.setFocus(location)
      return marker;
    });
    return Leaflet.layerGroup(markers).addTo(this.map);
  }

  private get polylineLayer(): Leaflet.Layer {
    const polyline: Leaflet.Polyline = this.generatePolyline(this.locations).addTo(this.map);
    //this.map.fitBounds(polyline.getBounds());
    return polyline;
  }

  private generateMarker(location: GeoLocation): Leaflet.Marker {
    return Leaflet.marker(location, markerOptions);
  }

  private generatePolyline(locations: GeoLocation[]): Leaflet.Polyline {
    return Leaflet.polyline(locations);
  }

  private setFocus(location: GeoLocation): void {
    this.map.panTo(location);
  }

  private getDisplayDate(location: GeoLocation): string {
    return new Date(location.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
