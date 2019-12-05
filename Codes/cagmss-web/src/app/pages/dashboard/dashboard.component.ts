import { Component, OnInit } from '@angular/core';
// import { mapboxgl } from 'mapbox-gl/dist/mapbox-gl.js';
// import 'mapbox-gl/dist/mapbox-gl.js';
// import * as mapboxgl from 'mapbox-gl';
// import 'style-loader!mapbox-gl/dist/mapbox-gl.css';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  map: any;

  constructor() {
  }

  ngOnInit(): void {
    // this.map = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'http://192.168.99.100:8081/styles/FJStyle.json',
    //   center: [117.8613, 25.79],
    //   zoom: 6
    // });

    // this.map.addControl(new mapboxgl.NavigationControl());

    // map.on('load', function () {
    //   map.addLayer({
    //     "id": "fj_country",
    //     "type": "fill",
    //     "source": {
    //       type: 'vector',
    //       url: 'http://192.168.99.100:8080/data/fjall.json'
    //     },
    //     "source-layer": "fjall",
    //     "filter": ["all", ["==", "region", 1]],
    //     "paint": {
    //       "fill-color": "hsl(47, 26%, 88%)",
    //       "fill-outline-color": "rgba(255, 255, 255, 1)",
    //       "fill-opacity": 1,
    //       "fill-antialias": true
    //     }
    //   });

    //   map.addLayer({
    //     "id": "fj_city",
    //     "type": "fill",
    //     "source": "fj_country",
    //     "source-layer": "fjall",
    //     "filter": ["all", ["==", "region", 0]],
    //     "paint": {
    //       "fill-color": "rgba(232, 150, 150, 0)",
    //       "fill-outline-color": "rgba(165, 158, 158, 1)",
    //       "fill-opacity": 1,
    //       "fill-antialias": true
    //     }
    //   });

    //   map.addLayer({
    //     "id": "fj_lable",
    //     "type": "symbol",
    //     "source": "fj_country",
    //     "source-layer": "fjall",
    //     "filter": ["all", ["==", "$type", "Point"]],
    //     "paint": {
    //       "text-color": "hsl(0, 0%, 13%)",
    //       "text-halo-color": "rgba(255,255,255,0.75)",
    //       "text-halo-width": 2
    //     },
    //     "layout": {
    //       "text-field": "{NAME}",
    //       "text-font": [
    //         // "KlokanTech Noto Sans Bold",
    //         // "KlokanTech Noto Sans CJK Bold"
    //         // "Open Sans Italic",
    //         // "Open Sans Bold"
    //         // "Klokantech Noto Sans Bold",
    //         "Klokantech Noto Sans Bold"
    //       ],
    //       "text-size": {
    //         "stops": [[3, 12], [8, 22]]
    //       }
    //     }
    //     // "layout": {
    //     //   "text-size": 15,
    //     //   "icon-image": "circle-11",
    //     //   "text-font": [
    //     //     "SimHei Regular"
    //     //   ],
    //     //   "symbol-placement": "point",
    //     //   "text-offset": [0, 0.7],
    //     //   "text-anchor": "top",
    //     //   "text-field": "{NAME}",
    //     //   "text-letter-spacing": 0.02,
    //     //   "text-max-width": 8
    //     // },
    //   });
    // });
  }

  onSelectLayer(): void {
    // this.map.setLayoutProperty('county', 'visibility', 'none');

    // let selLayer = this.map.getLayer('county');
    // var visibility = this.map.getLayoutProperty('county', 'visibility');

    // if (visibility === 'visible') {
    //   this.map.setLayoutProperty('county', 'visibility', 'none');
    //   //this.className = '';
    // } else {
    //   //this.className = 'active';
    //   this.map.setLayoutProperty('county', 'visibility', 'visible');
    // }
  }

}
