import { Component, OnInit, ViewChild } from '@angular/core';
import { BookMarkService } from '../../../../services/bookMark.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import 'style-loader!./bookMark.scss';
import { DetailComponent } from '../detail/detail.component';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'book-mark',
    templateUrl: './bookMark.html',
    
})
export class BookMarkComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    constructor(private modalService: BsModalService, private bookMarkService: BookMarkService,
        private yzNgxToastyService: YzNgxToastyService) {
    };
    public bookMark: Array<any>;
    public settings: Array<any>;
    public MarkType: Array<any>; //书签类型
    public modalRef: BsModalRef;
    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.setting();
        this.getMarkType().then(() => {
            this.getAllMark();
        })
    }
    //获取所有书签
    getAllMark() {
        this.bookMark = new Array();
        this.bookMarkService.getAllMarks().toPromise().then(data => {
            if (!data) return;
            this.bookMark = data;
        })
    }
    //setting设置
    setting() {
        this.settings = new Array();
        this.settings = [
            {
                colId: "bookmarkDesc",
                headerName: '书签描述',
                field: 'bookmarkDesc',
            },
            {
                colId: "bookmarkType",
                headerName: '书签类型',
                field: 'bookmarkType',
                valueFormatter: (val) => this.valueFormatter(val)
            },
            {
                headerName: '操作',
                cellRenderer: "customComponent",
                cellRendererParams: [
                    {
                        value: '详细',
                        callBackFunction: (mark) => this.updateMark(mark)
                    },
                    {
                        value: '删除',
                        callBackFunction: (mark) => {
                            this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
                                if (!e) return;
                                this.deleteMark(mark)
                            });
                        }
                    },
                ]
            },
        ];
    }
    //添加书签
    addMark() {
        this.modalService.config.ignoreBackdropClick = true;
        let modalRef = this.modalService.show(DetailComponent, { class: 'modal-lg detail-modal' });
        modalRef.content.initStationDto("");
        modalRef.content.successChanged.subscribe(param => {
            if (param) {
                this.getAllMark();
            }
        })
    }
    //更新书签
    updateMark(mark) {
        this.modalService.config.ignoreBackdropClick = true;
        let modalRef = this.modalService.show(DetailComponent, { class: 'modal-lg detail-modal' });
        modalRef.content.initStationDto(mark["id"]);
        modalRef.content.successChanged.subscribe(param => {
            if (param) {
                this.getAllMark();
            }
        })
    }
    //删除书签
    deleteMark(mark) {
        this.bookMarkService.deleteBookMark(mark["id"]).toPromise().then(data => {
            if (!data) {
                this.yzNgxToastyService.error("删除书签失败", "", 3000);
                return;
            }
            this.yzNgxToastyService.success("删除书签成功", "", 3000);
            this.getAllMark();
        }).catch(e => {
            this.yzNgxToastyService.error("删除书签失败", "", 3000);
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