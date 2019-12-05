import { Component, OnInit } from '@angular/core';
import { WordService } from '../../../../services/word.service';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { ProdService } from '../../../../services/product.service';
import { MetaService } from '../../../../services/meta.service';
import { TEMPLATE_MENU } from '../template/template.menu';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
@Component({
    selector: 'save-Modal',
    templateUrl: './saveModal.html',
    styleUrls: ['./saveModal.scss'],
    
})
export class SaveModalComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    public htmlCode: string;
    public dataElementCode: string; //数据要素
    public dataType: string;  //数据内容
    public makeCompany: string;  //制作单位
    public productDate: string;  //产品时间
    public selYear: number; //当前所选年
    public selMonth: number; //当前所月
    public selWeek: number; //当前所周
    public selXun: number; //当前所旬
    public yearList: Array<number>; //年份列表
    public monthList: Array<number>; //月列表
    public weekList: Array<number>; //周列表
    public elementList: Array<any>; //数据要素列表
    public typeList: Array<any>; //数据内容列表
    public unitList: Array<any>; //制作单位列表
    constructor(private wordService: WordService, private yzNgxToastyService: YzNgxToastyService,
        private prodService: ProdService, private metaService: MetaService,
        public bsModalRef: BsModalRef, ) {
    };

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
    }
    initStationDto(ckeditorContent, paramArr) {
        this.htmlCode = ckeditorContent;
        this.dataElementCode = paramArr[8];
        this.dataType = paramArr[7];
        this.makeCompany = paramArr[3];
        this.productDate = paramArr[4];
        this.selYear = Number(paramArr[4].substr(0, 4));
        this.selMonth = Number(paramArr[4].substr(4, 2));
        if (this.dataElementCode == "TEND") {
            this.selXun = Number(paramArr[4].substr(6, 2));
        } else if (this.dataElementCode == "WEEK") {
            this.selWeek = Number(paramArr[4].substr(6, 2));
        } else {
            this.selXun = Number("00");
            this.selWeek = Number("00");
        }
        this.getDataDetail();
        let year = new Date().getFullYear();
        this.yearList = new Array();
        this.monthList = new Array();
        this.weekList = new Array();
        for (let i = year; i > 2013; i--) {
            this.yearList.push(i);
        }
        for (let j = 1; j < 13; j++) {
            this.monthList.push(j);
        }
        this.getWeekCount();
        this.elementList = new Array();
        this.elementList = TEMPLATE_MENU;
        this.getElement();
    }
    //保存模版内容
    save() {
        let year = this.selYear == 0 ? "0000" : this.selYear.toString();
        let month = this.selMonth < 10 ? "0" + this.selMonth : this.selMonth.toString();
        switch (this.dataElementCode) {
            case "MONT":
                this.productDate = year + month + "01" + "000000";
                break;
            case "TEND":
                let xun = this.selXun < 10 ? "0" + this.selXun : this.selXun.toString();
                this.productDate = year + month + xun + "000000";
                break;
            case "WEEK":
                let week = this.selWeek < 10 ? "0" + this.selWeek : this.selWeek.toString();
                this.productDate = year + "00" + week + "000000";
                break;
            default:
                this.productDate = "00000000000000";
        }
        this.wordService.saveTemplate(this.dataElementCode, this.dataType, this.htmlCode, this.makeCompany, this.productDate).then(data => {
            this.bsModalRef.hide();

            if (data) {
                this.yzNgxToastyService.success('保存成功', '', 3000);
            } else {
                this.yzNgxToastyService.error('保存失败', '', 3000);
            }
        });
    }
    //获取制作单位
    getElement() {
        let code = JSON.parse(localStorage.getItem("activeUser"))["area"]["pCode"];
        let unitArr = new Array();
        this.unitList = new Array();
        this.metaService.getChildrenData(code).subscribe(data => {
            if (!data) return;
            this.metaService.getAreaData(code).subscribe(list => {
                if (!list) return;
                data.push(list);
                this.metaService.getElement().subscribe(_data => {
                    if (!_data) return;
                    _data.forEach(item => {
                        if (item["cClass"] == "制作单位") {
                            unitArr.push(item);
                        }
                    });
                    data.forEach(item => {
                        let list = unitArr.find(unit => unit["cCode"] == item["cPCode"]);
                        if (!list) return;
                        this.unitList.push(list)
                    })
                })
            })
        })
    }
    //获取数据内容
    getDataDetail() {
        this.typeList = new Array();
        this.prodService.getAllType().subscribe(data => {
            if (!data) return;
            this.typeList = data;
        })
    }
    //获取周总数
    getWeekCount() {
        let lastDate;
        let prodCount;
        let lastDay = new Date(this.selYear + "/12/31").getDay();
        if (lastDay == 4) {
            lastDate = new Date(this.selYear + "/12/31");
        } else if (lastDay < 4) {
            let addNextDay = 5 - lastDay - 1;
            lastDate = new Date(this.selYear + 1 + "/1/" + addNextDay);
        } else {
            let addNextDay = lastDay - 5 + 4;
            lastDate = new Date(this.selYear + 1 + "/1/" + addNextDay);
        }
        let newDate = new Date(this.selYear + "/1/1");
        let firstDate = newDate.getDay();
        let dayCount;
        if (firstDate == 5) {
            dayCount = Math.floor((lastDate.getTime() - newDate.getTime()) / 1000 / 60 / 60 / 24)
            prodCount = Math.ceil(dayCount / 7);
        } else {
            let addDay = 5 - firstDate + 1
            let newFirstFri = this.selYear + "/1/" + addDay;
            let addDate = new Date(newFirstFri)
            dayCount = Math.floor((lastDate.getTime() - addDate.getTime()) / 1000 / 60 / 60 / 24)
            prodCount = Math.ceil(dayCount / 7);
        }
        if (this.selYear == 0) {
            for (let k = 1; k < 54; k++) {
                this.weekList.push(k);
            }
        } else {
            for (let k = 1; k < prodCount + 1; k++) {
                this.weekList.push(k);
            }
        }
    }
    //选择年份发生改变
    onYearChange(year) {
        this.selYear = year;
        if (this.dataElementCode == 'WEEK') {
            this.getWeekCount();
        }
    }
    //选择月份发生改变
    onMonthChange(month) {
        this.selMonth = month;
    }
    //选择旬发生改变
    onXunChange(xun) {
        this.selXun = xun;
    }
    //选择周发生改变
    onWeekChange(week) {
        this.selWeek = week;
    }
    //选择制作单位发生改变
    onUnitChange(unit) {
        this.makeCompany = unit;
    }
    //选择数据要素发生改变
    onElementChange(element) {
        this.dataElementCode = element;
    }
    //选择数据内容发生改变
    onTypeChange(type) {
        this.dataType = type;
    }
}