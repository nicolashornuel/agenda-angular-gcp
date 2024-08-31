import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { icon, marker, tileLayer } from 'leaflet';

export interface GeoLocation {
  id: string;
  address: string;
  date: Date;
  lat: number;
  lng: number;
  time: number;
  user: string;
  provider: string;
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

const iconOption: Leaflet.BaseIconOptions = {
  iconRetinaUrl: '/assets/icons/mobile.png',
  iconUrl: '/assets/icons/mobile.png',
  shadowUrl: '/assets/marker-shadow.png'
};

Leaflet.Icon.Default.mergeOptions(iconOption);

export const markerOptions: Leaflet.MarkerOptions = { draggable: false };

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
  'geoportail': geoportail,
  'Wikimedia Maps': wikiMaps
};
