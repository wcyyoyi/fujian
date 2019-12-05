import { Component, OnInit } from '@angular/core';

import 'style-loader!./disasterview.scss';
import { SelectItem, AreaInfo, DistInfo } from '../../models';
import { CropDictService, AreaService } from '../../services';
import { AgmeDistService } from '../../services/agmsDist.service';
import { AgmeDist } from '../../models/agmeDist';
import { LocalDataSource } from 'ng2-smart-table';
import { Utils } from '../../utils/utils';
import { ImgViewerModalComponent } from '../../businessComponent/imgView/imgViewer.modal.component';
import { ImgViewerComponent } from '../../businessComponent/imgView/imgViewer.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'disaster-view',
    templateUrl: 'disasterview.html',
})

export class DisasterViewComponent implements OnInit {
    usernameList = new Array<string>();
    distAreaCodeList = new Array<string>();
    distAreaList = new Array<AreaInfo>();

    areaList: Array<AreaInfo>;
    distList: Array<SelectItem>;

    selUsername: string;
    selDistItem: SelectItem = null;
    selArea: AreaInfo = null;
    date: Date;

    source: LocalDataSource = new LocalDataSource();
    settings;

    utils = new Utils();
    modalRef: BsModalRef;

    constructor(
        private cropdictServ: CropDictService,
        private agmeDistServ: AgmeDistService,
        private areaService: AreaService,
        private _sanitizer: DomSanitizer,
        private modalService: BsModalService
    ) { }

    ngOnInit(): void {
        this.getDistList();
        this.getAreaList();
        this.initSearch();
        this.setting();
    }

    getDistList() {
        this.cropdictServ.getDistInfo().subscribe(data => {
            if (!data) return;
            this.distList = new Array<SelectItem>();
            for (let info of data) {
                let item = new SelectItem();
                item.code = info.cCode;
                item.desc = info.cDisastername;
                this.distList.push(item);
            }
            // this.selDistItem = this.distList[0];
        });
    }

    getAreaList() {
        this.areaService.getAll().subscribe((list) => {
            this.areaList = list;
        });
    }

    initSearch() {
        this.agmeDistServ.getByFilter(null, null, null, null).subscribe((list: Array<AgmeDist>) => {
            list.forEach(item => {
                if (this.usernameList.indexOf(item.cUsername) < 0) {
                    this.usernameList.push(item.cUsername);
                }
                if (this.distAreaCodeList.indexOf(item.cAreaCode) < 0) {
                    this.distAreaCodeList.push(item.cAreaCode);
                    this.areaService.getDetailByCpcode(item.cAreaCode).subscribe((area: AreaInfo) => {
                        this.distAreaList.push(area);
                    });
                    // console.log(this.utils.code2Label(areaList, 'cPCode', item.cAreaCode, 'cName'));
                }
            });

        });
    }

    onAreaChange(item: AreaInfo) {
        this.selArea = item;
    }

    onDistItemChange(item: SelectItem) {
        this.selDistItem = item;
    }

    search() {
        let areaCpcode = null;
        let distCode = null;
        let date = null;
        if (this.selArea) {
            areaCpcode = this.selArea.cPCode.toString();
        }
        if (this.selDistItem) {
            distCode = this.selDistItem.code;
        }
        if (this.date) {
            date = this.date.toLocaleDateString();
        }
        this.agmeDistServ.getByFilter(this.selUsername, areaCpcode, distCode, date)
            .subscribe((agmeDistList) => {
                let list = new Array();
                agmeDistList.forEach((agmeDist, index) => {
                    let d = new Date();
                    d.setTime(agmeDist.vdate);
                    let item = {
                        id: index + 1,
                        cUsername: agmeDist.cUsername,
                        cAreaCode: this.utils.code2Label(this.areaList, 'cPCode', agmeDist.cAreaCode, 'cName'),
                        cDistCode: this.utils.code2Label(this.distList, 'code', agmeDist.cDistCode, 'desc'),
                        vdate: d.toLocaleDateString(),
                        imgs: agmeDist.cPhotoId,
                    };
                    list.push(item);
                });
                this.source.load(list);
            });
    }

    setting() {
        this.settings = {
            columns: {
                id: {
                    title: '序号',
                    sort: false,
                    filter: false,
                },
                cUsername: {
                    title: '上报人员',
                    sort: false,
                },
                cAreaCode: {
                    title: '灾情地点',
                },
                cDistCode: {
                    title: '灾情类型',
                },
                vdate: {
                    title: '上报时间',
                },
                imgs: {
                    title: '操作',
                    type: 'custom',
                    filter: false,
                    sort: false,
                    renderComponent: ImgViewerComponent,
                    onComponentInitFunction: (instance: ImgViewerComponent) => {
                        console.log(instance.imgList);
                    }
                },
            },
            actions: {
                add: false,
                edit: false,
                delete: false
            },
        };
    }

    showImgViewerModal(id) {
        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(ImgViewerModalComponent);
    }
}
