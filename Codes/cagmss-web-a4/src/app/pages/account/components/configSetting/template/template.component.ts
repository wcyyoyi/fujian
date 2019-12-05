import { Component, OnInit, Directive, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import '../../../../editors/components/ckeditor/ckeditor.loader';
import 'assets/ckeditor/ckeditor';
import 'assets/ckeditor/lang/zh-cn';
import { WordService } from '../../../../services/word.service';
import { ProdService } from '../../../../services/product.service';
import { CKEditorComponent } from 'ng2-ckeditor';
import { YzNgxToastyService} from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { SaveModalComponent } from '../saveModal/saveModal.component';
import { BookMarkService } from '../../../../services/bookMark.service';

@Component({
    selector: 'template-detail',
    templateUrl: './template.html',
    styleUrls: ['./template.scss'],
    
})
export class TemplateDetailComponent implements AfterViewInit {
    modalRef: BsModalRef;
    @ViewChild('sBtn') sBtn;
    @ViewChild('ckeditor') ckeditor: CKEditorComponent;
    btnClassLevel: string = 'yz-btn-level1';
    public templateName: string;  //模版名称
    public dataElementCode: string; //数据要素
    public dataType: string;  //数据内容
    public makeCompany: string;  //制作单位
    public productDate: string;  //产品时间
    public htmlCode: any;  //模版html
    public ckeditorContent: string = ``;  //富文本插件内容
    public paramArr: Array<any>;
    public markArr: Array<any>;
    public option: string;   //当前操作产看或者以此为模版
    public data_url: string;
    public content: string;
    public status: boolean;
    public length: number;
    public MarkType: Array<any>;
    public _config = {
        uiColor: '#F0F3F4',
        // height: '400px',
        height: 'calc(100% - 72px)',
        bodyClass: 'document-editor',
        contentsCss: [window['CKEDITOR_BASEPATH'] + 'mystyles.css'],
    };
    constructor(private bookMarkService: BookMarkService,
        private wordService: WordService,
        private _route: ActivatedRoute,
        private yzNgxToastyService: YzNgxToastyService,
        private prodService: ProdService,
        private modalService: BsModalService,
    ) {
    }
    ngAfterViewInit(): void {
        this.status = false;
        this.length = 0;
        this.content = "显示书签列表";
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.data_url = JSON.parse(localStorage.getItem("activeUser"))["area"]["serviceUrl"];
        this.ckeditor.ready.subscribe(() => {
            this.templateName = this._route.params["_value"]["name"];
            this.option = this._route.params["_value"]["option"];
            this.getMarkType().then(() => {
                this.settings();
                this.getBookMark();
                this.getHtml();
            })
        });
    }
    changeStatus() {
        if (this.status) {
            this.content = "显示书签列表";
        } else {
            this.content = "隐藏书签列表";
        }
        this.status = !this.status;
    }
    //保存模版内容
    save() {
        this.htmlCode = this.ckeditorContent;
        while (this.htmlCode.indexOf(this.data_url) >= 0) {
            this.htmlCode = this.htmlCode.replace(this.data_url, '[$service_ip]');
        }
        this.wordService.saveTemplate(this.dataElementCode, this.dataType, this.htmlCode, this.makeCompany, this.productDate).then(data => {
            if (data) {
                this.yzNgxToastyService.success('保存成功', '', 3000);
            } else {
                this.yzNgxToastyService.error('保存失败', '', 3000);
            }
        });
    }
    anotherSave() {
        this.htmlCode = this.ckeditorContent;
        while (this.htmlCode.indexOf(this.data_url) >= 0) {
            this.htmlCode = this.htmlCode.replace(this.data_url, '[$service_ip]');
        }
        this.modalService.config.ignoreBackdropClick = true;
        let modalRef = this.modalService.show(SaveModalComponent, { class: 'modal-lg detail-modal' });
        modalRef.content.initStationDto(this.htmlCode, this.paramArr);
    }
    //根据模版名称获取模版内容
    getHtml() {
        this.wordService.getHtmlByName(this.templateName).then(data => {
            this.yzNgxToastyService.wait("正在加载，请稍后…", "");
            // this.ckeditorContent = this.prodService.replaceHtml(data) + ``;
            data.replace(/\[\$service_ip\]/g, this.data_url);
            this.ckeditorContent = data + ``;
            this.yzNgxToastyService.close();
        })
    }
    //模版获取书签
    getBookMark() {
        this.markArr = new Array();
        this.wordService.getBookMark(this.dataElementCode, this.dataType, this.makeCompany).subscribe(data => {
            if (!data) return;
            this.markArr = data;
            this.markArr.forEach(mark => {
                let item = this.MarkType.find(type => type["code"] == mark["bookmarkType"]);
                mark["type"] = item ? item["desc"] : "";
            })
            this.length = this.markArr.length;
        })
    }
    //基本设置
    settings() {
        let paramArr = this.templateName.split("_");
        this.paramArr = this.templateName.split("_");
        this.dataElementCode = paramArr[8];
        this.dataType = paramArr[7];
        this.makeCompany = paramArr[3];
        this.productDate = paramArr[4];
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