import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MarkContentComponent } from '../../components/markContent/markContent.component';

import { CropItem, CropInfo as CropModel, VaridevInfo, DistInfo } from '../../../models/cropInfo';
import { CropDictService } from '../../../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import '../../../editors/components/ckeditor/ckeditor.loader';
import 'assets/ckeditor/ckeditor';
import 'assets/ckeditor/lang/zh-cn';
import { CKEditorComponent } from '../../../../../../node_modules/ng2-ckeditor';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'crop-info',
    templateUrl: 'cropInfo.html',
    styleUrls: ['./cropInfo.scss'],
    
})

export class CropInfoComponent implements OnInit {
    lgClassLevel: string = 'list-group-level1';
    ctClassLevel: string = 'c-token-level1';
    btnClassLevel: string = 'yz-btn-level1';
    public modalRef: BsModalRef;
    public config = {
        uiColor: '#F0F3F4',
        height: '150',
        toolbar: [],
        contentsCss: [window['CKEDITOR_BASEPATH'] + 'contents.css'],
        forcePasteAsPlainText: true, //默认为忽略格式
    };

    @Input()
    public cropItem: any;
    @Input()
    public cropInfoList: CropModel[];
    @Output()
    public onInfoChanged = new EventEmitter<object>();
    @Output()
    public onDistClicked = new EventEmitter<object>();
    public selCropInfo: CropModel;

    @ViewChild('ckeditor') ckeditor: CKEditorComponent;

    constructor(private modalService: BsModalService, private cropdictServ: CropDictService,
        private yzNgxToastyService: YzNgxToastyService) { }

    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.lgClassLevel = 'list-group-level' + this.cropdictServ.level;
        this.ctClassLevel = 'c-token-level' + this.cropdictServ.level;
        if (this.cropItem && this.cropItem.tag) {
            this.onSelect(this.cropItem.tag);
        }
        else {
            if (this.cropInfoList) this.onSelect(this.cropInfoList[0]);
        }
    }


    onSelect(item): void {
        if (item) {
            this.onInfoChanged.emit(item);
            this.selCropInfo = item;
            this.cropItem.tag = this.selCropInfo;
        }
    }

    onDateRemove(info): void {
        this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
            if (!e) return;
            if (!info || !this.cropInfoList)
                return;

            if (info.id) {
                this.cropdictServ.deleteExpEle(info.id).toPromise().then(res => {
                    if (res) {
                        this.cropInfoList.splice(this.cropInfoList.indexOf(info), 1);
                        // 刪除指标数据
                        if (info.dists && info.dists.length > 0) {
                            info.dists.forEach(di => {
                                this.onDistRemove(di);
                            });
                        }

                        this.updateSelectInfo(info);
                    }
                });
            } else {
                this.cropInfoList.splice(this.cropInfoList.indexOf(info), 1);
                this.updateSelectInfo(info);
            }
        });
    }

    updateSelectInfo(info: CropModel) {
        if (this.cropInfoList.length > 0) {
            if (info === this.selCropInfo)
                this.onSelect(this.cropInfoList[0]);
        }
        else {
            this.selCropInfo = null;
            this.cropItem.tag = null;
        }
    }

    onVaridevRemove(item): void {
        this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
            if (!e) return;
            if (!this.selCropInfo)
                return;
            this.selCropInfo.varidevs.splice(this.selCropInfo.varidevs.indexOf(item), 1);
        });
    }

    onDistClick(item): void {
        if (item) {
            this.onDistClicked.emit(item);
        }
    }

    onDistRemove(item): void {
        this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
            if (!e) return;
            if (!this.selCropInfo)
                return;

            if (item.id) {
                this.cropdictServ.deleteIdxEle(item.id).toPromise().then(res => {
                    if (res)
                        this.selCropInfo.dists.splice(this.selCropInfo.dists.indexOf(item), 1);
                });
            } else {
                this.selCropInfo.dists.splice(this.selCropInfo.dists.indexOf(item), 1);
            }
        });
    }
    //向书签之中加入内容
    addMarkContent(content) {
        this.modalService.config.ignoreBackdropClick = true;
        let modalRef = this.modalService.show(MarkContentComponent, { class: 'modal-lg detail-modal' });
        modalRef.content.initStationDto(content);
    }
}