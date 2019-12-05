import { Component, AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { ApiService } from '../../../services/api.service'

import * as mapboxgl from 'mapbox-gl';
import 'style-loader!./mapboxMaps.scss';

@Component({
    selector: 'mapbox-maps',
    templateUrl: 'mapboxMaps.html'
})

export class MapboxMaps implements AfterViewInit {
    map: any;
    onMapLoad: EventEmitter<any> = new EventEmitter();
    //onLayerChanged: EventEmitter<any> = new EventEmitter();

    constructor(private _elementRef: ElementRef, private apiServ: ApiService) { }

    ngAfterViewInit() {
        let el = this._elementRef.nativeElement.querySelector('.mapbox-maps');
        let mapUrl = this.apiServ.map_url;

        this.map = new mapboxgl.Map({
            container: el,
            style: mapUrl,
            center: [117.8613, 25.79],
            zoom: 6
        });

        this.map.addControl(new mapboxgl.NavigationControl());

        this.map.on('load', () => {
            this.onMapLoad.emit(null);
        });
    }

    addMarkers(lon: number, lat: number, imgUrl: string, func: any) {
        // create a DOM element for the marker
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(' + imgUrl + ')';
        el.style.width = '32px';
        el.style.height = '32px';

        el.addEventListener('click', (e) => func(e));

        // add marker to map
        let newMarker = new mapboxgl.Marker(el)
            .setLngLat([lon, lat])
            .addTo(this.map);

        return newMarker;
    }

    addControl(ctrl: any) {
        this.map.addControl(ctrl);
    }

    addSource(id: string, sourceInfo: Object): void {
        this.map.addSource(id, sourceInfo);
    }

    getSource(id: string): void {
        return this.map.getSource(id);
    }

    removeSource(id: string): void {
        this.map.removeSource(id);
    }

    addLayer(layerInfo: Object): void {
        this.map.addLayer(layerInfo);
    }

    getLayer(id: string): void {
        return this.map.getLayer(id);
    }

    removeLayer(id: string): void {
        this.map.removeLayer(id);
    }

    setVisibility(layerId: string, isVisibility: boolean): void {
        if (isVisibility) {
            this.map.setLayoutProperty(layerId, 'visibility', 'visible');
        } else {
            this.map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    }

    setLayoutProperty(layerId: string, name: string, value: any) {
        this.map.setLayoutProperty(layerId, name, value);
    }

    // 'my-layer', ['==', 'name', 'USA']
    setFilter(layerId: string, value: any) {
        this.map.setFilter(layerId, value);
    }

    // 'my-layer', 'fill-color', '#faafee'
    setPaintProperty(layerId: string, name: string, value: any) {
        this.map.setPaintProperty(layerId, name, value);
    }

    getVisibility(layerId: string): boolean {
        console.log(this.map.getLayoutProperty);
        let propValue = this.map.getLayoutProperty('fjcity', 'visibility');
        console.log(propValue);

        if (propValue === 'visible') {
            return true;
        } else {
            return false;
        }
    }

    showPopup(layerId: string): void {
        let _map = this.map;
        // When a click event occurs on a feature in the states layer, open a popup at the
        // location of the click, with description HTML from its properties.
        this.map.on('click', layerId, function (e) {
            let props = e.features[0].properties;
            if (!props) return;

            let propsHTML = `<table class="table table-striped">
                                <thead><tr><th>属性名</th><th>值</th></tr></thead><tbody>`;
            for (var prop in props) {
                if (typeof (props[prop]) != "function") {
                    propsHTML += '<tr><td>' + prop + '</td>';
                    propsHTML += '<td>' + props[prop] + '</td></tr>';
                }
            }
            propsHTML += '</tbody></table>';

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(propsHTML)
                .addTo(_map);
        });

        // Change the cursor to a pointer when the mouse is over the states layer.
        this.map.on('mouseenter', layerId, function () {
            _map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        this.map.on('mouseleave', layerId, function () {
            _map.getCanvas().style.cursor = '';
        });
    }
}