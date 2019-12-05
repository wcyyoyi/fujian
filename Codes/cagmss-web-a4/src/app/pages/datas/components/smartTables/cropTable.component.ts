import { Component, AfterViewInit, ViewChild } from '@angular/core';
import 'style-loader!./cropTable.scss';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { StationService, CropDictService } from '../../../services';
import { DictionaryService } from '../../../utils/Dictionary.service';
import { BaGrid } from '../../../../theme/components';
import { DetailComponent } from '../detail/detail.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { cropManage, cropDelevolment } from '../../../models/cropInfo';
@Component({
    selector: 'crop-table',
    templateUrl: 'cropTable.html',
    
})
export class CropTable implements AfterViewInit {
    public settings: Array<any>;
    public _settings: Array<any>;
    public cropSource: Array<any>;
    public developmentSource: Array<any>;
    public cropList: Array<any>;  //作物列表
    public selCrop: string;   //当前所选作物
    public modalRef: BsModalRef;
    public crop = new cropManage();   //作物
    public cropDev = new cropDelevolment();  //发育期
    public btnClassLevel: string = 'yz-btn-level1';
    @ViewChild('grid') baGrid: BaGrid;
    constructor(
        private modalService: BsModalService,
        private yzNgxToastyService: YzNgxToastyService,
        private stationService: StationService,
        private dictionaryService: DictionaryService,
        private cropDictService: CropDictService
    ) { }
    ngAfterViewInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.cropSettings();
        this.developmentSettinga();
        this.getAllCrop();
    }
    //删除作物
    deleteCrop(event): void {
        this.yzNgxToastyService.wait("正在删除作物请稍后", "");
        this.cropDictService.deleteCrop(event.cCode).toPromise().then(result => {
            this.yzNgxToastyService.close();
            if (!result) {
                this.yzNgxToastyService.error("删除作物失败", "", 3000);
                return;
            }
            this.updateE001().then(data => {
                this.yzNgxToastyService.success("删除作物成功", "", 3000);
                this.getAllCrop();
            })
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("删除作物失败", "", 3000);
        })
    }
    //删除作物发育期
    deleteDevelopment(event): void {
        this.yzNgxToastyService.wait("正在删除作物发育期请稍后", "");
        this.cropDictService.deleteDev(event).then(result => {
            this.yzNgxToastyService.close();
            if (!result) {
                this.yzNgxToastyService.error("删除作物发育期失败", "", 3000);
                return;
            }
            this.updateE009().then(data => {
                this.yzNgxToastyService.success("删除作物发育期成功", "", 3000);
                this.getDevelopmentByCrop(this.selCrop);
            })
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("删除作物发育期失败", "", 3000);
        })
    }
    //获取作物
    getAllCrop(): void {
        let e001List = new Array();
        this.stationService.getIdsByArea(Number(this.stationService.areaCode), this.stationService.level)
            .then((stations: Array<number>) => {
                // 根据选择区域所在站点查找对应作物
                this.stationService.getCrops(stations.join(',')).then(crops => {
                    let cropNameArr = new Array();
                    crops.forEach(crop => {
                        if (!cropNameArr.includes(crop.cCropname)) {
                            cropNameArr.push(crop.cCropname);
                            let param = this.dictionaryService.E001.filter(e001 => e001.cCropname == crop.cCropname)[0];
                            if (param == undefined) return;
                            e001List.push(param);
                        }
                    });
                    this.cropSource = new Array();
                    this.cropSource = e001List;
                    this.cropList = new Array();
                    e001List.forEach(item => {
                        if (item == undefined) return;
                        if (this.cropList.includes(item.cCropname)) return;
                        this.cropList.push(item.cCropname)
                    })
                    this.selCrop = this.cropList[0];
                    this.getDevelopmentByCrop(this.selCrop);
                });
            })
    }
    //根据作物名称获取发育期
    getDevelopmentByCrop(crop: string): void {
        this.cropDictService.getDevInfo(crop).subscribe(data => {
            if (!data) return;
            this.developmentSource = new Array();
            this.developmentSource = data;
        });
    }
    //作物管理setting
    cropSettings() {
        this.settings = new Array();
        this.settings = [
            {
                colId: "cCrop",
                headerName: '作物分类',
                field: 'cCrop',
            },
            {
                colId: "cCropname",
                headerName: '作物名称',
                field: 'cCropname',
            },
            {
                colId: "cCropvirteties",
                headerName: '作物品种',
                field: 'cCropvirteties',
            },
            {
                colId: "cCropmature",
                headerName: '作物熟性',
                field: 'cCropmature',
            },
            {
                headerName: '操作',
                cellRenderer: "customComponent",
                cellRendererParams: [
                    {
                        value: '修改',
                        callBackFunction: (prod) => this.detail(prod, 'update', 'cropManage')
                    },
                    {
                        value: '删除',
                        callBackFunction: (prod) => {
                            this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
                                if (!e) return;
                                this.deleteCrop(prod)
                            });
                        }
                    },
                ]
            },

        ];
    }
    //作物发育期setting
    developmentSettinga() {
        this._settings = new Array();
        this._settings = [
            {
                colId: "cCrop",
                headerName: '作物',
                field: 'cCrop',
            },
            {
                colId: "cCorpdev",
                headerName: '发育期',
                field: 'cCorpdev',
            },
            {
                headerName: '操作',
                cellRenderer: "customComponent",
                cellRendererParams: [
                    {
                        value: '修改',
                        callBackFunction: (prod) => this.detail(prod, 'update', 'cropDevelopment')
                    },
                    {
                        value: '删除',
                        callBackFunction: (prod) => {
                            this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
                                if (!e) return;
                                this.deleteDevelopment(prod)
                            });
                        }
                    },
                ]
            },

        ];
    }
    //添加或者修改弹出表单
    detail(prod, param, kind) {
        let title = "";
        let item;
        if (param == 'add') {
            title = kind == 'cropManage' ? "添加作物" : "添加作物发育期";
            item = kind == 'cropManage' ? new cropManage() : new cropDelevolment();
        } else {
            title = kind == 'cropManage' ? "修改作物" : "修改作物发育期";
            item = prod;
        }
        this.modalService.config.ignoreBackdropClick = true;
        let modalRef = this.modalService.show(DetailComponent, { class: 'modal-lg detail-modal' });
        modalRef.content.initStationDto(title, item, kind, param, this.selCrop);
        modalRef.content.successChanged.subscribe(param => {
            if (param == "crop") {
                this.getAllCrop();
            } else {
                this.getDevelopmentByCrop(this.selCrop);
            }
        })
    }
    //作物切换
    cropChange(crop) {
        this.selCrop = crop;
        this.getDevelopmentByCrop(this.selCrop);
    }
    //更新localstorage之中作物信息
    updateE001() {
        return this.cropDictService.getAllCrops().toPromise().then((e001List: Array<any>) => {
            localStorage.setItem('E001', JSON.stringify(e001List));
        });
    }
    //更新localstorage之中作物发育期信息
    updateE009() {
        return this.cropDictService.getDevInfo('').toPromise().then((e009List: Array<any>) => {
            localStorage.setItem('E009', JSON.stringify(e009List));
        });
    }
}