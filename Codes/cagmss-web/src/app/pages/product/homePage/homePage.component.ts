import { Component, OnInit, ViewChild } from '@angular/core';
import { ProdService } from '../../services/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { WordViewComponent } from '../display/wordView/wordView.component';
import { ImgViewComponent } from '../display/imgView/imgViewer.component';
import { PageChangedEvent } from 'ngx-bootstrap/pagination/pagination.component';
import { AreaService } from '../../services';
import { AreaInfo } from '../../models';
import { UserConfig } from '../../models/userConfig/userConfig';
import { Model } from '../../models/userConfig/Model';
import { Config } from '../../models/product/config';

@Component({
    selector: 'homePage',
    styleUrls: ['./homePage.scss'],
    templateUrl: 'homePage.html'
})

export class HomePage implements OnInit {
    imgList = new Array();
    pictures = new Array();

    wcrmShowList = new Array();
    wcrmList = new Array();
    awfcList = new Array();

    customList = new Array();

    makeCompany: AreaInfo = new AreaInfo();

    modalRef: BsModalRef;

    isWcrmLoading: boolean = true;
    isAwfcLoading: boolean = true;
    isImgsLoading: boolean = true;
    isCustomLoading: boolean = true;

    colorClass = ['tag-green', 'tag-orange', 'tag-blue'];

    constructor(
        private _prodService: ProdService,
        private _areaService: AreaService,
        private _route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private modalService: BsModalService
    ) {

    }

    ngOnInit() {
        this._route.params.subscribe((params: Params) => {

            this._areaService.getDetailByCpcode(params['data']).subscribe(data => {
                this.makeCompany = data;

                this.isWcrmLoading = true;
                this.isAwfcLoading = true;
                this.isImgsLoading = true;
                this.isCustomLoading = true;
                this._prodService.getUserConfig('').then((userConfig: UserConfig) => {
                    let config: Map<string, string> = new Map<string, string>();
                    let model = userConfig.models.find(value => { return value.code === 'product'; });
                    model.maps.forEach(map => {
                        config.set(map.key, map.value);
                    });

                    let imgListConfigs: Array<Config> = JSON.parse(config.get('imgListConfig'));
                    // 左侧大图片
                    this.imgList = new Array();
                    imgListConfigs.forEach((imgListConfig: Config) => {
                        this.getImgList(imgListConfig.dataType, imgListConfig.dataEles,
                            imgListConfig.dataFormat, imgListConfig.count);
                    });

                    // 右侧自定义图片产品

                    let customConfigs: Array<Config> = JSON.parse(config.get('customConfig'));
                    this.customList = new Array();
                    customConfigs.forEach((customConfig: Config, index) => {
                        this.imgListDetail(customConfig.tagName, customConfig.dataType,
                            customConfig.dataEles, customConfig.dataFormat, index % 3);
                    });

                    let wordListConfigs: Array<Config> = JSON.parse(config.get('wordListConfig'));
                    // 右侧文字产品
                    this.awfcList = new Array();
                    this.wcrmList = new Array();
                    this.wcrmShowList = new Array();
                    wordListConfigs.forEach((wordListConfig: Config) => {
                        if (wordListConfig.dataType === 'AWFC') {
                            this.getListByDataType(this.awfcList, wordListConfig.dataType,
                                wordListConfig.dataEles, wordListConfig.dataFormat, wordListConfig.count);
                        }
                        else if (wordListConfig.dataType === 'WCRM') {
                            this.getListByDataType(this.wcrmList, wordListConfig.dataType,
                                wordListConfig.dataEles, wordListConfig.dataFormat, wordListConfig.count);
                        }

                    });
                });
            });
        });
    }

    pageChanged(start, end) {
        this.wcrmShowList = this.wcrmList.slice(start, end);
    }

