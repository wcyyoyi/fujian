import { Component, Input, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BaThemeConfigProvider } from '../../../theme';

import { TodoService } from './todo.service';
import { LayersControl } from '../../maps/components/mapboxMaps'
import { MarkerViewer } from './markerViewer.component'

import 'style-loader!./todo.scss';

@Component({
  selector: 'todo',
  templateUrl: './todo.html'
})
export class Todo implements AfterViewInit {

  public dashboardColors = this._baConfig.get().colors.dashboard;

  public todoList: Array<any>;
  public newTodoText: string = '';
  public selectedItem: any;

  private _map: any;
  @Input()
  set map(map: any) {
    this._map = map;
  }
  get map(): any {
    return this._map;
  }

  private stdResId = 'stdPoints';
  private yieldResId = 'areaPoints';

  private activeLayer: any = 'stdPoints';
  //private symbolExt = 'Syb';

  constructor(private _baConfig: BaThemeConfigProvider, private _todoService: TodoService,
    private modalService: BsModalService) {
    this.todoList = this._todoService.getTodoList();

    this.selectedItem = this.todoList[0];
    this.todoList.forEach((item) => {
      item.color = this._getRandomColor();
    });
  }

  ngAfterViewInit() {
    this._map.onMapLoad.subscribe(event => {
      // 站点分布图层
      this.addSource(this.stdResId);
      this.addLayer(this.stdResId, 'symbol', this.stdResId);

      // 产量分布图层
      this.addSource(this.yieldResId);
      this.addLayer(this.yieldResId, 'fill', this.yieldResId);
      //this.addLayer(this.yieldResId + this.symbolExt, 'symbol', this.yieldResId);
      this.map.showPopup(this.yieldResId);

      this.onChanged(this.selectedItem, null);

      let imgUrl = 'assets/img/crop.jpg';
      this.map.addMarkers(119.3031, 26.0768, imgUrl, (e) => {
        let modalRef = this.modalService.show(MarkerViewer, { class: 'modal-lg' });
        modalRef.content.src = imgUrl;
        modalRef.content.num = 1;
        modalRef.content.title = '实景观测';
      });

      // Layer control add after map loaded
      let layerCtrl = new LayersControl([this.stdResId, this.yieldResId]);
      layerCtrl.selectedLayer.subscribe((lyrId) => {
        if (this._map.getLayer(this.activeLayer))
          this._map.setVisibility(this.activeLayer, false);

        // Symbol layer
        // if (this._map.getLayer(this.activeLayer + this.symbolExt))
        //   this._map.setVisibility(this.activeLayer + this.symbolExt, false);

        if (this._map.getLayer(lyrId))
          this._map.setVisibility(lyrId, true);

        // Symbol layer
        // if (this._map.getLayer(lyrId + this.symbolExt))
        //   this._map.setVisibility(lyrId + this.symbolExt, true);

        this.activeLayer = lyrId;
      });

      this._map.addControl(layerCtrl);
    });
  }

  addSource(id: string) {
    this._map.addSource(id, {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    });
  }

  addLayer(id: string, lyrType: string, sid: string) {
    this._map.addLayer({
      id: id,
      type: lyrType,
      source: sid
    });
  }

  getNotDeleted() {
    return this.todoList.filter((item: any) => {
      item.isChecked = false;
      return !item.deleted;
    })
  }

  private _getRandomColor() {
    let colors = Object.keys(this.dashboardColors).map(key => this.dashboardColors[key]);

    var i = Math.floor(Math.random() * (colors.length - 1));
    return colors[i];
  }

  onChanged(item: any, e: any): void {
    console.log(888888)
    this.selectedItem = item;

    this.loadStation(this.stdResId, this.selectedItem);
    this.loadYield(this.yieldResId, this.selectedItem);
  }

  private loadStation(id: string, item: any) {
    let stdSource = this._map.getSource(id);
    let showLayer = this._map.getLayer(id);

    if (!stdSource || !showLayer) return;

    this._todoService.getStationPoints(item.text).then(ps => {
      if (!ps) ps = [];

      stdSource.setData({
        type: "FeatureCollection",
        features: ps
      });

      this._map.setLayoutProperty(id, "icon-image", item.name);

      // Default view
      if (this.activeLayer == id)
        this._map.setVisibility(id, true);
      else
        this._map.setVisibility(id, false);
    });
  }

  private loadYield(id: string, item: any) {
    let yieldSource = this._map.getSource(id);
    let showLayer = this._map.getLayer(id);

    if (!yieldSource || !showLayer) return;

    this._todoService.getProvYieldPolygon(item.text).then(areaData => {
      if (!areaData) areaData = {};

      yieldSource.setData(areaData);

      let filterPro = "面积";

      // 排序
      areaData.features.sort((val1, val2) => {
        let proVal1 = val1['properties'][filterPro];
        let proVal2 = val2['properties'][filterPro];

        if (proVal1 < proVal2) {
          return -1;
        } else if (proVal1 > proVal2) {
          return 1;
        } else {
          return 0;
        }
      });

      // 渲染值范围
      let minValue = areaData.features[0]['properties'][filterPro];
      let maxValue = areaData.features[areaData.features.length - 1]['properties'][filterPro];
      let midValue = (maxValue - minValue) / 2;

      this._map.setFilter(id, ["has", filterPro]);
      this._map.setPaintProperty(id, "fill-color", {
        "property": filterPro,
        "stops": [
          [minValue, "#51bbd6"],
          [midValue, "#f1f075"],
          [maxValue, "#f28cb1"]
        ]
      });
      this._map.setPaintProperty(id, "fill-opacity", 0.8);
      if (this.activeLayer == id) {
        this._map.setVisibility(id, true);
      }
      else {
        this._map.setVisibility(id, false);
      }
    });
  }
}
