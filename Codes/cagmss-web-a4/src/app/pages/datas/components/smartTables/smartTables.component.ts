import { Injectable, Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, Routes } from '@angular/router';


import { DataState } from '../../datas.state';
import { LocalDataSource } from 'ng2-smart-table';


import 'style-loader!./smartTables.scss';
import { ExportService } from '../../../services/export.service';
import { BaMenuService } from '../../../../theme';
import { Station } from '../../../models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { StationService, CropDictService, ApiService } from '../../../services';
import { StationSettingsModal } from '../../../businessComponent/stationChoose/stationSettings.modal.component';
import { FieldSettingModalComponent } from '../../../businessComponent/fieldSetting/fieldSettings.modal.component';
import { DictionaryService } from '../../../utils/Dictionary.service';
import { BaGrid } from 'app/theme/components';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
  selector: 'smart-tables',
  templateUrl: './smartTables.html',
  //styleUrls: ['./smartTables.scss'],
  
})
export class SmartTables implements AfterViewInit {
  btnClassLevel: string = 'yz-btn-level1'

  fieldModalRef: BsModalRef;
  staModalRef: BsModalRef;

  tabName: string;
  query: string = '';
  v01000: string = "";
  vStart = new Date(new Date().toLocaleDateString());
  vEnd = new Date(new Date().toLocaleDateString());
  stationString: string = "";

  settings = new Array();
  source = new Array();

  service: any;

  selSettings: any;

  excelDataName;
  column;

  selStationInfo: string = '站点选择';

  fieldsChecked: Array<number>;//记录选择字段的下标

  statsChecked: Array<number> = [0, 1, 2, 3, 4, 7, 8, 9, 10];//记录选择站点的下标

  public hourShow: boolean;
  @ViewChild('grid') grid: BaGrid
  public level: number;
  constructor(private route: ActivatedRoute, private state: DataState,
    private menuServ: BaMenuService,
    private modalService: BsModalService,
    private dictionaryService: DictionaryService,
    private yzNgxToastyService: YzNgxToastyService,
    private exportSevice: ExportService,
    private apiService: ApiService, ) {

  }

  ngAfterViewInit() {
    this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
    this.btnClassLevel = 'yz-btn-level' + this.level;
    this.vStart.setMonth(this.vEnd.getMonth() - 1);
    this.route.params.subscribe((params: Params) => {
      this.tabName = params['name'];
      this.v01000 = '';
      this.hourShow = params['name'] == 'shour' || params['name'] == 'asmm' || params['name'] == 'mos' ? true : false;
      this.selSettings = this.state[this.tabName];
      this.source = new Array();
      this.service = this.selSettings.service;
      this.settings = this.selSettings.settings;
      //console.log(this.settings)
      this.grid.initFieldGrid(this.settings);
      // this.getFieldOption(this.selSettings.columns);
      this.menuServ.menuItems.subscribe(data => {
        data.forEach(item => {
          item.children.forEach(element => {
            if (element.route.path === 'view/' + this.tabName) {
              this.excelDataName = element.title;
              // this.titleInfo= element.title;
              return;
            }
          });
        });
      });
      this.initQuery();
    });
  }

  initQuery() {
    this.settings.forEach((setting, index) => {
      setting.hide = index >= 10;
    });
    if (this.tabName == 'cli') {
      this.onQuery();
      return;
    }
    let staList = this.dictionaryService.MANG_STAT;
    // 默认国家站（非区域站）
    let statsChecked = new Array<number>();
    staList.forEach((sta, index) => {
      if (sta.cTypestation === '国家站') {
        statsChecked.push(sta.v01000);
      }
    });
    this.statsChecked = statsChecked;
    this.v01000 = statsChecked.join(',');
    this.selStationInfo = '共选择' + statsChecked.length + '个站点';

    // 默认前十个字段
    // console.log(this.settings)
    this.onQuery();
  }
  onSelectedTimes(times): void {
    this.vStart = times.start;
    this.vEnd = times.end;
  }

  onCheckedStations(data) {
    this.statsChecked = data;
    this.v01000 = data.join(',');
    this.selStationInfo = '共选择' + data.length + '个站点';
  }

  onQuery(): void {
    this.vStart = this.tabName == 'shour' || this.tabName == 'asmm' || this.tabName == 'mos' ? this.vStart : new Date(this.vStart.setHours(0));
    this.vEnd = this.tabName == 'shour' || this.tabName == 'asmm' || this.tabName == 'mos' ? this.vEnd : new Date(this.vEnd.setHours(0));
    this.yzNgxToastyService.wait(this.excelDataName, "正在查询，请稍后…");
    this.service.getByFilter(this.v01000, this.vStart, this.vEnd).subscribe((data: Array<any>) => {
      this.source = data;
      this.yzNgxToastyService.close();
      if (this.tabName == 'shour' || this.tabName == 'asmm' || this.tabName == 'mos') {
        let dataArr = new Array();
        dataArr = data;
        dataArr.forEach(item => {
          let date = new Date(item["v04001"] + "/" + item["v04002"] + "/" + item["v04003"]).setHours(item["v04004"] + 8);
          let dateArr = new Date(date).toLocaleDateString().split("/");
          item["v04001"] = dateArr[0];
          item["v04002"] = dateArr[1];
          item["v04003"] = dateArr[2];
          item["v04004"] = new Date(date).getHours();
        })
        this.source = dataArr;
      }
    });
  }
  export() {
    if (this.source.length === 0) {
      this.yzNgxToastyService.warning('没有数据', "", 3000);
      return;
    }
    let fileName = this.excelDataName + this.vStart.toLocaleDateString() + '-' + this.vEnd.toLocaleDateString() + '统计结果';
    let data = new Array();
    let title;
    this.source.forEach(item => {
      let obj = new Object();
      this.settings.forEach(col => {
        title = col["headerName"];
        if (col["field"] == "v12001" || col["field"] == "v12052" || col["field"] == "v12053" || col["field"] == "v13004" || col["field"] == "v13201" || col["field"] == "v11002" || col["field"] == "v14032"
          || col["field"] == "v10004" || col["field"] == "v12003" || col["field"] == "v20010" || col["field"] == "v20051" || col["field"] == "v12240" || col["field"] == "v12213" ||
          col["field"] == "v12214" || col["field"] == "v13203" || col["field"] == "v13204" || col["field"] == "v20235" || col["field"] == "v13202") {
          obj[title] = this.multipleConv(item[col["field"]]);
        } else {
          obj[title] = item[col["field"]]
        }
      });
      data.push(obj);
    });
    this.exportSevice.exportAsExcelFile(data, fileName);
  }
  showStaModal() {
    this.modalService.config.ignoreBackdropClick = true;
    this.staModalRef = this.modalService.show(StationSettingsModal, { class: 'modal-lg statChoose' });
    this.staModalRef.content.checkedStatNum = this.statsChecked;
    this.staModalRef.content.stationArr.subscribe(this.onCheckedStations.bind(this));
  }
  // 正乘负除，默认除10
  multipleConv(value: number, multiple: number = -10) {
    if (multiple > 0) {
      return value * Math.abs(multiple);
    } else {
      return Number((value / Math.abs(multiple)).toFixed(2));
    }
  }
}
