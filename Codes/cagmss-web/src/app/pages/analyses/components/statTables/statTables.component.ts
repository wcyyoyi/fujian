import { Injectable, Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LocalDataSource } from 'ng2-smart-table';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { SurfaceService } from '../../../services/surface.service';

import 'style-loader!./statTables.scss';
import { ExportService } from '../../../services/export.service';
import { BaMenuService } from '../../../../theme';

@Component({
  selector: 'stat-tables',
  templateUrl: './statTables.html',
  //styleUrls: ['./smartTables.scss']
})
export class StatTables implements AfterViewInit {

  fldName: string;
  type: number;

  bsConfig: Partial<BsDatepickerConfig>;
  vStart: Date = new Date(2017, 0, 1);
  vEnd: Date = new Date(2017, 6, 30);

  customSettings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    filter: false,
    noDataMessage: '正在加载数据，请稍后……',
    columns: {
      stationNum: {
        title: '站号',
        type: 'text'
      },
      stationName: {
        title: '站名',
        type: 'text'
      },
      stationProvince: {
        title: '所属省',
        type: 'text'
      },
      stationLon: {
        title: '经度',
        type: 'number'
      },
      stationLat: {
        title: '纬度',
        type: 'number'
      },
      statValue: {
        title: '统计值',
        type: 'text'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  excelData = new Array();
  excelDataName;

  constructor(private route: ActivatedRoute, private surfServ: SurfaceService,
    private exportSevice: ExportService, private menuServ: BaMenuService) {
    this.bsConfig = Object.assign({}, { locale: 'zh-cn' });
  }

  ngAfterViewInit() {
    this.route.params.subscribe((params: Params) => {
      this.fldName = params['field'];
      this.type = params['type'];
      this.onQuery();
      this.menuServ.menuItems.subscribe(data => {
        data.forEach(item => {
          item.children.forEach(element => {
            if (element.route.path === this.fldName + '/' + this.type) {
              this.excelDataName = element.title;
              return;
            }
          });
        });
      });
    });
  }

  onQuery(): void {
    this.setStatColumn(this.type);
    this.source.empty();

    this.surfServ.statDays(this.type, this.fldName, this.vStart, this.vEnd).subscribe((data) => {
      this.source.load(data);
      this.excelData = data;
    });
  }

  setStatColumn(statType: number) {
    switch (+statType) {
      case 1:
      case 6:
        this.customSettings.columns.statValue = { title: '日数(天)', type: 'number' };
        this.customSettings.columns.statValue['valuePrepareFunction'] = null;
        break;
      case 2:
      case 3:
        this.customSettings.columns.statValue = { title: '日期', type: 'date' };
        this.customSettings.columns.statValue['valuePrepareFunction'] = this.convertToDate;
        break;
      case 4:
      case 5:
        if (this.fldName.includes("v12052") || this.fldName.includes("v12053")) {
          this.customSettings.columns.statValue = { title: '极值(℃)', type: 'number' };
          this.customSettings.columns.statValue['valuePrepareFunction'] = this.convertToTemp;
        }
        if (this.fldName.includes("v13201")) {
          this.customSettings.columns.statValue = { title: '极值(mm)', type: 'number' };
          this.customSettings.columns.statValue['valuePrepareFunction'] = null;
        }
        break;
    }

    this.customSettings = Object.assign({}, this.customSettings);
  }

  convertToDate(value: number) {
    if (value) {
      let dateValue = new Date(value);
      return dateValue.toLocaleDateString();
    } else {
      return value;
    }
  }

  convertToTemp(value: number) {
    if (value) {
      let tValue = value / 10;
      return tValue;
    } else {
      return value;
    }
  }

  export() {
    let fileName = this.excelDataName + this.vStart.toLocaleDateString() + '-' + this.vEnd.toLocaleDateString() + '统计结果';
    if (this.excelData.length === 0) {
      alert('没有数据');
      return;
    }
    let columns = this.customSettings.columns;
    let data = new Array();
    this.excelData.forEach(item => {
      let str = '{"' +
        columns.stationNum.title + '":"' + item.stationNum + '","' +
        columns.stationName.title + '":"' + item.stationName + '","' +
        columns.stationProvince.title + '":"' + item.stationProvince + '","' +
        columns.stationLon.title + '":"' + item.stationLon + '","' +
        columns.stationLat.title + '":"' + item.stationLat + '","' +
        columns.statValue.title + '":"' + item.statValue +
        '"}';
      data.push(JSON.parse(str));
    });
    this.exportSevice.exportAsExcelFile(data, fileName);
  }
}
