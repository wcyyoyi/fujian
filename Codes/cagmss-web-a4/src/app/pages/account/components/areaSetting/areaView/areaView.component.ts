import { Component, OnInit } from '@angular/core';
import { SelectItem, AreaInfo } from '../../../../models';
import { AreaService } from '../../../../services';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { DictionaryService } from '../../../../utils/Dictionary.service';

@Component({
    selector: 'area-View',
    templateUrl: 'areaView.html',
    styleUrls: ['areaView.scss'],
    
})

export class AreaViewComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    codeList = new Array<string>();
    cNameList = new Array<string>();
    cPCodeList = new Array<string>();


    code: string = "";
    cName: string = "";
    cPCode: string = "";


    areaList: Array<AreaInfo>;
    source = new Array();
    settings = new Array();

    constructor(
        private yzNgxToastyService: YzNgxToastyService,
        private areaService: AreaService,
        private dictionaryService: DictionaryService,
    ) { }

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.getAreaList();
        this.setting();
        this.source = this.areaList;
    }
    getAreaList() {
        let arr = new Array();
        arr = this.dictionaryService.AREA;
        this.areaList = this.dictionaryService.AREA;
        let level = JSON.parse(localStorage.getItem('activeUser'))["area"]['level'];
        let code = JSON.parse(localStorage.getItem('activeUser'))["area"]['code'];
        switch (level) {
            case 0:
                this.areaList = arr;
                break;
            case 1:
                this.areaList = arr.filter(item => String(item["cCode"]).substr(0, 2) == String(code).substr(0, 2));
                break;
            case 2:
                this.areaList = arr.filter(item => String(item["cCode"]).substr(0, 4) == String(code).substr(0, 4));
                break;
            default:
                this.areaList = arr.filter(item => String(item["cCode"]) == String(code));
        }
        this.areaList.forEach(element => {
            this.codeList.push(element["cCode"].toString());
            this.cNameList.push(element["cName"]);
            this.cPCodeList.push(element["cPCode"]);
        });
    }
    search() {
        let newAreaList = new Array();
        this.yzNgxToastyService.wait("正在查询，请稍后", "");
        if (this.code == "" && this.cName == "" && this.cPCode == "") {
            this.source = this.areaList;
            return;
        }
        this.areaList.forEach(element => {
            if (Number(this.code) == element["cCode"] || this.cName == element["cName"] || this.cPCode == element["cPCode"]) {
                newAreaList.push(element)
            }
        });
        this.source = newAreaList;
    }

    setting() {
        this.settings = [
            {
                headerName: '区域代码',
                field: "cCode",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '城市名称',
                field: "cName",
            },
            {
                headerName: '区域等级',
                field: "vLevel",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '纬度',
                field: "v05001",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '经度',
                field: "v06001",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '区域产品编码',
                field: "cPCode",
            },
            {
                headerName: '服务器地址',
                field: "serviceUrl",
            },
            {
                headerName: '地图地址',
                field: "mapUrl",
            },

        ]
    }
}
