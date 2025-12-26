import { Component, inject, OnInit } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { UtilService } from '@shared/services/util.service';
import {
  baseLayers,
  dotMarkerOptions,
  mapOptions,
  mobileMarkerOptions,
  TrackingLocation
} from 'app/location/models/locations.constant';
import { LocationService } from 'app/location/services/location.firestore.service';
import * as Leaflet from 'leaflet';
import { BehaviorSubject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public options: Leaflet.MapOptions = mapOptions;
  public isLoading = false;
  public count: number = 50;
  public count$ = new BehaviorSubject<number>(this.count);

  private locations: TrackingLocation[] = [];
  private map!: Leaflet.Map;
  private destroy$ = inject(DestroyService);
  private firestoreService = inject(LocationService);
  private util = inject(UtilService);
  private userLayers = new Map<
    string,
    {
      group: L.LayerGroup;
      polyline: L.Polyline;
      markers: L.Marker[];
    }
  >();
  private layerControl!: L.Control.Layers;
  private mapReady = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.count$
      .pipe(
        switchMap(count => this.firestoreService.getLast(count)),
        takeUntil(this.destroy$)
      )
      .subscribe(locations => {
        this.locations = locations.length > 0 ? this.util.sortInByAsc(locations, 'time') : [];
        this.isLoading = false;
        if (this.mapReady) {
          this.buildLayers();
        }
      });
  }

  //////////////////////////////////////////// Events ////////////////////////////////////////////

  public onMapClicked($event: any): void {
    const position = new Leaflet.LatLng($event.latlng.lat, $event.latlng.lng);
    new Leaflet.Popup().setLatLng(position).setContent(`${position}`).addTo(this.map);
  }

  public onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.layerControl = Leaflet.control.layers(baseLayers).addTo(this.map);
    this.mapReady = true;
    if (this.locations.length > 0) {
      this.buildLayers();
    }
  }

  //////////////////////////////////////////// Private ////////////////////////////////////////////

  private buildLayers(): void {
    const locationsByUser = new Map<string, TrackingLocation[]>();

    for (const loc of this.locations) {
      if (!locationsByUser.has(loc.user)) {
        locationsByUser.set(loc.user, []);
      }
      locationsByUser.get(loc.user)!.push(loc);
    }

    locationsByUser.forEach((locations, user) => {
      this.buildUserLayer(user, locations);
    });
  }

  private buildUserLayer(user: string, locations: TrackingLocation[]): void {
    const layer = this.getOrCreateUserLayer(user);

    layer.group.clearLayers();
    layer.markers = [];
    layer.polyline = undefined as any;

    const latLngs = locations.map(l => [l.lat, l.lng] as Leaflet.LatLngTuple);

    if (latLngs.length > 1) {
      layer.polyline = Leaflet.polyline(latLngs).addTo(layer.group);
    }

    locations.forEach((loc, index) => {
      const isLast = index === locations.length - 1;

      const marker = Leaflet.marker([loc.lat, loc.lng], isLast ? mobileMarkerOptions : dotMarkerOptions);

      marker.bindPopup(this.buildPopup(loc));
      marker.addTo(layer.group);

      if (isLast) {
        this.map.panTo([loc.lat, loc.lng]);
      }

      layer.markers.push(marker);
    });
  }

  private buildPopup(location: TrackingLocation): string {
    const formattedDate = new Date(location.time).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    return `<b>${formattedDate}</b><br/>${location.address}<br/>${location.lat}, ${location.lng}`;
  }

  private getOrCreateUserLayer(user: string) {
    if (!this.userLayers.has(user)) {
      const group = Leaflet.layerGroup().addTo(this.map);
      this.layerControl.addOverlay(group, user);

      this.userLayers.set(user, {
        group,
        polyline: undefined as any,
        markers: []
      });
    }

    return this.userLayers.get(user)!;
  }
}
