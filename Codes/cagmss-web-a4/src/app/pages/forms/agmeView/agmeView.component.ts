import { Component, OnInit, ViewChild } from '@angular/core';

import 'style-loader!./agmeView.scss';
import { SelectItem, AreaInfo, CropInfo } from '../../models';
import { CropDictService, AreaService } from '../../services';
import { LocalDataSource } from 'ng2-smart-table';
import { Utils } from '../../utils/utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ProdService } from '../../services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImgViewerComponent } from '../../businessComponent/imgView/imgViewer.component';
import { AgmeRealEle } from '../../models/agmeRealEle';
import { AgmeRealEleService } from '../../services/agmeRealEle.service';
import { BaModal, BaGrid } from '../../../theme/components';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ImgViewerModalComponent } from '../../businessComponent/imgView/imgViewer.modal.component';

@Component({
    selector: 'agme-view',
    templateUrl: 'agmeView.html',
    entryComponents: [BaModal],
    

})

export class AgmeViewComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD'
    });
    // usernameList = new Array<string>();
    cropAreaCodeList = new Array<string>();
    cropAreaList = new Array<AreaInfo>();
    cropNameList = new Array<CropInfo>();
    cropCodeList = new Array<string>();

    areaList: Array<AreaInfo>;
    cropList: Array<CropInfo>;

    selUsername: string;
    selCropItem: SelectItem = null;
    selArea: AreaInfo = null;
    selCrop;
    date: Date;

    source = new Array();
    settings = new Array();

    @ViewChild('grid') grid: BaGrid;
    public now = new Date();

    utils = new Utils();

    modalRef: BsModalRef;
    constructor(
        private agmeRealEleServ: AgmeRealEleService,
        private areaService: AreaService,
        private yzNgxToastyService: YzNgxToastyService,
        private modalService: BsModalService,
        private prodService: ProdService,
    ) { }

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.selUsername = this.agmeRealEleServ.userName;
        this.getCropList();
        this.setting();
    }

    getCropList() {
        this.agmeRealEleServ.getCropList().subscribe(data => {
            this.cropList = data;
            this.getAreaList();
        });
    }

    getAreaList() {
        this.areaList = JSON.parse(localStorage.getItem('AREA'))
        this.initSearch();
    }

    initSearch() {
        this.agmeRealEleServ.getByFilter(null, null, null, null).subscribe((list: Array<AgmeRealEle>) => {
            list.forEach(item => {
                // if (this.usernameList.indexOf(item.cUsername) < 0) {
                //     this.usernameList.push(item.cUsername);
                // }
                if (this.cropAreaCodeList.indexOf(item.cAreaCode) < 0) {
                    this.cropAreaCodeList.push(item.cAreaCode);
                    this.areaService.getDetailByCpcode(item.cAreaCode).subscribe((area: AreaInfo) => {
                        if (area.vLevel > this.areaService.level) {
                            this.cropAreaList.push(area);
                        }
                        if (this.areaService.makeCompany == item.cAreaCode) {
                            this.cropAreaList.push(area);
                            this.selArea = area;
                        }
                    });
                }
                if (this.cropCodeList.indexOf(item.cCropCode) < 0) {
                    this.cropCodeList.push(item.cCropCode);
                    this.agmeRealEleServ.getNameByCode(item.cCropCode).subscribe((crop) => {
                        this.cropNameList.push(crop);
                    });
                }
            });

            this.search();
        });

    }

    onAreaChange(item: AreaInfo) {
        this.selArea = item;
    }

    onCropItemChange(item: AgmeRealEle) {
        this.selCrop = item;
    }

    search() {
        let areaCpcode = null;
        let cropCode = null;
        let date = null;
        if (this.selArea) {
            areaCpcode = this.selArea.cPCode.toString();
        }
        if (this.selCrop) {
            cropCode = this.selCrop.cCode;
        }
        if (this.date) {
            date = this.date.toLocaleDateString();
        }
        if (this.selUsername === '') {
            this.selUsername = null;
        }
        this.yzNgxToastyService.wait("正在查询，请稍后", "");
        this.agmeRealEleServ.getByFilter(this.selUsername, areaCpcode, cropCode, date)
            .subscribe((agmeCropList) => {
                let list = new Array();
                let map1 = this.utils.getMap(this.areaList, 'cPCode', 'cName');
                let map2 = this.utils.getMap(this.cropList, 'cCode', 'cName');
                agmeCropList.forEach((agmeCrop, index) => {
                    let d = new Date();
                    d.setTime(agmeCrop.vdate);
                    let item = {
                        id: index + 1,
                        cUsername: agmeCrop.cUsername,
                        cAreaCode: map1.get(agmeCrop.cAreaCode),
                        cCropCode: map2.get(agmeCrop.cCropCode),
                        vdate: d,
                        imgs: agmeCrop.cPhotoId,
                    };
                    list.push(item);
                });
                // this.source.load(list);

                this.source = list;
                this.yzNgxToastyService.close();
            });
    }

    setting() {
        this.settings = [
            {
                headerName: '序号',
                field: "id",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '上报人员',
                field: "cUsername",

            },
            {
                headerName: '农业观测地点',
                field: "cAreaCode",
            },
            {
                headerName: '作物类型',
                field: "cCropCode",
            },
            {
                headerName: '上报时间',
                field: "vdate",
                filter: "agDateColumnFilter",
                valueFormatter: (item) => item.value.toLocaleDateString(),
            },
            {
                headerName: '操作',
                cellRenderer: "customComponent",
                cellRendererParams: [
                    {
                        value: '查看',
                        callBackFunction: (prod) => this.imgView(prod)
                    },
                ]
            },

        ]
    }

    imgView(prod) {
        let imgList = prod.imgs.split(',');
        let arr = new Array<{ url: string, label: string }>();
        imgList.forEach(img => {
            let obj = {
                url: this.prodService.getUrl(img),
                label: ''
            }
            arr.push(obj);
        });

        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(ImgViewerModalComponent, { class: 'modal-lg img-modal-dialog' });
        this.modalRef.content.imgList = arr;
        this.modalRef.content.view();
    }
}
