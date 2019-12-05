import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CropItem, CropInfo as CropModel, VaridevInfo, DistInfo } from '../../../models/cropInfo';
import { CropDictService } from '../../../services';

import '../../../editors/components/ckeditor/ckeditor.loader';
import 'assets/ckeditor/ckeditor';
import 'assets/ckeditor/lang/zh-cn';

@Component({
    selector: 'crop-info',
    templateUrl: 'cropInfo.html',
    styleUrls: ['./cropInfo.scss']
})

export class CropInfo implements OnInit {
    public config = {
        uiColor: '#F0F3F4',
        height: '150',
        toolbar: [
            ['NewPage', 'Preview', '-', 'Templates'],
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
            ['Bold', 'Italic'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
        ]
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

    constructor(private cropdictServ: CropDictService) { }

    ngOnInit() {
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
        if (!info || !this.cropInfoList)
            return;

        if (info.id) {
            this.cropdictServ.deleteExpEle(info.id).then(res => {
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
        if (!this.selCropInfo)
            return;
        this.selCropInfo.varidevs.splice(this.selCropInfo.varidevs.indexOf(item), 1);
    }

    onDistClick(item): void {
        if (item) {
            this.onDistClicked.emit(item);
        }
    }

    onDistRemove(item): void {
        if (!this.selCropInfo)
            return;

        if (item.id) {
            this.cropdictServ.deleteIdxEle(item.id).then(res => {
                if (res)
                    this.selCropInfo.dists.splice(this.selCropInfo.dists.indexOf(item), 1);
            });
        } else {
            this.selCropInfo.dists.splice(this.selCropInfo.dists.indexOf(item), 1);
        }

    }
}