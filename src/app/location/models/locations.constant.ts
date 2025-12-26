import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import * as Leaflet from 'leaflet';
import { tileLayer } from 'leaflet';

export interface TrackingLocation extends Identifiable {
  address: string;
  date: Date;
  lat: number;
  lng: number;
  time: number;
  user: string;
  provider: string;
}

export class TrackingLocation {
  public static readonly ADDRESS = { key: 'address', name: 'Adresse' };
  public static readonly DATE = { key: 'date', name: 'Date Sauvegarde' };
  public static readonly LAT = { key: 'lat', name: 'Latitude' };
  public static readonly LNG = { key: 'lng', name: 'Longitude' };
  public static readonly TIME = { key: 'time', name: 'Date Position' };
  public static readonly USER = { key: 'user', name: 'Utilisateur' };
  public static readonly PROVIDER = { key: 'provider', name: 'Fournisseur' };
}

// Define our base layers so we can reference them multiple times
const streetMaps: Leaflet.Layer = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  detectRetina: true,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const streetMapsHot: Leaflet.Layer = tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  detectRetina: true,
  attribution:
    '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});
const geoportail: Leaflet.Layer = tileLayer(
  'https://data.geopf.fr/wmts?' +
    '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0' +
    '&STYLE=normal' +
    '&TILEMATRIXSET=PM' +
    '&FORMAT=image/jpeg' +
    '&LAYER=ORTHOIMAGERY.ORTHOPHOTOS' +
    '&TILEMATRIX={z}' +
    '&TILEROW={y}' +
    '&TILECOL={x}',
  {
    detectRetina: true,
    attribution: '© Geoportal'
  }
);

const topoMap: Leaflet.Layer = tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  detectRetina: true,
  attribution:
    '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

const wikiMaps: Leaflet.Layer = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  detectRetina: true,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const mobileIcon = Leaflet.icon({
  iconUrl: '/assets/icons/mobile.png',
  iconAnchor: [10, 30]
});

const dotIcon = Leaflet.divIcon({
  className: 'far fa-circle white',
  iconAnchor: [6, 6]
});

export const mobileMarkerOptions: Leaflet.MarkerOptions = { draggable: false, icon: mobileIcon };

export const dotMarkerOptions: Leaflet.MarkerOptions = { draggable: false, icon: dotIcon };

export const polylineOptions: Leaflet.PolylineOptions = {
  color: 'green',
  weight: 3,
  opacity: 0.5
};

export const mapOptions: Leaflet.MapOptions = {
  layers: [streetMaps],
  zoom: 17,
  maxZoom: 18,
  //maxNativeZoom: 18,
  center: { lat: 43.7216, lng: 4.0253 }
};

export const baseLayers: { [name: string]: Leaflet.Layer } = {
  'Street Maps': streetMaps,
  'Street Maps Hot': streetMapsHot,
  'topo Maps': topoMap,
  geoportail: geoportail,
  'Wikimedia Maps': wikiMaps
};
