import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

import { AreaService } from '../../services';
import { AreaInfo } from '../../models';
import { UserConfig } from '../../models/userConfig/userConfig';
import { TabsetComponent } from 'ngx-bootstrap';
import 'style-loader!./areaMenu.scss';
import { DictionaryService } from '../../utils/Dictionary.service';
import { ComponentResolver } from 'ag-grid/dist/lib/components/framework/componentResolver';

@Component({
    selector: 'areaMenu',
    templateUrl: 'areaMenu.html',
})

export class AreaMenuComponent implements OnInit {
    level: number = 1;
    classLevel: string = "al-sidebar-level1";

    proList = new Array();
    cityList = new Array();
    counList = new Array();
    proListShow = new Array();
    cityListShow = new Array();
    counListShow = new Array();

    selArea: AreaInfo = new AreaInfo();

    redirect: boolean = false;
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    constructor(private router: Router,
        private areaService: AreaService,
        private route: ActivatedRoute,
        private dictionaryService: DictionaryService
    ) { }

    ngOnInit() {
        this.level = this.areaService.level;
        this.classLevel = 'al-sidebar-level' + this.areaService.level;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) { // 当导航成功结束时执行
                let params = event.url.split('/');
                let lastParam = params[params.length - 1];
                let secParam = params[params.length - 2];
                if (lastParam == "product") {        //刚进来时直接跳转到homepage界面
                    this.areaService.getByFilter(Number(this.areaService.areaCode)).then(data => {
                        this.router.navigate(['homePage', data[0].cPCode], { relativeTo: this.route });
                    })
                }
                if (secParam == "homePage") {
                    if (this.redirect == false) {      //跳转页面非点击事件进行跳转
                        this.getList();
                    } else {                        //跳转页面点击事件进行跳转
                        this.redirect = false;
                    }
                }
                if (secParam == "display") {     //跳转到分类查看页面
                    this.getList()
                }
            }
            
        });
        // this.areaService.getUserConfig('').then((userConfig: UserConfig) => {
        //     let codeNum = Math.floor(Number(userConfig.area.code) / 10000);
        //     this.areaService.getByFilter(codeNum, 1).then(data => {
        //         this.proList = data;
        //         this.proListShow = this.proList;
        //         this.areaService.getByFilter(codeNum, 2).then(data => {
        //             this.cityList = data;
        //             this.areaService.getByFilter(codeNum, 3).then(data => {
        //                 this.counList = data;
        //                 this.areaService.getByFilter(Number(this.areaService.areaCode), this.areaService.level).then(area => {
        //                     this.selectDistrict(area[0]);
        //                 });
        //             });
        //         });
        //     });
        // });
    }
    redirectByCCode(cCode: string, level: number) {                //实时更新左侧区域
        // let code = cCode.toString().substring(0, (level-1) * 2); //可以看到平级单位
        let code = cCode.toString().substring(0, level * 2);
        if (level === 2) {
            this.cityListShow = new Array();
            this.cityList.forEach(city => {
                if (city.cCode.toString().startsWith(code) && city.vLevel === 2) {
                    this.cityListShow.push(city);
                }
            });
            this.counListShow = new Array();
        } else if (level === 3) {
            this.counListShow = new Array();
            this.counList.forEach(coun => {
                if (coun.cCode.toString().startsWith(code) && coun.vLevel === 3) {
                    this.counListShow.push(coun);
                }
            });
        }
        this.areaService.getByFilter(Number(cCode), level).then(detail => {
            this.selArea = detail[0];
        });
        if (this, this.staticTabs.tabs.length >= 3) {
            this.staticTabs.tabs[level - 1].active = true;
        }
    }

    getList() {
        let codeNum = Math.floor(Number(this.areaService.areaCode) / 10000);
        this.areaService.getByFilter(codeNum, 1).then(areaList => {
            this.proList = areaList;
            this.areaService.getByFilter(codeNum, 2).then(citys => {
                this.cityList = citys;
                this.areaService.getByFilter(codeNum, 3).then(couns => {
                    this.counList = couns;
                    this.proListShow = this.proList;
                    let params = window.location.href.split('/');
                    let lastParam = params[params.length - 1];
                    let areaList = this.dictionaryService.AREA;
                    let area = areaList.find(area => area.cPCode === lastParam);
                    this.redirectByCCode(area.cCode.toString(), area.vLevel);
                });
            });
        });

    }
    selectDistrict(item) {
        this.redirect = true;
        this.selArea = item;
        let code = item.cCode.toString().substring(0, item.vLevel * 2);
        if (item.vLevel === 1) {
            this.cityListShow = new Array();
            this.cityList.forEach(city => {
                if (city.cCode.toString().startsWith(code) && city.vLevel === 2) {
                    this.cityListShow.push(city);
                }
            });
            this.counListShow = new Array();
        } else if (item.vLevel === 2) {
            this.counListShow = new Array();
            this.counList.forEach(coun => {
                if (coun.cCode.toString().startsWith(code) && coun.vLevel === 3) {
                    this.counListShow.push(coun);
                }
            });
        }

        if (item.vLevel < 3) {
            this.staticTabs.tabs[item.vLevel].active = true;
        }
        this.router.navigate(['homePage', this.selArea.cPCode], { relativeTo: this.route });
    }

}