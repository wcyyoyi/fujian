import { Component, OnInit, ViewChild } from '@angular/core';
import { Todo } from './todo';
import { YzNgxMap } from 'yz-ngx-base/src';
import { ProdService } from '../services/product.service';
import { WordService } from '../services/word.service';
import { AreaService } from '../services/area.service';
import { Utils } from 'app/pages/utils/utils';
import { BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html',
  providers: [ProdService]
})
export class Dashboard implements OnInit {
  alertClassLevel: string = 'right-alert-level1';
  aboutClassLevel: string = 'right-about-level1';

  selYear: number = 2014;
  private dataElementCode: string;
  private dataType: string;
  private makeCompany: string;
  private mapbox: YzNgxMap;
  private mapUrl: string;
  mapIndex = 0;
  private center: Array<number>;
  private zoom: number;
  private IfGetData: boolean = false;
  private mapLoad: boolean = false;
  @ViewChild('todo') todo: Todo;
  private utils = new Utils();
  constructor(private areaService: AreaService, private wordService: WordService,
    private modalService: BsModalService) {
  }

  onYearChange(event) {
    this.selYear = event;
    this.todo.selYear = this.selYear;
    this.todo.changeYear();
  }
  mapload(e) {
    this.mapbox = e.target;
    this.mapbox.map['_controlPositions']['bottom-right'].innerHTML = '';
    this.loadImages();
    this.mapLoad = true;
  }
  ngOnInit(): void {
    let configArr = JSON.parse(localStorage.getItem('activeUser'))["models"][0]["maps"];
    let config: Map<string, string> = new Map<string, string>();
    configArr.forEach(map => {
      config.set(map.key, map.value);
    });
    let setting = JSON.parse(config.get('attention'));
    this.dataElementCode = setting["dataElementCode"];
    this.dataType = setting["dataType"];
    this.makeCompany = this.wordService.makeCompany;
    this.getAttentionDetail();
    this.alertClassLevel = 'right-alert-level' + this.wordService.level;
    this.aboutClassLevel = 'right-about-level' + this.wordService.level;
    this.mapUrl = this.wordService.getMapUrl + '/styles/outdoors/style.json';
    if (this.wordService.level == 1) {
      this.center = [119.3031, 26.0768];
      this.zoom = 6.3;
      this.IfGetData = true;
      return;
    } else {
      this.flyToCenter();
    }
  }

  getYears() {
    let now = new Date();
    let arr = new Array();
    for (let i = now.getFullYear(); i >= 2010; i--) {
      arr.push(i);
    }
    return arr;
  }

  getAttentionDetail() {
    let tendProd = document.getElementById("tendProd");
    this.wordService.getAttention(this.dataElementCode, this.dataType, this.makeCompany).toPromise().then(data => {
      if (!data) return;
      // tendProd.innerHTML =data.replace(/&lt;br&gt;/g,"<br>");
      let arr = data.split("&lt;br&gt;");
      let htmlString = ``;
      arr.forEach(list => {
        htmlString += list == arr[0] ? `<p>` + list + `</p>` : `<p>` + list + `</p>`;
      })
      tendProd.innerHTML = htmlString;
    }).catch(e => {
      tendProd.innerHTML = '当前没有关注内容';
    })
  }

  refresh(e) {
    this.mapIndex = e.target.value;
    let mapString=JSON.parse(localStorage.getItem("activeUser"))["area"]["mapUrl"];
    let pattern= /http:\/\/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}:[0-9]{0,4}/g;
    mapString=mapString.replace(pattern,this.wordService.getMapUrl);
    this.mapUrl =mapString.split(",")[this.mapIndex];
    this.mapbox.mapUrl = this.mapUrl;
    this.mapbox.ngAfterViewInit();
   
  }
  flyToCenter() {
    return this.areaService.getByFilter(parseInt(this.areaService.areaCode), this.areaService.level).then(data => {
      let level = this.areaService.level;
      let lng = level == 0 ? 108 : data[0]["v06001"];
      let lat = level == 0 ? 34 : data[0]["v05001"];
      let clientHeight = document.body.clientHeight;
      this.zoom = (clientHeight <= 750 ? 7.5 : 8) + level - 2;
      this.center = [lng, lat];
      this.IfGetData = true;
    })
  }

  loadImages() {
    let E001List = new Array();
    E001List = JSON.parse(localStorage.getItem("E001"));
    let cropArr = new Array();
    cropArr = JSON.parse(localStorage.getItem("newCropArr"))
    E001List.forEach(e001 => {
      let pin = this.utils.toPinyin(e001.cCropname);
      if (cropArr && cropArr.includes(e001.cCropname)) {
        if (pin.match(/undefined/ig)) return;
        this.addImg(pin, '../../../assets/img/crop/tongyong1.png');
      } else {
        if (pin.match(/undefined/ig)) return;
        this.addImg(pin, '../../../assets/img/crop/' + pin + '1.png');
      }
    })
  }
  addImg(name, url) {
    let _map = this.mapbox.map;
    this.mapbox.map.loadImage(url, function (error, image) {
      if (error) throw error;
      if (_map.hasImage(name)) {
        _map.removeImage(name);
      }
      _map.addImage(name, image);
    });
  }
}
