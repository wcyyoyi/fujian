import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { AgSelectColumnFilter } from './agSelectColumnFilter';
import { BaGridHelper } from './baGridHelper.service';
import { CustomComponent } from './customComponent';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridApi, RowNode, ColumnApi } from 'ag-grid';
import { ApiService } from '../../../pages/services';
// import "ag-grid-enterprise";

@Component({
    selector: 'ba-grid',
    templateUrl: './baGrid.html',
    styleUrls: ['./baGrid.scss'],
    providers: [BaGridHelper]
})

export class BaGrid implements OnInit {
    @Input() settings: any;
    @Input() source = [];
    @Input() isFilter: boolean = true;
    @Input() isSort: boolean = true;
    @Input() isPager: boolean = true;
    @Input() pageSize: number;
    @Input() isFieldSelection: boolean = false;//字段选择功能
    @Input() isDataExport: boolean = false;//数据导出功能
    @Input() rowSelection: string = 'multiple';//默认多选

    @Output() afterFilted = new EventEmitter<any>();
    @Output() onBaGridReady = new EventEmitter<any>();
    @Output() rowSelect = new EventEmitter<any>();
    private localeText;
    public gridApi: GridApi;
    private gridColumnApi;
    private frameworkComponents;
    private isAutoPageSize: boolean;
    private filterSource = [];
    private fieldRowSelection: string = 'multiple';

    fieldSettings = [
        {
            headerName: '列选择',
            field: 'fieldName',
            checkboxSelection: true,
            width: 150,
            // headerCheckboxSelection: true,
        }]
    fieldSource = new Array<{ fieldName: string }>();
    btnClassLevel: string = 'yz-btn-level1';
    @ViewChild('agGrid') agGrid: AgGridNg2;
    @ViewChild('fieldGrid') fieldGrid: AgGridNg2;
    constructor(private gridHelper: BaGridHelper,
        private apiService: ApiService) {
    }
    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.localeText = this.gridHelper.initGridLocaleText();
        // this.getContextMenuItems = this.gridHelper.initMenu;
        this.frameworkComponents = { agSelectColumnFilter: AgSelectColumnFilter, customComponent: CustomComponent };
        if (this.pageSize) {
            this.isAutoPageSize = false;
        } else {
            this.isAutoPageSize = true;
        }

    }

    //表格加载完成
    private onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        //调整表格大小自适应
        this.gridApi.sizeColumnsToFit();
        // console.log(1);

        this.onBaGridReady.emit(params);
    }
    private onRowSelected(event) {
        if(event.node.selected&&event.data.cCropname){
            this.rowSelect.emit(event.data.cCrop)
        }
    }

    private onSelectionChanged(event) {
    }
    //表格过滤器点击应用条件后的事件
    onfilterChanged(obj) {
        this.filterSource = [];

        // let filterNodes = this.gridApi.getModel().rootNode.childrenAfterFilter;
        let filterNodes = this.gridApi.getModel()['rootNode'].childrenAfterFilter;

        filterNodes.forEach(node => {
            this.filterSource.push(node.data);
        });

        this.afterFilted.emit(this.filterSource);
    }

    //替换某一列（a:列id）的过滤器为b
    updateFilter(a: string, b: string) {
        this.gridApi.destroyFilter(a);
        this.gridColumnApi.getColumn(a).colDef.filter = b;
    }

    //增减列(a：列id)的数量（b：布尔值,true为显示，false为隐藏）后，刷新ag-grid
    refreshGrid(a: string, b: boolean) {
        this.gridColumnApi.setColumnVisible(a, b);
        this.gridApi.sizeColumnsToFit();
    }

    //修改列名 a(列id)，b为新列名
    updateColumnName(a: string, b: string) {
        this.gridColumnApi.getColumn(a).colDef.headerName = b;
        this.gridApi.refreshHeader();
    }

    updateColumnFilterAvailable(a: string, b: boolean) {
        this.gridColumnApi.getColumn(a).colDef.suppressFilter = b;
        this.gridApi.refreshHeader();
    }

    //导出为csv
    exportAsCsv(params) {
        this.gridApi.exportDataAsCsv(params);
    }

    private export() {
        let params = {
            fileName: '数据结果',
        };
        this.exportAsCsv(params);
    }

    initGridChecked(indexs: Array<number>) {
        this.gridApi.forEachNode((node: RowNode) => {
            if (indexs.indexOf(node.childIndex) >= 0) {
                node.setSelected(true);
            }
        })
    }

    getSelectedRows() {
        return this.gridApi.getSelectedRows();
    }

    getSelectedNodes() {
        return this.gridApi.getSelectedNodes();
    }
    getfilterSource() {
        return this.filterSource;
    }

    private onFieldRowSelected(event) {
        let index = event.node.childIndex;
        this.gridColumnApi.setColumnVisible(this.settings[index].field, event.node.selected);
        this.gridApi.sizeColumnsToFit();
    }

    private onFieldGridReady(params) {
    }
    public initFieldGrid(settings) {
        let fieldList = new Array();

        settings.forEach(setting => {
            fieldList.push({ fieldName: setting.headerName });
        });
        this.fieldSource = fieldList;

    }

    fieldRowDataChanged(event) {
        if (this.isFieldSelection) this.initFieldChecked();
    }

    private initFieldChecked() {
        let api: GridApi = this.fieldGrid.api;
        let index = 0;
        api.forEachNode((node: RowNode) => {
            node.setSelected(!this.settings[index].hide);
            index++;
        });
    }

}