import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { YzNgxGridComponent } from 'yz-ngx-base/src/yz-ngx-grid/yz-ngx-grid.component';
import 'style-loader!./stationSettings.modal.scss';
import { DefinitionService } from '../../services/definition.service';
import { StationService } from '../../services/station.service';
import { MangStatSet, Station, Definition } from '../../models/definitions';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'station-modal',
    templateUrl: 'stationSettings.modal.html'
})

export class StationSettingsModal implements OnInit {
    public settings: Array<any>;
    public source: Array<Station>;
    public level: number;
    public areaCode: number;
    public checkedStatNum: Array<number>;
    public definitionList: Array<Definition>;   //自定义列表
    @Output() stationArr = new EventEmitter<any>();
    @ViewChild('stationGrid') stationGrid: YzNgxGridComponent;

    constructor(private bsModalRef: BsModalRef, private definitionService: DefinitionService,
        private yzNgxToastyService: YzNgxToastyService,private stationService:StationService
    ) { }

    ngOnInit() {
        this.source = new Array();
        this.level = JSON.parse(localStorage.getItem("activeUser"))["area"]["level"];
        this.areaCode = JSON.parse(localStorage.getItem("activeUser"))["area"]["code"];
        this.setSettings();
        this.stationService.getStations(this.areaCode.toString(),this.level).then(data=>{
            if(!data) return;
            this.source = data;
            this.getDefinitionList();
        })
    }
    //站点选择成功
    stationSelected(data: Array<Station>) {
        let statArr = new Array();
        data.forEach(item=>{
            statArr.push(item.v01000);
        })
        this.stationArr.emit(statArr);
        this.bsModalRef.hide();
    }
    //设置Settings
    setSettings() {
        let headerName = "";
        let field = "";
        switch (this.level) {
            case 0:
                field = 'cPrvoName';
                headerName = "省份";
                break;
            case 1:
                field = 'cCity';
                headerName = "市";
                break;
            case 2:
                field = 'cCounty';
                headerName = "县";
                break;
        }
        this.settings = [
            {
                headerName: '站号',
                field: 'v01000',
                checkboxSelection: true,
                headerCheckboxSelection: true,
            },
            {
                headerName: '站名',
                field: 'cStatName',
            },
            {
                headerName: headerName,
                field: field,
            },
            {
                headerName: '类型',
                field: 'cTypestation',
            },
            {
                headerName: '所属区域',
                field: 'cAera',
            }
        ]
    }
    //获取自定义列表
    getDefinitionList() {
        this.definitionService.getAllData().subscribe(data => {
            if (!data) return;
            let nameArr = new Array();
            data.forEach(list => {
                if (nameArr.includes(list["cRemark"])) return;
                nameArr.push(list["cRemark"])
            })
            let definitionList = new Array();
            nameArr.forEach(name => {
                let definitio = new Definition();
                definitio.name = name;
                let dataArr = data.filter(list => list["cRemark"] == name);
                definitio.index = new Array();
                dataArr.forEach(item => {
                    definitio.index.push(item["v01000"]);
                })
                definitionList.push(definitio)
            })
            this.definitionList = definitionList;
        })
    }
    //添加自定义
    addDefinition(param: Array<any>) {
        let promiseArr = new Array<Promise<any>>();
        let statNumArr = param[0];
        statNumArr.forEach(statNum => {
            let mangStatSet = new MangStatSet();
            mangStatSet.v01000 = statNum;
            mangStatSet.v0100001 = statNum;
            mangStatSet.cRemark = param[1];
            mangStatSet.cBuscode = "";
            promiseArr.push(this.definitionService.addOne(mangStatSet).toPromise());
        })
        Promise.all(promiseArr).then(() => {
            this.getDefinitionList();
            this.yzNgxToastyService.success("添加自定义成功", "", 3000);
        })
    }
   
}