import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Station } from '../../../models';
import { DictionaryService } from '../../../utils/Dictionary.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SurfaceService } from '../../../services/surface.service';
import { StationService } from '../../../services';
import { BaGrid } from '../../../../theme/components';
import 'style-loader!./setting.scss';
import { ANALS_MENU } from '../../analyses.menu';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { StationSettingsModal } from '../../../businessComponent/stationChoose/stationSettings.modal.component';
@Component({
    selector: 'setting',
    templateUrl: './setting.html',
    styleUrls: ['./setting.scss'],
    
})
export class SettingComponent implements AfterViewInit {
    btnClassLevel: string = 'yz-btn-level1';
    staModalRef: BsModalRef;
    public date = new Date();
    public vStart = new Date(this.date.getTime() - 24 * 60 * 60 * 1000 * 10)//开始时间;
    public vEnd = new Date(this.date.getTime());//结束时间;
    public startYear: string = this.date.getFullYear().toString(); //开始年份
    public endYear: string = this.date.getFullYear().toString(); //结束年份
    public startMonthDay: string = this.padding((this.date.getMonth() + 1).toString(), 2) + this.padding(this.date.getDate().toString(), 2);
    public endMonthDay: string = this.padding((this.date.getMonth() + 1).toString(), 2) + this.padding(this.date.getDate().toString(), 2);
    public vSetMIN: number;
    public vSetMAX: number;
    public statList: Array<Station>;
    public statsChecked: Array<number>;//记录选择站点的下标
    public v01000: string = '';//站号
    public selStationInfo: string = '';//站点列表信息
    public tabSelectValue: number;//0为连续查询1为非连续查询
    public fieldName: string;
    public type: number;
    public level: number;
    public dataResult: Array<any>;
    public yearlist = new Array();
    public num: number;
    public unit: string;
    public statNumList: Array<any>;
    public title: string;//标题
    public startDateString: string = '';   //开始时间字符串
    public endDateString: string = '';    //结束时间字符串
    public excelFileName: string = '';    //导出表格名称
    public now = new Date();
    public minDate: Date;
    public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD'
    });
    @ViewChild('grid') baGrid: BaGrid;
    public result: Array<any>;
    constructor(private route: ActivatedRoute, private dictionaryService: DictionaryService,
        private modalService: BsModalService, private surfServ: SurfaceService,
        private stationService: StationService, private yzNgxToastyService: YzNgxToastyService) {
    };

    ngAfterViewInit(): void {
        this.title = ""
        this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + this.level;
        let dateArr = new Date().toLocaleDateString().split("/");
        this.minDate = new Date(Number(dateArr[0]) - 1 + "/" + dateArr[1] + "/" + dateArr[2]);
        this.tabSelectValue = 0;
        this.dataResult = new Array();
        for (let i = 0; i < 100; i++) {
            this.yearlist.push(1968 + i);
        }
        let firstEntry = true;
        this.route.params.subscribe((params: Params) => {
            if (firstEntry) {
                params = { field: "v12052:[300,]", type: "7" };
            }
            firstEntry = false;
            this.fieldName = params['field'];
            this.type = params['type'];
            this.dataResult = new Array();
            let menu = ANALS_MENU;
            menu[0]["children"].forEach(element => {
                if (element.children[0]["path"].split(":")[0].split("/")[0] == this.fieldName.split(":")[0]) {
                    this.title = element.data.menu.title;
                    this.excelFileName = this.title + "_" + element.children.find(ele => ele["path"] == this.fieldName + "/" + this.type).data.menu.title;
                }
            });
            this.setting();
            if (this.fieldName == 'v12001' && this.type == 7) {
                this.initStatList(10);
            } else {
                this.initStatList(2);
            }
            this.search();
        });
    }
    //基本设置
    setting() {
        if (!this.fieldName) return;
        let paramArr = new Array();
        paramArr = this.fieldName.split(":");
        let param = paramArr[0];
        if (param == 'v12052' || param == 'v12053') {
            this.unit = '（℃）'
        } else if (param == 'v13201') {
            this.unit = '（mm）'
        } else if (param == 'v14032') {
            this.unit = '（h）'
        }
        this.vSetMIN = null;
        this.vSetMAX = null;
        if (!paramArr[1]) return;
        let min = paramArr[1].split(",")[0].split("[")[1];
        let max = paramArr[1].split(",")[1].split("]")[0];
        if (min) {
            this.vSetMIN = min == 0 ? 0 : min / 10;
        }
        if (max) {
            this.vSetMAX = max == 0 ? 0 : max / 10;
        }
    }
    //站点选择器点击事件
    showStaModal() {
        this.modalService.config.ignoreBackdropClick = true;
        this.staModalRef = this.modalService.show(StationSettingsModal, { class: 'modal-lg statChoose' });
        this.staModalRef.content.checkedStatNum = this.statsChecked;
        this.staModalRef.content.stationArr.subscribe(this.onCheckedStations.bind(this));
    }
    //站点选择器初始化，设置选择两个站点的状态
    initStatList(num) {
        let staList = this.dictionaryService.MANG_STAT;
        this.statNumList = new Array();
        staList.forEach(item => {
            if (!this.statNumList.includes(item['v01000'])) {
                this.statNumList.push(item['v01000']);
            }
        })
        let statsChecked = new Array<number>();
        for (let index = 0; index < staList.length; index++) {
            if (staList[index].cTypestation === '国家站') {
                statsChecked.push(staList[index].v01000);
                if (statsChecked.length >= num) break;
            }
        }
        this.statList = staList;
        this.statsChecked = statsChecked;
        this.v01000 = statsChecked.join(',');
        this.selStationInfo = '共选择' + statsChecked.length + '个站点';
    }
    //站点选择器选择完成后事件
    onCheckedStations(data) {
        this.statsChecked = data;
        this.v01000 = data.join(',');
        this.selStationInfo = '共选择' + data.length + '个站点';
    }
    //tab发生改变
    tableChange(num) {
        if (this.tabSelectValue == num) return;
        this.tabSelectValue = num;
        this.search();
    }
    //根据查询条件进行数据获取
    search() {
        let nameArr = new Array();
        nameArr = this.fieldName.split(":");
        let min = this.vSetMIN ? this.vSetMIN * 10 : "";
        let max = this.vSetMAX ? this.vSetMAX * 10 : "";
        this.fieldName = nameArr[1] ? nameArr[0] + ":[" + min + "," + max + "]" : nameArr[0];
        this.dataResult = new Array();
        let statString = this.type == 7 ? this.v01000 : '';
        let type = this.type == 7 ? 0 : this.type;
        if (nameArr[0] == "v12001" && this.type == 7) {
            type = 7;         //积温
        }
        if (this.tabSelectValue == 0) {
            this.startDateString = this.vStart.toLocaleDateString();
            this.endDateString = this.vEnd.toLocaleDateString();
            this.serialSearch(statString, type);
        } else {
            this.startDateString = new Date(this.startYear + "/" + this.startMonthDay.substr(0, 2) + "/" + this.startMonthDay.substr(2, 2)).toLocaleDateString();
            this.endDateString = new Date(this.endYear + "/" + this.endMonthDay.substr(0, 2) + "/" + this.endMonthDay.substr(2, 2)).toLocaleDateString();
            this.unSerialSearch(statString, type);
        }
    }
    //连续查询
    serialSearch(statString, type) {
        this.yzNgxToastyService.wait("正在查询请稍后", "", 3000);
        let dateString = '[' + this.dateTransform(this.vStart) + ',' + this.dateTransform(this.vEnd) + ']';
        this.surfServ.serialSearch(dateString, this.fieldName, type, statString).toPromise().then(data => {
            if (!data) {
                this.yzNgxToastyService.error("查询失败", "", 3000);
                return;
            }
            this.yzNgxToastyService.close();
            let message = data.length == 0 ? "该时间段没有数据" : "";
            this.yzNgxToastyService.success("查询成功", message, 3000);
            this.filter(data);
        }).catch(() => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("查询失败", "", 3000);
        })
    }
    //非连续查询
    unSerialSearch(statString, type) {
        this.yzNgxToastyService.wait("正在查询请稍后", "", 3000);
        this.surfServ.unSerialSearch(this.fieldName, type, this.startYear, this.endYear, this.startMonthDay, this.endMonthDay, statString).toPromise().then(data => {
            if (!data) {
                this.yzNgxToastyService.error("查询失败", "", 3000);
                return;
            }
            this.yzNgxToastyService.close();
            let message = data.length == 0 ? "该时间段没有数据" : "";
            this.yzNgxToastyService.success("查询成功", message, 3000);
            this.filter(data);
        }).catch(() => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("查询失败", "", 3000);
        })
    }
    //过滤
    filter(data) {
        let output = new Array();
        this.stationService.getIdsByArea(Number(this.stationService.areaCode), this.stationService.level).then(stationIds => {
            data.forEach(d => {
                if (stationIds.includes(d.stationNum)) {
                    output.push(d);
                }
            });
            output.forEach(element => {
                if ((element.stationType) != "区域站") {
                    element.stationType = "国家站"
                }
            });
            this.dataResult = output;
            this.result = this.dataResult;
        })
    }
    //开始年份发生改变
    startYearChange(year) {
        this.startYear = year;
    }
    //结束年份发生改变
    endYearChange(year) {
        this.endYear = year;
    }
    //时间转换
    dateTransform(date: Date) {
        let dateArr = date.toLocaleDateString().split("/");
        let year = dateArr[0];
        let month = Number(dateArr[1]) < 10 ? "0" + dateArr[1] : dateArr[1];
        let day = Number(dateArr[2]) < 10 ? "0" + dateArr[2] : dateArr[2];
        let dateString = year + month + day + "000000";
        return dateString;
    }
    //月日选择器数据获取（开始月日）
    setStartDate(event) {
        let startDate = event;
        let startDateArray = startDate.toLocaleDateString().split("/");
        this.startMonthDay = this.padding(startDateArray[1], 2) + this.padding(startDateArray[2], 2);
    }
    //月日选择器数据获取（结束月日）
    setEndDate(event) {
        let endDate = event;
        let endDateArray = endDate.toLocaleDateString().split("/");
        this.endMonthDay = this.padding(endDateArray[1], 2) + this.padding(endDateArray[2], 2);
    }
    //日期转字符串后如8月转08
    padding(num, length) {
        for (let len = (num + "").length; len < length; len = num.length) {
            num = "0" + num;
        }
        return num;
    }
    dataChange(data) {
        this.result = data;
    }
}