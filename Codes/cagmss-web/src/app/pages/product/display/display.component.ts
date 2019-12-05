import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProdService } from '../../services/product.service';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { WordViewComponent } from './wordView/wordView.component';
import { ImgViewComponent } from './imgView/imgViewer.component';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs/Observable';
import { ExportService } from '../../services/export.service';
import { WordService } from '../../services/word.service';
import { BComponent } from './component/component';
import { AreaService } from '../../services';
import { UserConfig } from '../../models/userConfig/userConfig';
import { DisplayMenu } from '../../models/product/displayMenu';

@Component({
    selector: 'display',
    styleUrls: ['./display.scss'],
    templateUrl: 'display.html'
})

export class Display implements OnInit {
    makeCompany;

    wordSettings;
    wordSource: LocalDataSource = new LocalDataSource();
    imgSource: LocalDataSource = new LocalDataSource();


    wordAlertType = 'info';
    wordAlertInfo = '请选择搜索条件';
    imgAlertType = 'info';
    imgAlertInfo = '请选择搜索条件';

    prodList;
    imgList;

    wordProdMenus: DisplayMenu;
    imgProdMenus: DisplayMenu;

    prodDataType;
    prodDataEleArr = new Array();

    modalRef: BsModalRef;
    constructor(
        private _route: ActivatedRoute,
        private _prodService: ProdService,
        private _areaService: AreaService,
        private router: Router,
        private modalService: BsModalService,

    ) { }

    ngOnInit() {
        this._route.params.subscribe((params: Params) => {
            this._areaService.getDetailByCpcode(params['data']).subscribe(data => {
                this.makeCompany = data;
                this._prodService.getUserConfig('').then((userConfig: UserConfig) => {
                    let model = userConfig.models.find(value => { return value.code === 'product'; });
                    let prodMenu = model.maps.find(value => { return value.key === 'prodMenu'; });
                    this.wordProdMenus = JSON.parse(prodMenu.value).wordProdMenus;
                    this.imgProdMenus = JSON.parse(prodMenu.value).imgProdMenus;
                    this.setSettings();
                });
            });
        });
    }

    createElements(item, childId, dataFormat, prod) {

        if (prod === 'dataType') {
            this.prodDataType = item.value;
            this.prodDataEleArr = new Array();
        } else if (prod === 'dataEle') {
            this.prodDataEleArr = new Array();
            let obj = document.getElementsByName(childId + dataFormat + 'Name');
            for (let i = 0; i < obj.length; i++) {
                if (obj[i]['checked']) {
                    this.prodDataEleArr.push(item.value);
                }
            }
        }

        if (dataFormat === 'HTML') {
            this.wordSearch(this.prodDataType, this.prodDataEleArr.join(','), dataFormat);
        } else if (dataFormat === 'JPG') {
            this.imgSearch(this.prodDataType, this.prodDataEleArr.join(','), dataFormat);
        }





        if (!item.children) {
            return;
        }
        let div = document.getElementById(childId + dataFormat);
        div.className = 'w-100';
        div.innerHTML = ``;

        let rowDiv = document.createElement('div');
        rowDiv.className = 'row align-items-center m-0';


        let childDiv = document.createElement('div');
        childDiv.id = item.children.id + dataFormat;

        let eleLabel = document.createElement('label');
        eleLabel.className = 'col-md-2 control-label';
        eleLabel.innerHTML = item.children.title;

        let elesDiv = document.createElement('div');
        elesDiv.className = 'col-md-10';

        item.children.elements.forEach(element => {
            let eleDiv = document.createElement('div');
            eleDiv.className = 'float-left w-25';

            let eleInput = document.createElement('input');
            eleInput.type = item.children.type;
            eleInput.value = element.value;
            eleInput.name = item.children.id + dataFormat + 'Name';
            eleInput.addEventListener('change', (e) => {
                this.createElements(element, item.children.id, dataFormat, 'dataEle');
            });

            let eleSpan = document.createElement('span');
            eleSpan.innerHTML = element.label;

            eleDiv.appendChild(eleInput);
            eleDiv.appendChild(eleSpan);
            elesDiv.appendChild(eleDiv);
        });
        rowDiv.appendChild(eleLabel);
        rowDiv.appendChild(elesDiv);
        rowDiv.appendChild(childDiv);
        div.appendChild(rowDiv);
    }

    wordSearch(wordDataType, wordDataEle, wordDataFormat) {
        this.wordAlertType = 'info';
        this.wordAlertInfo = '正在查询。。。';
        this._prodService.getMeta(this.makeCompany.cPCode, wordDataType, wordDataEle, wordDataFormat).catch(err => {
            this.wordAlertType = 'danger';
            this.wordAlertInfo = '未能查询到结果';
            this.prodList = new Array();
            throw err;
        }).subscribe(metaList => {
            this.prodList = new Array();
            for (let i = 0; i < metaList.length; i++) {
                let prod = {
                    num: i + 1,
                    cnName: metaList[i]['desc'],
                    fileName: metaList[i]['name'],
                    detail: {
                        fileName: metaList[i]['name'],
                        list: this.prodList,
                        num: i + 1
                    }
                };
                switch (wordDataType) {
                    case 'WCRM':
                        prod.cnName += '报';
                        break;
                    case 'AWFC':
                        prod.cnName += '专报';
                        break;
                    default:
                        break;
                }
                this.prodList.push(prod);
            }
            this.wordSource.load(this.prodList);
            if (this.prodList.length > 0) {
                this.wordAlertType = 'success';
                this.wordAlertInfo = '查询成功，共查询到' + this.prodList.length + '条结果';
            }
        });
    }


    imgSearch(imgDataType, imgDataEle, imgDataFormat) {
        this.imgAlertType = 'info';
        this.imgAlertInfo = '正在查询。。。';
        if (imgDataEle === '') {
            imgDataEle = '.*';
        }
        this._prodService.getMeta(this.makeCompany.cPCode, imgDataType, imgDataEle, 'JPG').catch(err => {
            this.imgAlertType = 'danger';
            this.imgAlertInfo = '未能查询到结果';
            this.imgList = new Array();
            throw err;
        }).subscribe(metaList => {
            this.imgList = new Array();
            for (let i = 0; i < metaList.length; i++) {
                let prod = {
                    num: i + 1,
                    cnName: metaList[i]['desc'],
                    fileName: metaList[i]['name'],
                    url: this._prodService.getUrl(metaList[i]['name'])
                };
                this.imgList.push(prod);
            }
            this.imgSource.load(this.imgList);
            if (this.imgList.length > 0) {
                this.imgAlertType = 'success';
                this.imgAlertInfo = '查询成功，共查询到' + this.imgList.length + '条结果';
            }
        });
    }

    htmlDetail(event) {
        this.modalRef = this.modalService.show(WordViewComponent, { class: 'modal-lg' });
        this._prodService.setWordPoint({ list: this.prodList, num: event.data.num });
    }

    imgDetail(num) {
        this.modalRef = this.modalService.show(ImgViewComponent);
        this._prodService.setImgPoint({ list: this.imgList, num: num });
    }

    setSettings() {
        this.wordSettings = {
            columns: {
                num: {
                    title: '序号',
                    filter: false
                },
                cnName: {
                    title: '文件名'
                },
                detail: {
                    title: '操作',
                    type: 'custom',
                    filter: false,
                    renderComponent: BComponent
                }
            },
            actions: {
                add: false,
                edit: false,
                delete: false
            },
            pager: {
                perPage: 5,
            }
        };
    }
}
