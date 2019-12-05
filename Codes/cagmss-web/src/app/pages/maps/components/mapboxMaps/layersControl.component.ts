import { EventEmitter } from '@angular/core';

export class LayersControl {
    private _map: any;
    private _container: any;
    private activeButton = null;
    private buttonElements = {};
    private layerIds = [];

    public selectedLayer: EventEmitter<any> = new EventEmitter();

    constructor(layerIds = []) {
        this.layerIds = layerIds;
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

        //this._container.textContent = 'Hello, world';
        let count = 0;
        this.layerIds.forEach(lyrId => {
            if (count == 0) {
                this.buttonElements[lyrId] = this.createControlButton(lyrId, {
                    className: `mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_stat`,
                    title: `layers`
                });
            }
            else {
                this.buttonElements[lyrId] = this.createControlButton(lyrId, {
                    className: `mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_yield`,
                    title: `layers`
                });
            }

            count++;
        });

        // default
        this.activeButton = this.buttonElements[this.layerIds[0]];
        this.selectedLayer.emit(this.layerIds[0]);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    createControlButton(id, options: any = {}) {
        let button = document.createElement('button');
        button.className = options.className;
        button.setAttribute('title', options.title);
        this._container.appendChild(button);

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let clickedButton = e.target;
            if (clickedButton === this.activeButton) {
                this.deactivateButtons(id);
                return;
            }

            this.setActiveButton(id);
            //options.onActivate();
        }, true);

        return button;
    }

    deactivateButtons(id) {
        if (!this.activeButton) return;

        let button = this.buttonElements[id];
        if (button === this.activeButton) {
            //this.setVisibility(buttonId, false);
            this.activeButton = null;
            this.selectedLayer.emit(null);
        }
    }

    setActiveButton(id) {
        this.deactivateButtons(id);

        let button = this.buttonElements[id];
        if (!button) return;

        if (button) {
            this.activeButton = button;
            this.selectedLayer.emit(id);
            //this.setVisibility(id, true);
        }
    }

    setVisibility(layerId: string, isVisibility: boolean): void {
        if (isVisibility) {
            this._map.setLayoutProperty(layerId, 'visibility', 'visible');
        } else {
            this._map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    }
}