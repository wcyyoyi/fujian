import { Component, Input, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BaThemeConfigProvider } from '../../../theme';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { TodoService } from './todo.service';
import 'style-loader!./todo.scss';
import { StationService } from '../../services';
import { LegendControl, LayersControl } from 'yz-ngx-base/src';
import { Legend } from 'yz-ngx-base/src/yz-ngx-map/components/legend';
import { AreaService } from '../../services/area.service';
import { ApiService } from '../../services/api.service';
import { CropStatService } from '../../services/cropstat.service';
import { YzNgxMap } from 'yz-ngx-base/src';
import { E001 } from 'app/pages/utils/models/e001';
import { LayerEventData } from 'yz-ngx-base/src/yz-ngx-map/yz-ngx-map.component';
import { SurfDetailComponent } from '../surf-detail/surf-detail.component';
import { stringify } from '@angular/core/src/util';
@Component({
  selector: 'todo',
  templateUrl: './todo.html',

})
export class Todo implements AfterViewInit {
  btnClassLevel: string = 'select-btn-level1';
  aClassLevel: string = 'select-a-level1';

  public dashboardColors = this._baConfig.get().colors.dashboard;

  public selectedItem: any;
  public selectAllCrop: boolean = false;
  public legendShow: boolean = false;
  public statCodeArr: Array<number>;
  selYear: number = 2014;

  public userLevel: number;
  @Input() map: YzNgxMap;
  private yieldResId = 'areaPoints';
  private newTodoList = new Array();
  private activeLayer: any = 'stdPoints';
  public legend: Legend;
  constructor(private _baConfig: BaThemeConfigProvider, private _todoService: TodoService,
    private cropstatService: CropStatService, private staService: StationService, private apiService: ApiService,
    private yzNgxToastyService: YzNgxToastyService, private modalService: BsModalService) {
  }
  ngAfterViewInit() {
    this.btnClassLevel = 'select-btn-level' + this.apiService.level;
    this.aClassLevel = 'select-a-level' + this.apiService.level;
  }
  ngOnChanges() {
    this.userLevel = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
    if (!this.map) return;
    this.getTodoList();
  }
  getTodoList() {
    this._todoService.initGeoJson();
    this.addMapLine();
    this.getLeastCrop();

    // 产量分布控件
    let layerCtrl = new LayersControl([this.yieldResId]);
    // 图例控件
    layerCtrl.selectedLayer.subscribe((lyrId) => {
      if (lyrId == null) {
        document.getElementsByClassName("legend")[0].className = "hidden legend";
        document.getElementById('yearSelect').style.display = 'none';
        if (this.map.getLayer(this.activeLayer)) {
          this.map.setVisibility(this.activeLayer, false);
        }
      } else {
        document.getElementById('yearSelect').style.display = 'block';
        this.legendShow = true;
        document.getElementsByClassName("legend")[0].className = "show legend";
        if (this.map.getLayer(lyrId)) {
          this.map.setVisibility(lyrId, true);
        }
        else {
          let err = this.selectedItem == undefined ? "该区域" : "【" + this.selectedItem.text + "】作物";
          this.yzNgxToastyService.warning("提示", err + this.selYear + "年无产量信息", 3000);
        }
      }
      this.activeLayer = lyrId;
    });

    this.map.addControl(layerCtrl);
  }
  addMapLine() {
    let geoArr = this._todoService.getJeoArr();
    let geo = {
      "type": "geojson",
      "data": geoArr[0]
    }
    this.addLayer(geoArr[0]["properties"]["CNAME"], 'line', geo);
  }
  addSource(id: string) {
    this.map.addSource(id, {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    });
  }

