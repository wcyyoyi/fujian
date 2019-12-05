import { Component, Input, ViewChild, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { BookMark } from '../../../../models/bookMark';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { BookMarkService } from '../../../../services/bookMark.service';
@Component({
    selector: 'data-detail',
    templateUrl: 'detail.html',
    styleUrls: ['detail.scss'],
    
})
export class DetailComponent {
    public successChanged = new EventEmitter<any>();  //添加与更新操作完成之后执行
    btnClassLevel: string = 'yz-btn-level1';
    public bookMark = new BookMark();   //书签
    public title: string;      //标题
    public option: string;     //当前操作'add'/'update'
    public MarkType: Array<any>;   //书签类型列表
    public templateType: Array<any>;   //模版类型列表
    public nowTemplateType: number;   //当前模版版类型
    //书签表单验证
    public form: FormGroup;
    public bookmarkType: AbstractControl;
    public bookmarkDesc: AbstractControl;
    public bookmarkContent: AbstractControl;
    public selTemplateType: AbstractControl;
    constructor(private bookMarkService: BookMarkService, fb: FormBuilder, public bsModalRef: BsModalRef,
        private yzNgxToastyService: YzNgxToastyService) {
        this.form = fb.group({
            'bookmarkType': ['', Validators.compose([Validators.required])],
            'bookmarkDesc': ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
            'bookmarkContent': [''],
            'selTemplateType': [''],
        });
        this.bookmarkType = this.form.controls['bookmarkType'];
        this.bookmarkDesc = this.form.controls['bookmarkDesc'];
        this.bookmarkContent = this.form.controls['bookmarkContent'];
        this.selTemplateType = this.form.controls['selTemplateType'];
    }
    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.getMarkType();
        this.templateType = [{ "value": 1, "desc": "月" }, { "value": 2, "desc": "旬" }, { "value": 3, "desc": "周" }, { "value": 4, "desc": "春耕春播" }, { "value": 5, "desc": "夏收夏种" }, { "value": 6, "desc": "秋收秋种" }];
        this.nowTemplateType = 1;    //默认模版类型为月报
    }
    initStationDto(id) {
        this.bookMark = new BookMark();
        this.option = id ? 'update' : 'add';
        this.title = id ? '修改书签' : '添加书签';
        if (id) {
            this.option = 'update';
            this.getMarkById(id);
        }
    }
    //提交
    public onSubmit(values: Object): void {
        if (!this.form.valid) return;
        if (this.option == 'add') {
            this.addBookMark();
        } else {
            this.bookMark.bookmarkType = values["bookmarkType"];
            this.updateBookMark();
        }
    }
    //根据id获取书签
    getMarkById(id) {
        this.bookMarkService.getBookMarkById(id).toPromise().then(data => {
            if (!data) return;
            for (let key in data) {
                this.bookMark[key] = data[key]
            }
        })
    }
    //获取书签类型枚举
    getMarkType() {
        this.MarkType = new Array();
        this.bookMarkService.getBookMarkList().subscribe(data => {
            if (!data) return;
            this.MarkType = data;
            if (this.option == 'add') {
                this.bookMark.bookmarkType = this.MarkType[0]["code"];
            }
        })
    }
    //添加书签
    addBookMark() {
        this.bookMarkService.createBookMark(this.bookMark.bookmarkType, this.bookMark.bookmarkContent, this.bookMark.bookmarkDesc, this.nowTemplateType).toPromise().then(data => {
            if (!data) {
                this.yzNgxToastyService.error("添加书签失败", "", 3000);
                return;
            }
            this.successChanged.emit(true);
            this.bsModalRef.hide();
            this.yzNgxToastyService.success("添加书签成功", "", 3000);
        }).catch(e => {
            this.yzNgxToastyService.error("添加书签失败", "", 3000);
        })
    }
    //修改书签
    updateBookMark() {
        this.bookMarkService.updateBookMark(this.bookMark).toPromise().then(data => {
            if (!data) {
                this.yzNgxToastyService.error("修改书签失败", "", 3000);
                return;
            }
            this.successChanged.emit(true);
            this.bsModalRef.hide();
            this.yzNgxToastyService.success("修改书签成功", "", 3000);
        }).catch(e => {
            this.yzNgxToastyService.error("修改书签失败", "", 3000);
        })
    }
}