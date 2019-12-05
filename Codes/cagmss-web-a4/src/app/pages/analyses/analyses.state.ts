import { Injectable } from '@angular/core';
import { ConverterService } from '../utils/Converter/converter.service';

@Injectable()
export class AnalyseState {

  private _type: number;

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  constructor(private converterService: ConverterService, ) {
  }
  columnDefs = [
    {
      colId: "stationNum",
      headerName: '站号',
      field: 'stationNum',
      filter: "agNumberColumnFilter",
      filterParams: { applyButton: true, clearButton: true }
    },
    {
      colId: "stationName",
      headerName: '站名',
      field: 'stationName',
      filter: "agTextColumnFilter",
      filterParams: { applyButton: true, clearButton: true }
    },
    {
      colId: "stationCity",
      headerName: '所属市',
      field: 'stationCity',
      filter: "agSelectColumnFilter",
      filterParams: { applyButton: true, clearButton: true, selectItems: ["南平市", "厦门市", "福州市", "龙岩市", "宁德市", "莆田市", "泉州市", "三明市", "漳州市"] }
    },
    {
      colId: "stationType",
      headerName: '站点性质',
      field: 'stationType',
      filter: "agSelectColumnFilter",
      filterParams: { applyButton: true, clearButton: true, selectItems: ["国家站", "区域站"] }
    },
    {
      colId: "stationAltitude",
      headerName: '海拔高度(米)',
      field: 'stationAltitude',
      filter: "agNumberColumnFilter",
      filterParams: { applyButton: true, clearButton: true }
    },
    {
      colId: "stationDate",
      headerName: '日期',
      field: 'stationDate',
      valueFormatter: (val) => this.dateFormatter(val),
      filter: "agDateColumnFilter",
      filterParams: { applyButton: true, clearButton: true }
    },
    {
      colId: "stationStartDate",
      headerName: '开始日期',
      field: 'stationStartDate',
      valueFormatter: (val) => this.dateFormatter(val),
      filter: "agDateColumnFilter",
      filterParams: { applyButton: true, clearButton: true }
    },
    {
      colId: "stationEndDate",
      headerName: '结束日期',
      field: 'stationEndDate',
      valueFormatter: (val) => this.dateFormatter(val),
      filter: "agDateColumnFilter",
      filterParams: { applyButton: true, clearButton: true }
    },
    {
      colId: "stationValue",
      headerName: '统计值',
      field: 'statValue',
      valueFormatter: (val) => this.valueFormatter(val),
      filter: "agNumberColumnFilter",
      filterParams: { applyButton: true, clearButton: true }
    },
  ];
  //date类型转string
  dateFormatter(colItem) {
    if (!colItem.value) {
      return "无";
    };
    if (this.converterService.timestampToFormateDate2(colItem.value) instanceof Date) {
      return this.converterService.timestampToFormateDate2(colItem.value).toLocaleDateString();
    }
  }
  //statvalue根据条件格式化
  valueFormatter(colItem) {
    if (!colItem.value) {
      return "无";
    };
    if (this.type == 2 || this.type == 3) {
      return this.converterService.timestampToFormateDate2(colItem.value).toLocaleDateString();
    } else if (this.type == 4 || this.type == 5 || this.type == 7){
      return (colItem.value / 10).toFixed(2);
    }else{
      return colItem.value;
    }
  }


}