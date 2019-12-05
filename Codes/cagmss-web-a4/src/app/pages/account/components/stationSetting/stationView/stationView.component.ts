import { Component, OnInit } from '@angular/core';
import { StationService } from '../../../../services';
import { AreaService } from '../../../../services';

@Component({
    selector: 'station-view',
    templateUrl: 'stationView.html',
    styleUrls: ['stationView.scss'],
})

export class StationViewComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    source = new Array();
    settings = new Array();
    stationList = new Array();
    codeList = new Array();
    cNameList = new Array();
    cTypeList = new Array();
    code: string = "";
    cName: string = "";
    cType: string = "";
    constructor(private stationService: StationService,
        private areaService: AreaService) { }

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.setting();
        this.getStationList();
    }
    getStationList() {
        this.stationList = new Array();
        let level = JSON.parse(localStorage.getItem("activeUser"))["area"]["level"];
        let code = JSON.parse(localStorage.getItem("activeUser"))["area"]["code"];
        let statAll = new Array();
        statAll = JSON.parse(localStorage.getItem("MANG_STAT"));
        if (level == 1 || level == 0) {
            this.stationList = statAll;
        } else if (level == 2) {
            this.stationList = statAll.filter(stat => String(stat["cCode"]).substr(0, 4) == String(code).substr(0, 4))
        } else {
            this.stationList = statAll.filter(stat => stat["cCode"] == code)
        }
        this.source = this.stationList;
        this.stationList.forEach(element => {
            if (!this.codeList.includes(element["cCode"].toString())) {
                this.codeList.push(element["cCode"].toString());
            }
            if (!this.cNameList.includes(element["cStatName"])) {
                this.cNameList.push(element["cStatName"]);
            }
            if (!this.cTypeList.includes(element["cTypestation"])) {
                this.cTypeList.push(element["cTypestation"]);
            }
        });
    }
    search() {
        let newAreaList = new Array();
        if (this.code == "" && this.cName == "" && this.cType == "") {
            this.source = this.stationList;
            return;
        }
        let arr1 = new Array();
        let arr2 = new Array();
        this.stationList.forEach(element => {
            if (this.code != "") {
                if (Number(this.code) != element["cCode"]) return;
                arr1.push(element)
            } else {
                arr1 = this.stationList;
            }
        });
        arr1.forEach(list => {
            if (this.cName != "") {
                if (this.cName != list["cStatName"]) return;
                arr2.push(list)
            } else {
                arr2 = arr1;
            }
        });
        arr2.forEach(_element => {
            if (this.cType != "") {
                if (this.cType != _element["cTypestation"]) return;
                newAreaList.push(_element)
            } else {
                newAreaList = arr2;
            }
        });
        this.source = newAreaList;
    }
    setting() {
        this.settings = [
            {
                headerName: '所属区域',
                field: "cAera",
            },
            {
                headerName: '行政区代码',
                field: "cCode",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '站点名称',
                field: "cStatName",
            },
            {
                headerName: '站点类型',
                field: "cTypestation",
            },
            {
                headerName: '省份名称',
                field: "cPrvoName",

            },
            {
                headerName: '城市名称',
                field: "cCity",
            },
            {
                headerName: '站号',
                field: "v01000",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '测站高度',
                field: "v07001",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '经度',
                field: "v06001",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '纬度',
                field: "v05001",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '是否为农气站',
                field: "cAgmesta",
            },
            {
                headerName: '是否为自动站',
                field: "cAutosoilsta",
            },
            {
                headerName: '是否为作物站',
                field: "cCropsta",
            },
            {
                headerName: '是否为气象站',
                field: "cMeteosta",
            },
            {
                headerName: '是否为土壤站',
                field: "cSoilsta",
            },
        ]
    }
}
