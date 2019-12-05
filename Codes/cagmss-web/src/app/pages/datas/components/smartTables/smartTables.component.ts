import { Injectable, Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, Routes } from '@angular/router';

// import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { DataState } from '../../datas.state';
// import { SurfaceService } from '../../../services/surface.service';
import { LocalDataSource } from 'ng2-smart-table';

import { FieldSettings } from '../fieldSettings/fieldSettings.component';

import 'style-loader!./smartTables.scss';
import { ExportService } from '../../../services/export.service';
import { BaMenuService } from '../../../../theme';
import { Station } from '../../../models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FieldSettingModal } from '../fieldSettings/fieldSettings.modal.component';
import { FieldSettingService } from '../fieldSettings/fieldSettings.service';
import { StationSettingsModal } from '../stationSettings/stationSettings.modal.component';
import { StationService } from '../../../services';

@Component({
  selector: 'smart-tables',
  templateUrl: './smartTables.html',
  //styleUrls: ['./smartTables.scss']
})
export class SmartTables implements AfterViewInit {

  fieldModalRef: BsModalRef;
  staModalRef: BsModalRef;

  // @ViewChild(FieldSettings)
  // private fieldCtrl: FieldSettings;
  tabName: string;
  query: string = '';
  v01000: string;
  vStart: Date;
  vEnd: Date;

  fieldList;

  customSettings: any;
  service: any;

  selSettings: any;
  source: LocalDataSource = new LocalDataSource();

  excelData = new Array();
  excelDataName;
  column;

  selStationInfo: string = '站点选择';
  selFieldInfo: string = '字段选择';

  searchInfo: string = '';

  constructor(private route: ActivatedRoute, private state: DataState,
    private exportSevice: ExportService, private menuServ: BaMenuService,
    private modalService: BsModalService, private fieldSettingServ: FieldSettingService,
    protected staService: StationService) {

  }

  ngAfterViewInit() {
    this.route.params.subscribe((params: Params) => {
      this.tabName = params['name'];
      this.selSettings = this.state[this.tabName];
      this.source.empty();

      this.service = this.selSettings.service;
      // this.getFieldOption(this.selSettings.columns);
      this.menuServ.menuItems.subscribe(data => {
        data.forEach(item => {
          item.children.forEach(element => {
            if (element.route.path === 'view/' + this.tabName) {
              this.excelDataName = element.title;
              return;
            }
          });
        });
      });
      this.initQuery();
    });
  }

  initQuery() {
    this.staService.stations.then((staList: Array<Station>) => {
      // 默认国家站（非区域站）
      let staArr = new Array();
      staList.filter((sta: Station) => {
        return sta.cTypestation !== '区域站';
      }).forEach((ele) => {
        staArr.push(ele.v01000);
      });
      this.v01000 = staArr.join(',');
      this.selStationInfo = '共' + staArr.length + '个站点';

      // 默认前十个字段
      let columns = this.state[this.tabName].columns;
      let fieldList = [];

      for (let colName in columns) {
        let option = new Object();
        option['name'] = colName;
        option['value'] = columns[colName];
        option['checked'] = false;

        fieldList.push(option);
      }

      let fieldArr = new Array();
      fieldList.forEach((option, index) => {
        if (index < 10) {
          fieldArr.push(option);
        }
      });

      this.column = new Array();
      if (fieldArr) {
        let selColumns = new Object();
        fieldArr.forEach(field => {
          this.column.push(field.name);
          selColumns[field.name] = field.value;
        });
        this.setTable(selColumns);
      }


      this.onQuery();
    });
  }

  onSelectedTimes(times): void {
    this.vStart = times.start;
    this.vEnd = times.end;
  }

  onCheckedFields(data): void {
    let checkedFields = data.fields;
    this.selFieldInfo = data.selFieldInfo;
    this.column = new Array();
    if (checkedFields) {
      let selColumns = new Object();
      checkedFields.forEach(field => {
        this.column.push(field.name);
        selColumns[field.name] = field.value;
      });
      this.setTable(selColumns);
    }
  }

  onCheckedStations(data) {
    this.v01000 = data.v01000;
    this.selStationInfo = data.selStationInfo;
  }

  onQuery(): void {
    this.searchInfo = '(正在查询...)';
    this.service.getByFilter(this.v01000, this.vStart, this.vEnd).subscribe((data) => {
      this.excelData = data;
      this.source.load(data);
      this.searchInfo = '(查询完成)';
    });
  }

  setTable(columns: Object): void {
    if (columns) {
      this.customSettings = new Object();
      this.customSettings['actions'] = this.selSettings.actions;
      this.customSettings['filter'] = this.selSettings.filter;
      this.customSettings['noDataMessage'] = '没有数据';
      this.customSettings['columns'] = columns;
    }
  }

  // getFieldOption(columns: Object) {
  //   let fieldList = [];
  //   let selColumns = new Object();

  //   for (let colName in columns) {
  //     let option = new Object();
  //     option['name'] = colName;
  //     option['value'] = columns[colName];
  //     option['checked'] = false;

  //     fieldList.push(option);
  //   }
  //   this.fieldList = fieldList;
  // }

  export() {
    if (this.excelData.length === 0) {
      alert('没有数据');
      return;
    }
    let fileName = this.excelDataName + this.vStart.toLocaleDateString() + '-' + this.vEnd.toLocaleDateString() + '统计结果';
    let obj = new Object();
    let data = new Array();
    let title;
    this.excelData.forEach(item => {
      this.column.forEach(col => {
        title = this.customSettings['columns'][col].title;
        obj[title] = item[col];
      });
      data.push(obj);
    });
    this.exportSevice.exportAsExcelFile(data, fileName);
  }

  showFieldsModal() {
    this.modalService.config.ignoreBackdropClick = true;
    this.fieldModalRef = this.modalService.show(FieldSettingModal);
    this.fieldSettingServ.setPoint(this.tabName);
    this.fieldModalRef.content.onFieldChanged.subscribe(this.onCheckedFields.bind(this));
  }

  showStaModal() {
    this.modalService.config.ignoreBackdropClick = true;
    this.staModalRef = this.modalService.show(StationSettingsModal, { class: 'modal-lg' });
    this.staModalRef.content.onStaChanged.subscribe(this.onCheckedStations.bind(this));
  }
}