    getListByDataType(list: Array<Object>, dataType, dateEle, dataFormat, count: number) {
        this._prodService.getMeta(this.makeCompany.cPCode, dataType, dateEle, dataFormat).catch(err => {
            if (dataType === 'WCRM') {
                this.isWcrmLoading = false;
            } else {
                this.isAwfcLoading = false;
            }
            throw err;
        }).subscribe(metaList => {
            if (dataType === 'WCRM') {
                this.isWcrmLoading = true;
            } else {
                this.isAwfcLoading = true;
            }
            metaList = this.sort(metaList, 'name');
            count = metaList.length > count ? count : metaList.length;
            for (let i = 0; i < count; i++) {
                let prod = {
                    num: i + 1,
                    cnName: metaList[i]['makeCompany'] + metaList[i]['dataElement'] + '报',
                    fileName: metaList[i]['name'],
                    date: metaList[i]['productDate']
                };
                list.push(prod);
            }
            if (dataType === 'WCRM') {
                this.isWcrmLoading = false;
                this.pageChanged(0, list.length > 4 ? 4 : list.length);
            } else {
                this.isAwfcLoading = false;
            }
        });
    }

    getImgList(dataType, dataEles, dataFormat, count) {
        this._prodService.getMeta(this.makeCompany.cPCode, dataType, dataEles, dataFormat).catch(err => {
            this.isImgsLoading = false;
            throw err;
        }).subscribe(metaList => {
            this.isImgsLoading = true;
            metaList = this.sort(metaList, 'name');
            let n = 2; // 一行n张图片
            let group = count / n; // 几组图片
            let imgCount = metaList.length > n * group ? n * group : metaList.length;
            imgCount = imgCount - imgCount % 2; // 保证偶数张图片
            for (let i = 0; i < imgCount; i += n) {
                let imgRow = new Array();
                for (let j = 0; j < n; j++) {
                    let prod = {
                        num: i + j + 1,
                        cnName: metaList[i + j]['desc'],
                        fileName: metaList[i + j]['name'],
                        url: this._prodService.getUrl(metaList[i + j]['name'])
                    };
                    imgRow.push(prod);
                    this.pictures.push(prod);
                }
                this.imgList.push(imgRow);
            }
            this.isImgsLoading = false;
        });
    }

    wordDetail(num, dataType, dataEle) {
        this.modalRef = this.modalService.show(WordViewComponent, { class: 'modal-lg' });
        if (dataType === 'WCRM') {
            this._prodService.setWordPoint({ list: this.wcrmList, num: num });
        } else if (dataType === 'AWFC') {
            this._prodService.setWordPoint({ list: this.awfcList, num: num });
        }
    }

    imgDetail(list: Array<Object>, num) {
        this.modalRef = this.modalService.show(ImgViewComponent);
        this._prodService.setImgPoint({ list: list, num: num });
    }

    // 旬气象要素图片
    imgListDetail(tagName, dataType, dataEles, dataFormat, colorClassItem: number) {
        let list = new Array();
        this._prodService.getMeta(this.makeCompany.cPCode, dataType, dataEles, dataFormat).subscribe(metaList => {
            metaList = this.sort(metaList, 'name');
            let lastFileName: string = metaList[0].name;
            for (let i = 0; i < metaList.length; i++) {
                if (metaList[i].name.split('_')[4] === lastFileName.split('_')[4]) {
                    let prod = {
                        num: i + 1,
                        cnName: metaList[i]['desc'],
                        fileName: metaList[i]['name'],
                        url: this._prodService.getUrl(metaList[i]['name'])
                    };
                    list.push(prod);
                    continue;
                }
            }
            this.customList.push({ name: tagName, list: list, color: this.colorClass[colorClassItem] });
            this.isCustomLoading = false;
        });
    }


    sort(list: Array<string>, field: string) {
        let newList = new Array();
        list.forEach(item => {
            newList.push(item[field]);
        });
        newList = newList.sort().reverse();
        let resultList = new Array();
        newList.forEach(item => {
            for (let i = 0; i < list.length; i++) {
                if (list[i][field] === item) {
                    resultList.push(list[i]);
                    continue;
                }
            }
        });
        return resultList;
    }
}
