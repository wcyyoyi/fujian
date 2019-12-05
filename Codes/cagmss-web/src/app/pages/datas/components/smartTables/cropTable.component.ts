import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataState } from '../../datas.state';
import { LocalDataSource } from 'ng2-smart-table';

import 'style-loader!./smartTables.scss';

@Component({
    selector: 'crop-table',
    templateUrl: 'cropTable.html'
})

export class CropTable implements AfterViewInit {
    customSettings: any;
    devSettings: any;
    service: any;
    source: LocalDataSource = new LocalDataSource();
    devSource: LocalDataSource = new LocalDataSource();
    selCrop: string;

    constructor(private route: ActivatedRoute, private state: DataState) { }

    ngAfterViewInit() {
        this.route.params.subscribe((params: Params) => {
            let tabName = params['name'];
            this.customSettings = this.state[tabName];
            this.source.empty();

            this.devSettings = this.state['dev'];
            this.devSource.empty();

            this.service = this.customSettings.service;
            this.refreshCrop();
        });
    }

    onDeleteConfirm(event): void {
        let info = event.data;

        if (window.confirm('确定删除【' + info.cCropname + '】这条记录?')) {
            this.service.deleteCrop(info.cCode).then(result => {
                if (result) {
                    alert('【' + info.cCropname + '】删除成功！');
                    event.confirm.resolve();
                } else {
                    alert('删除失败！' + JSON.stringify(result));
                    event.confirm.reject();
                }
            });
        } else {
            event.confirm.reject();
        }
    }

    onEditConfirm(event): void {
        //let oldInfo = event.data;
        let info = event.newData;

        if (window.confirm('确定保存【' + info.cCropname + '】这条记录?')) {
            this.service.updateCrop(info).then(result => {
                if (result) {
                    alert('【' + info.cCropname + '】保存成功！');
                    event.confirm.resolve();
                } else {
                    alert('保存失败！' + JSON.stringify(result));
                    event.confirm.reject();
                }
            });
        } else {
            event.confirm.reject();
        }
    }

    onCreateConfirm(event): void {
        let info = event.newData;

        if (window.confirm('确定添加【' + info.cCropname + '】这条记录?')) {
            this.service.createCrop(info).then(result => {
                if (result) {
                    alert('【' + info.cCropname + '】添加成功！');
                    event.confirm.resolve();
                    this.refreshCrop();
                } else {
                    alert('添加失败！' + JSON.stringify(result));
                    event.confirm.reject();
                }
            });
        } else {
            event.confirm.reject();
        }
    }

    onDevDeleteConfirm(event): void {
        let info = event.data;

        if (window.confirm('确定删除【' + info.cCorpdev + '】这条记录?')) {
            let key = '{"cCode":"' + info.cCode + '","cCrop":"' + info.cCrop + '"}';
            this.service.deleteDev(key).then(result => {
                if (result) {
                    alert('【' + info.cCorpdev + '】删除成功！');
                    event.confirm.resolve();
                } else {
                    alert('删除失败！' + JSON.stringify(result));
                    event.confirm.reject();
                }
            });
        } else {
            event.confirm.reject();
        }
    }

    onDevEditConfirm(event): void {
        let oldInfo = event.data;
        let info = event.newData;
        console.log(oldInfo);
        if (window.confirm('确定保存【' + info.cCorpdev + '】这条记录?')) {
            this.service.updateDev(info).then(result => {
                if (result) {
                    alert('【' + info.cCorpdev + '】保存成功！');
                    event.confirm.resolve();
                } else {
                    alert('保存失败！' + JSON.stringify(result));
                    event.confirm.reject();
                }
            });
        } else {
            event.confirm.reject();
        }
    }

    onDevCreateConfirm(event): void {
        let info = event.newData;

        if (window.confirm('确定添加【' + info.cCorpdev + '】这条记录?')) {
            this.service.createDev(info).then(result => {
                if (result) {
                    alert('【' + info.cCorpdev + '】添加成功！');
                    event.confirm.resolve();
                    this.refreshDev(this.selCrop);
                } else {
                    alert('添加失败！' + JSON.stringify(result));
                    event.confirm.reject();
                }
            });
        } else {
            event.confirm.reject();
        }
    }

    onRowSelected(event): void {
        let info = event.data;

        if (this.selCrop != info.cCrop) {
            this.selCrop = info.cCrop;
            this.refreshDev(this.selCrop);
        }
    }

    refreshCrop(): void {
        this.service.getAllCrops().subscribe(data => {
            if (!data) return;

            this.source.load(data);
        });
    }

    refreshDev(crop: string): void {
        this.service.getDevInfo(crop).subscribe(data => {
            if (!data) return;

            this.devSource.load(data);
        });
    }
}