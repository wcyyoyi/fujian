import { Component, OnInit, ViewChild } from '@angular/core';
import 'style-loader!./productUpload.scss';
import { BsModalRef } from 'ngx-bootstrap';
import { AreaService } from '../../services';
import { UploadComponent } from './upload/upload.component';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { ProdService } from '../../services/product.service';
import { fileUpload } from '../../models/fileUpload';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserConfig } from '../../models/userConfig/userConfig';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';

const typeList = [
    { tagName: "农业气象情报", dataType: "WCRM" },
    { tagName: "农用天气预报", dataType: "AWFC" },
    { tagName: "农业气象灾害监测预警", dataType: "ADRM" },
    { tagName: "特色农业气象专题", dataType: "CAMS" },
    { tagName: "中央三农专业区划", dataType: "ACRS" },
]

@Component({
    selector: 'productUpload',
    templateUrl: 'productUpload.html',
})

export class ProductUpload implements OnInit {
    public config: any;
    public count: number;
    public elementList: Array<any>;
    public productList: Array<any>;
    public typeList: Array<any>;
    public ifAdd: boolean;
    public dataType: string;
    public dataEle: string;
    public productDate: string;
    public fileUpload = new fileUpload();
    public now = new Date();
    public date = new Date("2000/10/10");
    public fileList: Array<string>;
    public addtype: string;
    public form: FormGroup;
    public _dataType: AbstractControl;
    public _makeCompany: AbstractControl;
    public _dataEle: AbstractControl;
    public _productDate: AbstractControl;
    public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD'
    });
    public buttonStatus: boolean;
    btnClassLevel: string = 'yz-btn-level1';
    @ViewChild('upload') upload: UploadComponent;
    constructor(private yzNgxToastyService: YzNgxToastyService, public bsModalRef: BsModalRef, private areaService:
        AreaService, fb: FormBuilder, private prodService: ProdService) {
        this.form = fb.group({
            '_dataType': ['', Validators.compose([Validators.required])],
            '_makeCompany': ['', Validators.compose([Validators.required])],
            '_dataEle': [''],
            '_productDate': [''],
        });

        this._dataType = this.form.controls['_dataType'];
        this._makeCompany = this.form.controls['_makeCompany'];
        this._dataEle = this.form.controls['_dataEle'];
        this._productDate = this.form.controls['_productDate'];
    }
    ngOnInit() {
        this.addtype = 'DOCX';
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.buttonStatus = true;
        this.getConfig();
    }
    public onSubmit(values: Object): void {
        if (this.form.valid) {
            this.yzNgxToastyService.confirm("确认上传？", 'info', (e) => {
                if (!e) return;
                this.yzNgxToastyService.wait("正在上传文件请稍后", "");
                this.upload.submit();
            });
        }
    }
    getConfig() {
        this.typeList = typeList;
        this.config = this.typeList[0];
        this.setting();

        this.areaService.getDetailByCpcode(this.areaService.makeCompany).toPromise().then(data => {
            if (!data) return;
            this.fileUpload.makeCompany = data["cName"];
        })
    }
    changeType(type) {
        if (!type) return;
        this.buttonStatus = true;
        this.config = this.typeList.find(_type => _type["tagName"] == type);
        this.setting();
    }
    setting() {
        if (!this.config) return;
        this.fileUpload.dataType = this.config["tagName"];
        this.dataType = this.config["dataType"];
        this.count = this.dataType == "WCRM" ? 1 : 100;
        if (this.dataType == "WCRM") {
            this.prodService.getProductList().subscribe(pro => {
                this.prodService.getDateElement().subscribe(data => {
                    this.productList = pro[0]["itemList"];
                    this.elementList = data.find(list => list["name"] == this.dataType)["children"];
                    this.fileUpload.element = this.dataType == 'WCRM' ? this.elementList[0]["element"] : "DEF";
                    this.dataEle = this.dataType == 'WCRM' ? this.elementList[0]["element"] : "DEF";
                    this.ifAdd = false;
                    this.fileUpload.productDate = new Date();
                    this.productDate = this.dateTransform(new Date());
                })
            })
        }
    }
    submitSuccess(param) {
        if (param[0]) {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.success(param[2] + "文件上传成功", "", 3000);
        } else {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error(param[2] + "文件上传失败", "", 3000);
        }
    }
    fileReady(params) {
        if (params[0]) {
            this.buttonStatus = false;
        }
        if (this.dataType == "WCRM") return;
        this.addtype = params[1];
        this.getFileNumber(this.addtype);
    }
    changeElement(element) {
        if (element == this.dataEle) return;
        this.dataEle = element;
        let newdate = this.setDate(this.fileUpload.productDate);
        if (newdate == undefined) return;
        this.fileUpload.productDate = newdate;
        this.productDate = this.dateTransform(newdate);
        this.date = this.fileUpload.productDate;
    }
    changeDate(date: Date) {
        if (this.date == date) return;
        if (!date) return;
        let newdate = this.setDate(date);
        if (newdate == undefined) return;
        this.fileUpload.productDate = newdate;
        this.productDate = this.dateTransform(newdate);
        this.date = this.fileUpload.productDate;
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

    //设置日期
    setDate(date) {
        let dateArr = new Date(date).toLocaleDateString().split("/");
        let month = Number(dateArr[1]);
        let year = Number(dateArr[0]);
        let day = Number(dateArr[2]);
        let newDate;
        switch (this.fileUpload.element) {
            case "MONT":
                let now = new Date();
                if (new Date(date).toLocaleDateString() == now.toLocaleDateString()) {
                    newDate = month == 1 ? new Date((year - 1) + "/12/1") : new Date(year + "/" + (month - 1) + "/1");
                } else {
                    newDate = new Date(year + "/" + (month) + "/1");
                }
                break;
            case "TEND":
                if (day > 0 && day < 11) {
                    newDate = new Date(year + "/" + month + "/1");
                } else if (day > 10 && day < 21) {
                    newDate = new Date(year + "/" + month + "/11");
                } else {
                    newDate = new Date(year + "/" + month + "/21");
                }
                break;
            case "WEEK":
                let _day = new Date(date).getDay();
                if (_day == 5) {
                    newDate = date;
                } else if (_day < 5) {
                    newDate = new Date(date.getTime() - (2 + _day) * 24 * 60 * 60 * 1000);
                } else {
                    newDate = new Date(date.getTime() - (_day - 5) * 24 * 60 * 60 * 1000);
                }
                break;
        }
        return newDate;
    }
    getFileNumber(type) {
        this.fileList = new Array();
        let makeCompany = JSON.parse(localStorage.getItem("activeUser"))["area"]["pCode"];
        this.prodService.getProdList(makeCompany, this.dataType, '.*', type).toPromise().then((list: Array<string>) => {
            if (!list) return;
            this.fileList = list;
            this.dataEle = "DEF";
            let resultArr = this.fileList.filter(_list => _list.split("_")[4].substr(0, 8) == this.dateTransform(new Date()).substr(0, 8));
            if (resultArr.length == 0) {
                this.productDate = this.dateTransform(new Date());
            } else {
                let max = Number(resultArr[0].split("_")[4]);
                resultArr.forEach(item => {
                    let index = Number(item.split("_")[4]);
                    if (max > index) return;
                    max = index;
                })
                this.productDate = max.toString();
            }
        }).catch(() => {
            this.fileList = new Array();
        })
    }
}
