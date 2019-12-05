import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { IndexTypeModal } from './modals.component';
import { AreaModal } from './area.modal.component';

import { Station, SelectItem, CropItem, CropInfo, VaridevInfo, DistInfo, IndexInfo, ClassesInfo, ExpEleInfo, IdxEleInfo, AreaInfo } from '../../../models';
import { CropDictService, StationService, AreaService } from '../../../services';

// import 'style-loader!./indexEditor.scss';

@Component({
    selector: 'index-editor',
    templateUrl: './indexEditor.html',
    styleUrls: ['./indexEditor.scss']
})

export class IndexEditor implements OnInit {
    public cropList: Array<CropItem>;
    public staList: Array<Station>;
    public cropListShow: Array<CropItem> = new Array();
    public areaList = new Array();
    public cropmatureMap: Map<string, string[]>
    public selItemCropmatures: Array<string>;

    public cropDevList: Array<SelectItem>;
    public distList: Array<SelectItem>;
    public indexTypeList: Array<SelectItem>;

    public cropInfoMap: Map<CropItem, CropInfo[]>;
    public selCropItem: CropItem;
    public selAreaItem: AreaInfo;
    public selVariItem: string;
    public selDevItem: SelectItem;
    public selDistItem: SelectItem;
    public selIndexTypeItem: SelectItem;

    bsConfig: Partial<BsDatepickerConfig>;
    public startDate = new Date();
    public endDate = new Date();

    tabs: any[] = [];

    private selStationInfo: string;

