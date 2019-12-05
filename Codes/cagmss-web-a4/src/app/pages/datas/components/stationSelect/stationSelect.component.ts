import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ConverterService } from '../../../utils/Converter/converter.service';
import { BaGrid } from '../../../../theme/components';
@Component({
    selector: 'station-select',
    templateUrl: 'stationSelect.html'
})
export class StationSelectComponent implements OnInit {
    public settings: Array<any>;
    public source: Array<any>;
    @Input() statList: Array<any>;
    @Input() statChecked: Array<number>;
    @Output() onSelected = new EventEmitter<any>();
    @ViewChild('grid') grid: BaGrid;
    constructor(protected converterService: ConverterService, ) { }
    ngOnInit() {
        this.setSettings();
    }
    ngOnChanges() {
        this.source = this.statList;
    }
    //表格加载完成
    onBaGridReady(event) {
        if (this.statChecked) {
            this.grid.initGridChecked(this.statChecked)
        }
    }
    setSettings() {
        let typeFilter = new Array();
        let cityFilter = new Array();
        this.statList.forEach(stat => {
            if (typeFilter.indexOf(stat.cTypestation) < 0) {
                typeFilter.push(stat.cTypestation);
            }
            if (cityFilter.indexOf(stat.cCity) < 0) {
                cityFilter.push(stat.cCity);
            }
        });
        this.settings = [
            {
                headerName: '站号',
                field: 'v01000',
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
                checkboxSelection: true,
                headerCheckboxSelection: true,
            },
            {
                headerName: '站名',
                field: 'cStatName',
                // valueFormatter: (value) => this.converterService.statCodToName(value.data.v01000),
                // filter: "agTextColumnFilter",
                // filterParams: { applyButton: true, clearButton: true },
                suppressFilter: true
            },
            {
                headerName: '类型',
                field: 'cTypestation',
                filter: "agSelectColumnFilter",
                filterParams: { selectItems: typeFilter }
            },
            {
                headerName: '所属城市',
                field: 'cCity',
                filter: "agSelectColumnFilter",
                filterParams: { selectItems: cityFilter }
            }
        ]
    }
    //获取选择的站点
    getSelectedStation() {
        return this.grid.getSelectedRows();
    }
}