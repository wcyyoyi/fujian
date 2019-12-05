import { Component, OnInit } from '@angular/core';

import 'style-loader!./disasterview.scss';
import { SelectItem, AreaInfo } from '../../models';
import { AreaService } from '../../services';
import { AgmeDistService } from '../../services/agmsDist.service';
import { AgmeDist } from '../../models/agmeDist';
import { LocalDataSource } from 'ng2-smart-table';
import { ImgViewerComponent } from '../../businessComponent/imgView/imgViewer.component';
import { BaModal } from '../../../theme/components/baModal';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { DictionaryService } from '../../utils/Dictionary.service';
import { ConverterService } from '../../utils/Converter/converter.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ImgViewerModalComponent } from '../../businessComponent/imgView/imgViewer.modal.component';
import { ProdService } from '../../services/product.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'disaster-view',
    templateUrl: 'disasterview.html',
    entryComponents: [BaModal],
    
})

export class DisasterViewComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    // usernameList = new Array<string>();
    distAreaCodeList = new Array<string>();
    distAreaList = new Array<AreaInfo>();

    areaList: Array<AreaInfo>;
    distList: Array<SelectItem>;

    selUsername: string;
    selDistItem: SelectItem = null;
    selArea: AreaInfo = null;
    date: Date;

    // source: LocalDataSource = new LocalDataSource();
    // settings;
    source = new Array();
    settings = new Array();
    public maxDate = new Date();
    public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD'
    });
    modalRef: BsModalRef;
    constructor(
        private agmeDistServ: AgmeDistService,
        private yzNgxToastyService: YzNgxToastyService,
        private areaService: AreaService,
        private dictionaryService: DictionaryService,
        private converterService: ConverterService,
        private modalService: BsModalService,
        private prodService: ProdService,
    ) { }

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.selUsername = this.agmeDistServ.userName;

        this.getDistList();
        this.getAreaList();
        this.setting();
        this.initSearch();
    }

    getDistList() {
        this.distList = this.dictionaryService.DIST;
    }

    getAreaList() {
        this.areaList = this.dictionaryService.AREA;
    }

    initSearch() {
        this.agmeDistServ.getByFilter(null, null, null, null).subscribe((list: Array<AgmeDist>) => {
            list.forEach(item => {
                // if (this.usernameList.indexOf(item.cUsername) < 0) {
                //     this.usernameList.push(item.cUsername);
                // }
                if (!this.distAreaCodeList.includes(item.cAreaCode)) {
                    this.distAreaCodeList.push(item.cAreaCode);
                    this.areaService.getDetailByCpcode(item.cAreaCode).subscribe((area: AreaInfo) => {
                        if (area.vLevel > this.areaService.level) {
                            this.distAreaList.push(area);
                        }
                        if (this.areaService.makeCompany == item.cAreaCode) {
                            this.distAreaList.push(area);
                            this.selArea = area;
                        }
                    });
                }
            });
            this.search();
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
        if (this.selUsername === '') {
            this.selUsername = null;
        }
        this.yzNgxToastyService.wait("正在查询，请稍后", "");
        this.agmeDistServ.getByFilter(this.selUsername, areaCpcode, distCode, date)
            .toPromise().then((agmeDistList) => {
                let list = new Array();
                agmeDistList.forEach((agmeDist, index) => {
                    let d = new Date();
                    d.setTime(agmeDist.vdate);
                    let item = {
                        id: index + 1,
                        cUsername: agmeDist.cUsername,
                        cAreaCode: this.converterService.areaCPCodeToName(agmeDist.cAreaCode),
                        cDistCode: this.converterService.distCPCodeToName(agmeDist.cDistCode),
                        // cAreaCode: this.utils.code2Label(this.areaList, 'cPCode', agmeDist.cAreaCode, 'cName'),
                        // cDistCode: this.utils.code2Label(this.distList, 'code', agmeDist.cDistCode, 'desc'),
                        vdate: d,
                        imgs: agmeDist.cPhotoId,
                    };

                    list.push(item);
                });
                this.source = list;
                // this.source.load(list);
                this.yzNgxToastyService.close();
            }).catch(() => {
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
                headerName: '灾情地点',
                field: "cAreaCode",
            },
            {
                headerName: '灾情类型',
                field: "cDistCode",
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
