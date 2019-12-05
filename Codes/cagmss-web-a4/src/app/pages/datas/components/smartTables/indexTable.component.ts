import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataState } from '../../datas.state';
import { LocalDataSource } from 'ng2-smart-table';

import { AreaService, CropDictService } from '../../../services';

import 'style-loader!./indexTable.scss';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'index-table',
    templateUrl: 'indexTable.html',
    
})

export class IndexTable implements AfterViewInit {
    public settings: Array<any>;
    public source: Array<any>;
    constructor(
        private router: Router,
        private yzNgxToastyService: YzNgxToastyService,
        private cropDictService: CropDictService,
        private areaServ: AreaService, ) {

    }

    ngAfterViewInit() {
        this.getExpEleInfo();
        this.setting();
    }

    getExpEleInfo() {
        this.cropDictService.getExpEleListByArea(this.areaServ.areaCode, this.areaServ.level).subscribe(data => {
            if (!data) return;
            let area = new Array();
            area = JSON.parse(localStorage.getItem("AREA"));
            let crop = new Array();
            crop = JSON.parse(localStorage.getItem("E001"));
            data.forEach(item => {
                let list = area.find(_item => _item.cCode == item.v01000);
                item["areaName"] = list ? list["cName"] : "";
                let _crop = crop.find(_list => _list.cCode == item.cCropcode);
                item["cCropname"] = _crop ? _crop["cCropname"] : "";
                let startTime = String(item["dStartdate"]);
                let endTime = String(item["dEnddate"]);
                let startLength = startTime.length;
                let endLength = endTime.length;
                let year = new Date().getFullYear();
                item["dStartdate"] = startLength == 3 ? new Date(year + "/" + startTime.substr(0, 1) + "/" + startTime.substr(1, 2)).getTime() : new Date(year + "/" + startTime.substr(0, 2) + "/" + startTime.substr(2, 2)).getTime();
                item["dEnddate"] = endLength == 3 ? new Date(year + "/" + endTime.substr(0, 1) + "/" + endTime.substr(1, 2)).getTime() : new Date(year + "/" + endTime.substr(0, 2) + "/" + endTime.substr(2, 2)).getTime();
            })
            this.source = data;
        });
    }
    onDeleteConfirm(event) {
        let info = event;
        if (confirm('确认删除？')) {
            this.cropDictService.deleteExpEle(info.cExpcode).toPromise().then((result) => {
                if (result) {
                    this.yzNgxToastyService.success("删除成功", "", 3000);
                    this.getExpEleInfo();
                } else {
                    this.yzNgxToastyService.error("删除失败", "", 3000);
                }
            }).catch(err => {
                this.yzNgxToastyService.error("删除失败", "", 3000);
            });
        }
    }
    setting() {
        this.settings = new Array();
        this.settings = [
            {
                colId: "areaName",
                headerName: '区域',
                field: 'areaName',
            },
            {
                colId: "cCropname",
                headerName: '作物',
                field: 'cCropname',
            },
            {
                colId: "c56002",
                headerName: '品种-发育期',
                field: 'c56002',
            },
            {
                colId: "dStartdate",
                headerName: '开始时间',
                field: 'dStartdate',
                filter: "agDateColumnFilter",
                valueFormatter: (val) => this.dateFormatter(val)
            },
            {
                colId: "dEnddate",
                headerName: '结束时间',
                field: 'dEnddate',
                filter: "agDateColumnFilter",
                valueFormatter: (val) => this.dateFormatter(val)
            },
            {
                headerName: '操作',
                cellRenderer: "customComponent",
                cellRendererParams: [
                    {
                        value: '详细',
                        callBackFunction: (prod) => this.detail(prod)
                    },
                    {
                        value: '删除',
                        callBackFunction: (prod) => {
                            this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
                                if (!e) return;
                                this.onDeleteConfirm(prod);
                            });
                        }
                    },
                ]
            },
        ];
    }
    detail(prod) {
        let url = '/pages/datas/editor/index';
        this.router.navigate([url], { queryParams: { area: prod["v01000"], code: prod["cCropcode"], id: prod["cExpcode"] } });
    }
    dateFormatter(date) {
        if (!date.value) {
            return "无";
        };
        let _dateArr = new Array();
        _dateArr = new Date(date.value).toLocaleDateString().split("/");
        let string = _dateArr[1] + "月" + _dateArr[2] + "日"
        return string;
    }
}