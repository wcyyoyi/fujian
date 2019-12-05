import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { MasterplateService } from '../../../../services/masterplate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WordService } from '../../../../services/word.service';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { MetaService } from '../../../../services/meta.service';
import { ProdService } from '../../../../services/product.service';
import { TEMPLATE_MENU } from '../template/template.menu';

@Component({
    selector: 'modal-manage',
    templateUrl: './modalManage.html',
    styleUrls: ['./modalManage.scss'],
    
})
export class ModalManageComponent implements OnInit {
    public form: FormGroup;
    public unit: AbstractControl;
    public detail: AbstractControl;
    public element: AbstractControl;
    public date: AbstractControl;
    public source: Array<any>;
    public settings: Array<any>;
    public currentObject: object;
    public elementList: Array<any>; //数据要素列表
    public typeList: Array<any>; //数据内容列表
    public unitList: Array<any>; //制作单位列表
    public selDetail: string;
    public selUnit: string;
    public selElement: string;
    btnClassLevel: string = 'yz-btn-level1';
    constructor(fb: FormBuilder, private router: Router, private masterplateService: MasterplateService
        , private wordService: WordService, private metaService: MetaService, private prodService: ProdService,
        private yzNgxToastyService: YzNgxToastyService) {
        this.form = fb.group({
            'unit': ['', Validators.compose([Validators.required])],
            'detail': ['', Validators.compose([Validators.required])],
            'element': ['', Validators.compose([])],
            'date': ['', Validators.compose([])],
        })
        this.unit = this.form.controls['unit'];
        this.detail = this.form.controls['detail'];
        this.element = this.form.controls['element'];
        this.date = this.form.controls['date'];
    }

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.setting();
        this.elementList = new Array();
        this.elementList = TEMPLATE_MENU;
        if (this.elementList[0]["name"] != "全部") {
            let element = { "name": "全部", "element": "all" };
            this.elementList.unshift(element);
        }
        this.selElement = this.elementList[0]["name"];
        let promiseArr = new Array<Promise<any>>()
        promiseArr.push(this.getDataDetail());
        Promise.all(promiseArr).then(() => {
            this.getElement();
        })

    }
    onSubmit(value) {
        this.currentObject = value;
        this.getAllTemplate();
    }
    getAllTemplate() {
        this.source = new Array();
        let detail = this.typeList.find(type => type["desc"] == this.currentObject['detail']);
        let unit = this.unitList.find(unit => unit["cName"] == this.currentObject['unit']);
        let element = this.elementList.find(element => element["name"] == this.currentObject['element']);
        this.masterplateService.getAllTemlate(detail['value'], unit["cCode"]).subscribe(data => {
            if (!data) return;
            if (element["element"] == "all") {
                this.source = data;
            } else {
                let arr = new Array();
                arr = data.filter(item => item["name"].split("_")[8] == element["element"]);
                this.source = arr;
            }
        })
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
            this.selDetail = this.typeList[0]["desc"];
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
                    this.selUnit = this.unitList.find(unit => unit["cCode"] == code)["cName"];
                    this.currentObject = { "unit": this.selUnit, "detail": this.selDetail, "element": this.selElement };
                    this.getAllTemplate();
                })
            })
        })
    }
    setting() {
        this.settings = [
            {
                headerName: '详情',
                field: "desc",
            },
            {
                headerName: '操作',
                cellRenderer: "customComponent",
                cellRendererParams: [
                    {
                        value: '查看',
                        callBackFunction: (prod) => this.templateDetail(prod, 'watch')
                    },
                    {
                        value: '删除',
                        callBackFunction: (prod) => {
                            this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
                                if (!e) return;
                                this.deleteTemplate(prod)
                            });
                        }
                    },
                    {
                        value: '以此为基础模版',
                        callBackFunction: (prod) => this.templateDetail(prod, 'select')
                    },
                ]
            },
        ]
    }
    deleteTemplate(param) {
        let paramArr = param["name"].split("_")
        this.wordService.deleteHtml(paramArr[3], paramArr[7], paramArr[8], paramArr[4]).then((data) => {
            if (data) {
                this.yzNgxToastyService.success('删除成功', '', 3000);
                this.getAllTemplate();
            } else {
                this.yzNgxToastyService.error('删除失败', '', 3000);
            }
        })
    }
    templateDetail(param, option) {
        let object = new Object();
        object["name"] = param["name"];
        object["option"] = option;
        this.router.navigate(['/pages/account/temlateDetail', object]);
    }
}