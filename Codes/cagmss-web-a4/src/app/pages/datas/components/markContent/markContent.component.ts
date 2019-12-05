import { Component, Input, ViewChild, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { BookMarkService } from '../../../services/bookMark.service';
import { MetaService } from '../../../services/meta.service';
import { ProdService } from '../../../services/product.service';
import { TEMPLATE_MENU } from '../../../account/components/configSetting/template/template.menu';
import { BaGrid } from '../../../../theme/components';
@Component({
    selector: 'mark-content',
    templateUrl: 'markContent.html',
    styleUrls: ['markContent.scss'],
    
})
export class MarkContentComponent {
    public elementList: Array<any>; //数据要素列表
    public typeList: Array<any>; //数据内容列表
    public unitList: Array<any>; //制作单位列表
    public selDetail: string;
    public selUnit: string;
    public selElement: string;
    btnClassLevel: string = 'yz-btn-level1';
    public source: Array<any>;
    public settings: Array<any>;
    public content: any;
    public MarkType: Array<any>;
    @Input() statChecked: Array<number>;
    @ViewChild('grid') grid: BaGrid;
    constructor(private bookMarkService: BookMarkService, fb: FormBuilder, public bsModalRef: BsModalRef,
        private metaService: MetaService, private prodService: ProdService, private yzNgxToastyService: YzNgxToastyService) {
    }
    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.elementList = new Array();
        this.elementList = TEMPLATE_MENU;
        this.selElement = this.elementList[0]["element"];
        this.setting();
        this.getDataDetail().then(() => {
            this.getMarkType().then(() => {
                this.getElement();
            })
        })
    }
    initStationDto(content) {
        this.content = content;
    }
    //表格加载完成
    onBaGridReady(event) {
        this.statChecked = [];
        if (this.statChecked) {
            this.grid.initGridChecked(this.statChecked)
        }
    }
    //获取数据内容
    getDataDetail() {
        this.typeList = new Array();
        return this.prodService.getAllType().toPromise().then(data => {
            if (!data) return;
            data.forEach(item => {
                if (item["value"] == "WCRM" || item["value"] == "AWFC") {
                    this.typeList.push(item);
                }
            })
            this.selDetail = this.typeList[0]["value"];
        })
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
                    this.selUnit = this.unitList.find(unit => unit["cCode"] == code)["cCode"];
                    this.searchBookMark();
                })
            })
        })
    }
    //数据内容发生改变
    onDetailChange(param) {
        this.selDetail = param;
        this.searchBookMark();
    }
    //制作单位发生改变
    onUnitChange(param) {
        this.selUnit = param;
        this.searchBookMark();
    }
    //要素发生改变
    onElementChange(param) {
        this.selElement = param;
        this.searchBookMark();
    }
    //根据模版获取书签
    searchBookMark() {
        let newArr = new Array();
        this.source = new Array();
        this.bookMarkService.getMarkByTemplate(this.selElement, this.selDetail, this.selUnit).subscribe(data => {
            if (!data) return;
            data.forEach(item => {
                if (item["bookmarkType"] != 1) return;
                newArr.push(item);
            })
            this.source = newArr;
        })
    }
    //settings设置
    setting() {
        this.settings = new Array();
        this.settings = [
            {
                headerName: '书签描述',
                field: "bookmarkDesc",
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
                checkboxSelection: true,
                headerCheckboxSelection: true,
            },
            {
                headerName: '书签类型',
                field: "bookmarkType",
                filter: "agTextColumnFilter",
                valueFormatter: (value) => this.valueFormatter(value),
            }
        ]
    }
    //保存
    saveAll() {
        let result = new Array();
        result = this.grid.getSelectedRows();
        result.forEach(item => {
            item["bookmarkContent"] = this.content;
            this.bookMarkService.updateBookMark(item).toPromise().then(data => {
                if (!data) {
                    this.yzNgxToastyService.error("保存失败", "", 3000);
                    return;
                }
                this.bsModalRef.hide();
                this.yzNgxToastyService.success("保存成功", "", 3000);
            }).catch(() => {
                this.yzNgxToastyService.error("保存失败", "", 3000);
            })
        })
    }
    //结果显示转化
    valueFormatter(param) {
        let item = this.MarkType.find(type => type["code"] == param["value"])
        return item ? item["desc"] : "";
    }
    //获取书签类型枚举
    getMarkType() {
        this.MarkType = new Array();
        return this.bookMarkService.getBookMarkList().toPromise().then(data => {
            if (!data) return;
            this.MarkType = data;
        })
    }
}