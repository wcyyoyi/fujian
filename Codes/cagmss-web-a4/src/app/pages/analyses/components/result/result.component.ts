import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { BaGrid } from '../../../../theme/components';
import { AnalyseState } from '../../analyses.state';
import { ExportService } from '../../../services/export.service';
import { ConverterService } from '../../../utils/Converter/converter.service';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'result',
    templateUrl: './result.html',
    styleUrls: ['./result.scss'],
    

})
export class ResultComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    @Input() source: Array<any>;
    @Input() type: number; //类型
    @Input() fieldName: string;
    @Input() excelFileName: string;
    @Input() startDateString: string;
    @Input() endDateString: string;
    @Output() dataResult = new EventEmitter<any>();
    @ViewChild('grid') baGrid: BaGrid;
    public lastName: string = "";
    public settings: Array<any>;
    private isGridReady = false;
    public level: number;
    constructor(private exportSevice: ExportService, private analyseState: AnalyseState,
        private yzNgxToastyService: YzNgxToastyService, private converterService: ConverterService) {
    };
    ngOnInit(): void {
        this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + this.level;
        this.settings = this.analyseState.columnDefs;
    }
    ngOnChanges() {
        if (!this.type || !this.isGridReady) return;
        this.setStatColumn();
    }
    onBaGridReady(e) {
        this.isGridReady = true;
    }
    //根据不同类型设置最后一列数据类型以及数值
    setStatColumn() {
        this.baGrid.refreshGrid("stationDate", true); //是否显示日期列stationDate
        this.analyseState.type = this.type;
        switch (+this.type) {
            case 1:
            case 6:
                this.baGrid.updateColumnName("stationValue", '日数(天)');
                this.baGrid.updateFilter("stationValue", 'agNumberColumnFilter');
                this.baGrid.refreshGrid("stationDate", false);
                this.lastName = '日数(天)';
                break;
            case 2:
            case 3:
                this.baGrid.updateColumnName("stationValue", '日期');
                this.baGrid.updateFilter("stationValue", 'agDateColumnFilter');
                this.baGrid.refreshGrid("stationDate", false);
                this.lastName = '日期';
                break;
            case 4:
            case 5:
                this.baGrid.updateFilter("stationValue", 'agNumberColumnFilter');
                if (this.fieldName.includes("v12052") || this.fieldName.includes("v12053")) {
                    this.baGrid.updateColumnName("stationValue", '极值(℃)');
                    this.lastName = '极值(℃)';
                }
                if (this.fieldName.includes("v13201")) {
                    this.baGrid.updateColumnName("stationValue", '极值(mm)');
                    this.lastName = '极值(mm)';
                }
                break;
            case 7:
                this.baGrid.updateFilter("stationValue", 'agNumberColumnFilter');
                if (this.fieldName.includes("v12052") || this.fieldName.includes("v12053") || this.fieldName.includes("v12001")) {
                    this.baGrid.updateColumnName("stationValue", '温度(℃)');
                    this.lastName = '温度(℃)';
                }
                if (this.fieldName.includes("v12001")) {
                    this.baGrid.refreshGrid("stationDate", false);
                }
                if (this.fieldName.includes("v13201")) {
                    this.baGrid.updateColumnName("stationValue", '降水量(mm)');
                    this.lastName = '降水量(mm)';
                }
                if (this.fieldName.includes("v14032")) {
                    this.baGrid.updateColumnName("stationValue", '时数(h)');
                    this.lastName = '时数(h)';
                }
                break;
        }
    }
    //导出为excel
    export() {
        if (this.source.length === 0) {
            this.yzNgxToastyService.warning('没有数据', "", 3000);
            return;
        }
        if (this.type == 1 || this.type == 2 || this.type == 3 || this.type == 6) {          //是否显示日期一列
            let newArr = this.settings;
            this.settings = new Array();
            newArr.forEach(item => {
                if (item["field"] == "stationDate") return;
                this.settings.push(item)
            })
        }

        let fileName = this.excelFileName + this.startDateString + '-' + this.endDateString + '统计结果';
        let data = new Array();
        let title;
        this.source.forEach(item => {
            let obj = new Object();
            this.settings.forEach(col => {
                title = col["headerName"];
                if (col["field"] == "stationDate" || col["field"] == "stationStartDate" || col["field"] == "stationEndDate") {
                    obj[title] = this.dateFormatter(item[col["field"]]);
                } else if (col["field"] == "statValue") {
                    obj[this.lastName] = this.valueFormatter(item[col["field"]]);
                } else {
                    obj[title] = item[col["field"]] ? item[col["field"]] : "";
                }
            });
            data.push(obj);
        });
        this.exportSevice.exportAsExcelFile(data, fileName);
    }
    //date类型转string
    dateFormatter(colItem) {
        if (!colItem) {
            return "无";
        };
        if (this.converterService.timestampToFormateDate2(colItem) instanceof Date) {
            return this.converterService.timestampToFormateDate2(colItem).toLocaleDateString();
        }
    }
    //statvalue根据条件格式化
    valueFormatter(colItem) {
        if (!colItem) {
            return "无";
        };
        if (this.type == 2 || this.type == 3) {
            return this.converterService.timestampToFormateDate2(colItem).toLocaleDateString();
        } else if (this.type == 4 || this.type == 5 || this.type == 7) {
            return (colItem / 10).toFixed(2);
        } else {
            return colItem;
        }
    }
    dataChange(data) {
        this.dataResult.emit(data);
    }
}