    modalRef: BsModalRef;
    modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        // class: 'modal-lg'
    };

    constructor(private cropdictServ: CropDictService,
        private stdServ: StationService,
        private areaServ: AreaService,
        private datePipe: DatePipe,
        private modalService: BsModalService,
        private route: ActivatedRoute) {

    }

    setStartDate(event) {
        this.startDate = event;
    }

    setEndDate(event) {
        this.endDate = event;
    }

    ngOnInit() {
        this.bsConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD', locale: 'zh-cn' });
        this.cropInfoMap = new Map<CropItem, CropInfo[]>();

        // init control values
        this.cropList = new Array<CropItem>();
        this.cropmatureMap = new Map<string, string[]>();
        this.selItemCropmatures = new Array<string>();

        let initPromise = new Array<Promise<any>>();

        // crops
        let cropObservable = this.cropdictServ.getCropInfo();
        cropObservable.subscribe(data => {
            if (!data) return;

            for (let info of data) {
                let cropItem = new CropItem();
                cropItem.code = info.cCode;
                cropItem.name = info.cCrop;
                cropItem.desc = info.cCropname;
                if (this.cropList.findIndex(it => it.desc === cropItem.desc) == -1)
                    this.cropList.push(cropItem);
                if (this.cropmatureMap.has(cropItem.desc)) {
                    let cropmatures = this.cropmatureMap.get(cropItem.desc);
                    cropmatures.push(info.cCropmature);
                }
                else {
                    let cropmatures = new Array<string>();
                    cropmatures.push(info.cCropmature);
                    this.cropmatureMap.set(cropItem.desc, cropmatures);
                }
            }

            //this.onCropItemChange(this.cropList[0]);
        });
        initPromise.push(cropObservable.toPromise());

        // dists
        this.distList = new Array<SelectItem>();
        let distObservable = this.cropdictServ.getDistInfo();
        distObservable.subscribe(data => {
            if (!data) return;

            for (let info of data) {
                let item = new SelectItem();
                item.code = info.cCode;
                item.desc = info.cDisastername;

                this.distList.push(item);
            }

            this.onDistChange(this.distList[0]);
        });
        initPromise.push(distObservable.toPromise());

        // index type
        this.indexTypeList = new Array<SelectItem>();
        this.indexTypeList.push({ code: "1", desc: "分级" });
        this.indexTypeList.push({ code: "2", desc: "连续" });
        this.indexTypeList.push({ code: "3", desc: "唯一值" });
        // this.indexTypeList.push({ code: "4", desc: "极值" });
        this.onIndexTypeChange(this.indexTypeList[0]);

        Promise.all(initPromise).then(values => {
            if (values && values.length > 0) {
                this.route.queryParams.subscribe((params: Params) => {
                    let areaCode = params['area'];
                    let cropCode = params['code'];
                    let expId = params['id'];

                    if (!areaCode) return;
                    if (!cropCode) return;

                    // init selected area
                    this.areaServ.getByFilter(+areaCode).then(areas => {
                        let selArea = areas[0];

                        this.stdServ.getIdsByArea(selArea.cCode, selArea.vLevel).then(statIds => {
                            selArea.stationIds = statIds;

                            this.onAreaChange(selArea, cropCode, expId);
                            //this.onCropItemChange(viewItem);
                        });
                    });

                   // this.getInfoByArea(areaCode, cropCode, expId);
                });
            }
        });
    }

    onAreaChange(selArea: AreaInfo, selCropCode: string = null, seleExpId: string = null) {
        this.clear();

        if (selArea && selArea.stationIds.length > 0) {
            this.selStationInfo = selArea.cName + ',共' + selArea.stationIds.length + '个站点';
        } else {
            this.selStationInfo = selArea.cName + ',无可用站点！';
            return;
        }

        // 根据选择区域所在站点查找对应作物
        this.stdServ.getCrops(selArea.stationIds).then(datas => {
            this.cropListShow = new Array();
            datas.forEach(data => {
                this.cropList.forEach(crop => {
                    if (crop.desc === data.cCropname && this.cropListShow.indexOf(crop) < 0) {
                        this.cropListShow.push(crop);
                    }
                });
            });

            if (this.cropListShow.length > 0) {
                this.cropListShow.forEach(cropShow => {
                    cropShow.stations = selArea.cCode.toString();
                });

                // this.selCropItem = this.cropListShow[0];
                // this.onCropItemChange(this.selCropItem);
            }
        });

        // 查找该区域已经填报过的作物
        this.getInfoByArea(selArea.cCode.toString(), selCropCode, seleExpId);
    }

    onCropItemChange(crop: CropItem) {
        this.selCropItem = crop;

        if (!this.selCropItem) {

            this.onVariChange(null);
            this.selItemCropmatures = null;

            this.onDevChange(null);
            this.cropDevList = null;
            return;
        }

        this.selItemCropmatures = this.cropmatureMap.get(crop.desc);
        this.onVariChange(this.selItemCropmatures[0]);

        this.cropDevList = new Array<SelectItem>();
        this.cropdictServ.getDevInfo(crop.name).subscribe(data => {
            if (!data) return;

            for (let info of data) {
                let item = new SelectItem();
                item.code = info.cCode;
                item.desc = info.cCorpdev;

                this.cropDevList.push(item);
            }

            this.onDevChange(this.cropDevList[0]);
        });
    }

    onVariChange(value: string) {
        this.selVariItem = value;
    }

    onDevChange(item: SelectItem) {
        this.selDevItem = item;
    }

    onDistChange(item: SelectItem) {
        this.selDistItem = item;
    }

    onIndexTypeChange(item: SelectItem) {
        this.selIndexTypeItem = item;
    }

    onChange(event) {
        let times: any = new Object();
        times.start = this.startDate;
        times.end = this.endDate;
    }

    onTabSelect(tab: any) {
        if (tab) {
            tab.active = true;
            this.onCropItemChange(tab.key);
        }
    }

    removeTabHandler(tab: any): void {
        if (!tab)
            return;

        this.cropInfoMap.delete(tab.key);
        if (tab.key === this.selCropItem) {
            this.onCropItemChange(null);
        }

        this.tabs.splice(this.tabs.indexOf(tab), 1);
    }

    onInfoChanged(info: any) {
        if (!info)
            console.warn('No crop infomation seleted! ');
        let selCropInfo = info;
    }

    onDistClicked(dist: any) {
        if (!dist) return;

        this.showDistInfo(dist.desc, dist.indexValue);
    }

    addCrop(item: CropItem): void {
        if (!item) {
            console.warn('No crop selected! ');
            return;
        }

        // if (this.optionsModel)
        //     item.stations = this.optionsModel.join(',');
        this.onCropItemChange(item);

        this.tabs.forEach(tabz => {
            tabz.active = false;
        });

        let selCropList = this.cropInfoMap.get(this.selCropItem);
        if (selCropList) {
            let selTab = this.tabs.find(tabz => tabz.title == this.selCropItem.desc);
            if (selTab) {
                selTab.active = true
                return;
            }
        }
        else {
            selCropList = new Array<CropInfo>();
            this.cropInfoMap.set(this.selCropItem, selCropList);
        }

        this.tabs.push({
            title: this.selCropItem.desc,
            key: this.selCropItem,
            // content: `<ng-template ad-host></ng-template>`,
            disabled: false,
            removable: true,
            active: true,
            customClass: 'tab-remove',
            data: selCropList
        });
    }

    addDate(): void {
        if (!this.selCropItem)
            return;
        if (this.endDate < this.startDate) {
            alert('结束日期不可小于开始日期');
            return;
        }

        let cropInfos = this.cropInfoMap.get(this.selCropItem);
        let cropInfo = new CropInfo();

        cropInfo.start = this.datePipe.transform(this.startDate, 'MM-dd');
        cropInfo.end = this.datePipe.transform(this.endDate, 'MM-dd');
        cropInfo.nadvise = '农事建议';
        cropInfo.dadvise = '防灾减灾建议';

        if (cropInfos) {
            let isFind = false;
            cropInfos.forEach(it => {
                if (it.start == cropInfo.start && it.end == cropInfo.end) {
                    isFind = true;
                    return;
                }
            });

            if (!isFind)
                cropInfos.push(cropInfo);
        }
    }

    addCropType(): void {
        if (!this.selCropItem)
            return;

        let cropInfos = this.cropInfoMap.get(this.selCropItem);
        let varidevInfo = new VaridevInfo();

        varidevInfo.variCode = this.selVariItem;
        varidevInfo.devCode = this.selDevItem.code;
        if (this.selVariItem == '/')
            varidevInfo.desc = this.selDevItem.desc;
        else
            varidevInfo.desc = this.selVariItem + '-' + this.selDevItem.desc;

        if (this.selCropItem.tag) {
            let isFind = false;
            this.selCropItem.tag.varidevs.forEach(it => {
                if (it.desc == varidevInfo.desc) {
                    isFind = true;
                    return;
                }
            });

            if (!isFind)
                this.selCropItem.tag.varidevs.push(varidevInfo);
        }
    }

    addDist(): void {
        if (!this.selCropItem || !this.selCropItem.tag)
            return;

        // 已存在
        if (this.selCropItem.tag) {
            let isFind = false;
            this.selCropItem.tag.dists.forEach(it => {
                if (it.code == this.selDistItem.code) {
                    isFind = true;
                    return;
                }
            });

            if (isFind) return;
        }

        // init
        let selIndexInfo = new IndexInfo();
        selIndexInfo.type = this.selIndexTypeItem.code;
        let ci = new ClassesInfo();
        ci.name = '级别名';
        selIndexInfo.values.push(ci);

        let distInfo = new DistInfo();
        distInfo.code = this.selDistItem.code;
        distInfo.desc = this.selDistItem.desc;
        distInfo.indexValue = selIndexInfo;

        // console.log(distInfo.indexValue);
        this.selCropItem.tag.dists.push(distInfo);
        this.showDistInfo(this.selDistItem.desc, selIndexInfo);
    }

    showDistInfo(title: string, info: IndexInfo): void {
        this.modalRef = this.modalService.show(IndexTypeModal, this.modalConfig);
        this.modalRef.content.title = title;
        this.modalRef.content.indexType = info.type;
        this.modalRef.content.indexInfo = info;
    }

    showAreaInfo(title: string): void {
        this.modalRef = this.modalService.show(AreaModal, { class: 'modal-lg' });
        this.modalRef.content.title = title;
        this.modalRef.content.onAreaChanged.subscribe(this.onAreaChange.bind(this));
    }

    public onSubmit(values: Object): void {
        // console.log(this.selCropItem);
        this.cropdictServ.saveCropInfo(this.selCropItem, this.cropInfoMap.get(this.selCropItem))
            .then(results => {
                let isSave = true;
                if (results && results.length > 0) {
                    results.forEach(rest => {
                        isSave = isSave && rest;
                    });
                }
                else
                    isSave = false;

                if (isSave)
                    alert('成功');
                else
                    alert('失败');
            });
    }

    private convertNumToDateStr(ndate: number) {
        let sdate = this.cropdictServ.PreFixInterge(ndate, 4);
        let nMon = sdate.substr(0, 2);
        let nDay = sdate.substr(2, 2);

        return nMon + '-' + nDay;
    }

    private getInfoByArea(areaCode: string, cropCode: string = null, expId: string = null): void {
        this.cropdictServ.getExpEleInfoByArea(areaCode).then(expEleMaps => {
            // Find the same crop by cropcode 
            let areaCropMap = new Map<string, Map<ExpEleInfo, IdxEleInfo[]>>();
            expEleMaps.forEach((infoList, infokey) => {
                if (!areaCropMap.has(infokey.cCropcode)) {
                    let cropExpEleMaps = new Map<ExpEleInfo, IdxEleInfo[]>()
                    cropExpEleMaps.set(infokey, infoList);

                    areaCropMap.set(infokey.cCropcode, cropExpEleMaps);
                } else {
                    let cropExpEleMaps = areaCropMap.get(infokey.cCropcode);
                    cropExpEleMaps.set(infokey, infoList);
                }
            });

            let viewItem: CropItem = null;

            // init ui cropInfoMap
            areaCropMap.forEach((expEleInfos, pCropCode) => {
                let cropItem = this.cropList.find(item => item.code == pCropCode);
                cropItem.stations = areaCode;

                if (cropItem.code == cropCode)
                    viewItem = cropItem;

                this.initCropInfoMap(cropItem, expEleInfos);
                this.addCrop(cropItem);
            });

            // Setting selected crop item
            if (viewItem) this.setCropInfo(viewItem, expId);
        });
    }

    private initCropInfoMap(corpItem: CropItem, expEleMaps: Map<ExpEleInfo, IdxEleInfo[]>) {
        // Set value by crop infomation
        let selCropList = new Array<CropInfo>();

        expEleMaps.forEach((value, infokey) => {
            let info = new CropInfo();
            info.id = infokey.cExpcode;
            info.start = this.convertNumToDateStr(infokey.dStartdate);
            info.end = this.convertNumToDateStr(infokey.dEnddate);
            info.nadvise = infokey.cAdvise;
            info.dadvise = infokey.cDadvise;

            if (infokey.c56002 && infokey.c56002 != '') {
                infokey.c56002.split(',').forEach(verd => {
                    let verdInfo = new VaridevInfo()
                    verdInfo.variCode = '';
                    verdInfo.devCode = '';
                    verdInfo.desc = verd;
                    info.varidevs.push(verdInfo);
                });
            }

            value.forEach(di => {
                let distInfo = new DistInfo();
                distInfo.id = di.cIdxcode;
                distInfo.code = di.cDistcode;
                distInfo.desc = this.distList.find(dl => dl.code == di.cDistcode).desc;

                // Index value
                let idxModel = new IndexInfo();
                idxModel.classes = di.vLevel;
                idxModel.eleCode = di.cElecode;
                idxModel.type = di.vIndextype.toString();
                idxModel.values = JSON.parse(di.cValuerange);
                distInfo.indexValue = idxModel;

                info.dists.push(distInfo);
            });

            selCropList.push(info);
        });

        // init cropInfoMap
        this.cropInfoMap.set(corpItem, selCropList);
    }

    private setCropInfo(viewItem: CropItem, expId: string) {
        let selCropInfo: CropInfo = null;

        let cropInfoList: Array<CropInfo> = this.cropInfoMap.get(viewItem);
        cropInfoList.forEach(cropInfo => {
            if (cropInfo.id == expId) {
                selCropInfo = cropInfo;
            }
        });

        // init seleted cropInfo
        viewItem.tag = selCropInfo;
        let selTab = null;

        // init seleted cropItem
        this.tabs.forEach(tabz => {
            tabz.active = false;
            if (tabz.key === viewItem) {
                selTab = tabz;
            }
        });
        this.onTabSelect(selTab);
    }

    private clear(): void {
        this.selAreaItem = null;
        this.selCropItem = null;
        this.selDevItem = null;
        this.selDistItem = null;
        this.selItemCropmatures = null;
        this.selStationInfo = null;
        this.selVariItem = null;

        this.tabs = [];
    }
}
