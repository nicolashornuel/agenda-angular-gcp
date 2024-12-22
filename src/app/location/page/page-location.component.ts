import { Component, OnInit } from '@angular/core';
import { UtilService } from '@shared/services/util.service';
import * as Leaflet from 'leaflet';
import { GeoLocation, baseLayers, dotMarkerOptions, mapOptions, mobileMarkerOptions } from '../models/locations.constant';
import { LocationFunctionService } from '../services/location.firestore.service';

@Component({
  selector: 'app-page-location',
  templateUrl: './page-location.component.html',
  styleUrls: ['./page-location.component.scss']
})
export class PageLocationComponent implements OnInit {
  public options: Leaflet.MapOptions = mapOptions;
  public isLoading = false;
  public periode: any;
  public isLocked = true;
  public locations: GeoLocation[] = [];

  private map!: Leaflet.Map;

  constructor(private util: UtilService, private locationFunctionService: LocationFunctionService) {}

  ngOnInit(): void {
    this.initPeriode();
    this.getData();
  }

  //////////////////////////////////////////// Events ////////////////////////////////////////////

  public onFilterData(): void {
    this.getData();
  }

  public onMapReady($event: Leaflet.Map): void {
    this.map = $event;
    this.buildLayers();
  }

  public onMapClicked($event: any): void {
    const position = new Leaflet.LatLng($event.latlng.lat, $event.latlng.lng);
    new Leaflet.Popup().setLatLng(position).setContent(`${position}`).addTo(this.map);
  }

  public onDeleteData(): void {
    this.isLoading = true;
    let promises = this.locations.map(location => this.locationFunctionService.delete(location.id));
    Promise.all(promises)
      .then(() => {
        this.isLoading = false;
        this.locations = [];
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  //////////////////////////////////////////// Private ////////////////////////////////////////////

  private initPeriode(): void {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    this.periode = {
      start: date,
      end: new Date()
    };
  }

  private getData(): void {
    this.isLoading = true;
    this.locationFunctionService
      .findByDateRange('time', new Date(this.periode.start).getTime(), new Date(this.periode.end).getTime())
      .then(locations => {
        this.locations = locations.data.length > 0 ? this.util.sortInByDesc(locations.data, 'time') : [];
        this.isLoading = false;
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  private buildLayers(): void {
    const set = new Set(this.locations.map(location => location.provider));
    const overlays = {
      Polyline: this.polylineLayer(this.locations)
      //'Markers': this.markersLayer(this.locations)
    };
    const layerControl = Leaflet.control.layers(baseLayers, overlays).addTo(this.map);
    set.forEach(provider => {
      const locations = this.locations.filter(location => location.provider === provider);
      layerControl.addOverlay(this.markersLayer(locations), provider);
    });
  }

  private markersLayer(locations: GeoLocation[]): Leaflet.Layer {
    const markers: Leaflet.Marker[] = locations.map((location, index) => {
      const marker = this.generateMarker(location, locations.length === index + 1 ? mobileMarkerOptions : dotMarkerOptions);
      marker.bindPopup(
        `<b>${this.getDisplayDate(location)}</b> <br /> ${location.address} <br /> ${location.lat},  ${location.lng}`
      );
      this.setFocus(location);
      return marker;
    });
    return Leaflet.layerGroup(markers).addTo(this.map);
  }

  private polylineLayer(locations: GeoLocation[]): Leaflet.Layer {
    const polyline: Leaflet.Polyline = this.generatePolyline(locations).addTo(this.map);
    //this.map.fitBounds(polyline.getBounds());
    return polyline;
  }

  private generateMarker(location: GeoLocation, markerOptions: Leaflet.MarkerOptions): Leaflet.Marker {
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