  addLayer(id: string, lyrType: any, sid: any) {
    if (lyrType == 'line') {
      this.map.addLayer({
        'id': id,
        'source': sid,
        'type': lyrType,
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "black",
          "line-width": 2
        }
      }, "fjcity");
      return;
    }
    this.map.addLayer({
      'id': id,
      'source': sid,
      'type': lyrType,
    }, "fjcity");
  }
  private _getRandomColor() {
    let colors = Object.keys(this.dashboardColors).map(key => this.dashboardColors[key]);

    var i = Math.floor(Math.random() * (colors.length - 1));
    return colors[i];
  }
  //获取经过过滤的todolist
  getLeastCrop() {
    let cropList = new Array();
    this.newTodoList = new Array();
    this.yzNgxToastyService.wait("正在查询区域作物", "");
    this.staService.getIdsByArea(parseInt(this.apiService.areaCode), this.apiService.level).then(statIds => {
      this.yzNgxToastyService.close();
      if (!statIds) return;
      this.statCodeArr = statIds;
      this.cropstatService.getAll().toPromise().then(crops => {
        if (!crops) {
          this.yzNgxToastyService.error("该区域没有作物", "");
          return;
        }
        crops.forEach(crop => {
          if (statIds.includes(crop.v01000) && !cropList.includes(crop.cCropname)) {
            cropList.push(crop.cCropname);
          }
        });
        this._todoService.getTodoList().forEach(todo => {
          for (let index = 0; index < todo.crops.length; index++) {
            if (cropList.includes(todo.crops[index].cCropname)) {
              this.newTodoList.push(todo);
              break;
            }
          }
        })

        this.newTodoList.forEach((item) => {
          item.color = this._getRandomColor();
          if (this.apiService.level == 1) {
            item.isSelected = item["text"] == '茶叶' ? true : false;
          } else {
            item.isSelected = item == this.newTodoList[0] ? true : false;
          }
        });
        let selItem = this.newTodoList.find(item => item.isSelected);
        this.onSelectedItemChange(selItem, false);
        this.initCropMapSource(selItem);
      }).catch(() => {
        this.yzNgxToastyService.error("该区域没有作物", "");
      })
    })
  }
  initCropMapSource(item) {
    if (item.isSelected) {
      if (this.map.getSource(item.name) == undefined) {
        this.addSource(item.name);

        this.yzNgxToastyService.wait("正在查询【" + item.text + "】作物站点", "");
        this._todoService.getStationPoints(item).then(stat => {
          let newStat = new Array();
          stat.forEach(item => {
            if (this.statCodeArr.includes(item["properties"]["站号"])) {
              newStat.push(item)
            }
          });
          this.map.getSource(item.name).setData({
            type: "FeatureCollection",
            features: newStat
          });
          this.yzNgxToastyService.closeAll();
        });
      }
      if (!this.map.getLayer(item.name)) {
        this.addLayer(item.name, 'symbol', item.name);
        // this.map.showPopup(item.name);

        this.map.onLayerClick(item.name, (layerEventData: LayerEventData) => {
          let surfDetailCom = this.modalService.show(SurfDetailComponent, { class: 'modal-lg detail-modal' });
          surfDetailCom.content.init(layerEventData.features[0].properties.站号, layerEventData.features[0].properties.站名);
        });

        this.map.setLayoutProperty(item.name, "icon-image", item.name);
      }
    }
    if (this.map.getLayer(item.name)) {
      this.map.setVisibility(item.name, item.isSelected);

    }
  }


  selCrop(item) {
    item.isSelected = !item.isSelected;
    this.initCropMapSource(item);
  }

  showYield(item: any) {
    this.loadYield(this.yieldResId, item)
  }

  private loadYield(id: string, item: any) {
    let yieldSource = this.map.getSource(id);
    let showLayer = this.map.getLayer(id);
    if (!yieldSource || !showLayer) return;
    this._todoService.getProvYieldPolygon(this.selYear, item.text).then(areaData => {
      if (!areaData) {
        this.map.removeLayer(this.yieldResId);
        this.map.removeSource(this.yieldResId);
        if (this.activeLayer == id)
          this.yzNgxToastyService.warning("提示", "【" + this.selectedItem.text + "】作物" + this.selYear + "年无产量信息", 2000);
        return;
      }
      yieldSource.setData(areaData);
      let filterPro = "产量";
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
      let minValue = Math.floor(areaData.features[0]['properties'][filterPro]);
      let maxValue = 0;
      for (let i = areaData.features.length - 1; i >= 0; i--) {
        let t = Math.floor(areaData.features[i]['properties'][filterPro]);
        if (t && t > 0) {
          maxValue = t;
          break;
        }
      }
      let midValue = Math.floor((maxValue + minValue) / 2);

      let stops = [
        [minValue, "#51bbd6"],
        [midValue, "#f1f075"],
        [maxValue, "#f28cb1"]
      ];

      let items = new Map<string, string>();
      for (let i = 0; i < stops.length; i++) {
        if (stops[i] == stops[stops.length - 1]) {
          items.set("大于" + String(stops[i][0]), String(stops[i][1]));
        } else {
          items.set(String(stops[i][0] + "~" + stops[i + 1][0]), String(stops[i][1]));
        }
      }
      this.legend = new Legend();
      this.legend.items = items;
      this.map.addLegendControl(this.legend, "bottom-left");
      if (this.legendShow) {
        document.getElementsByClassName("legend")[0].className = "show legend";
      } else {
        document.getElementsByClassName("legend")[0].className = "hidden legend";
      }
      this.map.setFilter(id, ["has", filterPro]);
      this.map.setPaintProperty(id, "fill-color", {
        "property": filterPro,
        "stops": stops
      });
      this.map.setPaintProperty(id, "fill-opacity", 0.8);
      if (this.activeLayer == id) {
        this.map.setVisibility(id, true);
      }
      else {
        this.map.setVisibility(id, false);
      }
    });
  }
  onSelectedItemChange(item, isYearChange: boolean) {
    if (this.selectedItem == item && !isYearChange) return;
    this.selectedItem = item;
    if (!this.map.getSource(this.yieldResId)) {
      this.addSource(this.yieldResId);
    }

    if (!this.map.getLayer(this.yieldResId)) {
      this.addLayer(this.yieldResId, 'fill', this.yieldResId);
      // 产量分布图层
      this.map.showPopup(this.yieldResId);
    }
    this.showYield(item);
  }

  selectAll(value) {
    this.selectAllCrop = !this.selectAllCrop;
    this.newTodoList.forEach(element => {
      element.isSelected = value;
      this.initCropMapSource(element);
    });
  }

  changeYear() {
    this.onSelectedItemChange(this.selectedItem, true);
  }

}
