import { Component, OnInit } from '@angular/core';
import { ApiService, UserService } from '../../../../services';
import { UserConfig } from '../../../../models/userConfig/userConfig';
import { Attention } from '../../../../models/userConfig/Attention';
// import 'style-loader!./customSetting.scss';
import { MetaService } from '../../../../services/meta.service';
import { DictionaryService } from '../../../../utils/Dictionary.service';
import { Config } from '../../../../models/product/Config';
import { Model } from '../../../../models/userConfig/Model';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { TEMPLATE_MENU } from '../../configSetting/template/template.menu';
import { ProdService } from '../../../../services/product.service';
@Component({
    selector: 'custom-setting',
    templateUrl: 'customSetting.html',
    styleUrls: ['customSetting.scss'],

})

export class CustomSettingComponent implements OnInit {
    userConfig = new UserConfig();
    configs = [new Config()];
    public attention = new Attention();
    public selElement: string;
    public elementList: Array<any>;//数据要素列表
    public selUnit: string;
    public unitList: Array<any>; //制作单位列表
    public selDetail: string;
    public typeList: Array<any>; //数据内容列表
    public selMap: string;//当前所选地图

    public isForChildren = false;
    btnClassLevel: string = 'yz-btn-level1';
    constructor(
        private prodService: ProdService,
        private metaService: MetaService,
        private apiService: ApiService,
        private dictionaryService: DictionaryService,
        private yzNgxToastyService: YzNgxToastyService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.getAllList();
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]["themeLevel"];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.apiService.getUserConfig().then((userConfig: UserConfig) => {
            this.userConfig = userConfig;
            let config: Map<string, string> = new Map<string, string>();
            let _config: Map<string, string> = new Map<string, string>();
            let model = userConfig.models.find(value => { return value.code === 'product'; });
            model.maps.forEach(map => {
                config.set(map.key, map.value);
            });
            let _model = userConfig.models.find(value => { return value.code === 'dashboard'; });
            _model.maps.forEach(map => {
                _config.set(map.key, map.value);
            });
            this.configs = JSON.parse(config.get('configs'));
            if (_config.get('attention') != undefined) {
                this.attention = JSON.parse(_config.get('attention'));
                this.selElement = this.attention.dataElementCode;
                this.selUnit = this.attention.makeCompany;
                this.selDetail = this.attention.dataType;
            }
        })
    }

    reLoadDirtionary() {
        this.dictionaryService.init();
    }
    //提交
    update() {
        let config: Map<string, string> = new Map<string, string>();
        let model = this.userConfig.models.find(value => { return value.code === 'product'; });
        model.maps.forEach(map => {
            config.set(map.key, map.value);
        });
        config.set('configs', JSON.stringify(this.configs));
        model.maps = new Array();
        config.forEach((value, key) => {
            model.maps.push({ key: key, value: value });
        });

        let _config: Map<string, string> = new Map<string, string>();
        let _model = this.userConfig.models.find(value => { return value.code === 'dashboard'; });
        _model.maps.forEach(map => {
            _config.set(map.key, map.value);
        });
        this.attention.dataElementCode = this.selElement;
        this.attention.dataType = this.selDetail;
        this.attention.makeCompany = this.selUnit;
        _config.set('attention', JSON.stringify(this.attention));
        _model = new Model();
        _config.forEach((value, key) => {
            _model.maps.push({ key: key, value: value });
        });
        for (let index = 0; index < this.userConfig.models.length; index++) {
            if (this.userConfig.models[index].code === "product") {
                this.userConfig.models[index].maps = model.maps;
            } else if (this.userConfig.models[index].code === "dashboard") {
                this.userConfig.models[index].maps = _model.maps;
            }
        }

        console.log(JSON.stringify(_model));
        this.yzNgxToastyService.wait("正在修改请稍后", "");
        this.userService.updateSetting(this.userConfig).toPromise().then(result => {
            this.yzNgxToastyService.close();
            if (this.isForChildren) {
                this.yzNgxToastyService.success("修改成功", "正在修改子区域配置", 2000);
                this.userService.updateChildrenSetting([model]).toPromise().then(result => {
                    this.yzNgxToastyService.success("子区域修改成功", "请重新登录", 3000);
                }).catch(e => {
                    this.yzNgxToastyService.error("子区域配置修改失败", "", 2000);
                })
            } else {
                this.yzNgxToastyService.success("修改成功", "请重新登录", 3000);
            }
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("修改失败", "", 3000);
        })
    }
    //添加产品展示模块
    add(config) {
        let _config = {
            id: config.children ? config.children.length + 1 : 1,
            tagName: "",
            dataEles: "",
            dataFormat: 0,
            count: 10
        }
        if (!config.children) {
            config.children = new Array();
        }
        config.children.push(_config)
    }
    //删除展品展示模块
    delete(config, child) {
        for (let i = 0; i < config["children"].length; i++) {
            if (config["children"][i]["id"] == child["id"]) {
                config["children"].splice(i, 1);
            }
        }
    }
    //当前所选数据要素发生改变
    onElementChange(e) {
        this.selElement = e;
    }
    //当前所选制作单位发生改变
    ngUnitChange(unit) {
        this.selUnit = unit;
    }
    //当前所选数据内容发生改变
    onDetailChange(e) {
        this.selDetail = e;
    }
    //当前所选地图发生改变
    onMapChange(map) {
        this.selMap = map;
    }
    //获取所有列表
    getAllList() {
        this.elementList = new Array();
        this.elementList = TEMPLATE_MENU;
        this.getCompany();
        this.getDataDetail();
    }
    //获取数据内容
    getDataDetail() {
        this.typeList = new Array();
        this.prodService.getAllType().subscribe(data => {
            if (!data) return;
            data.forEach(item => {
                if (item["value"] == "WCRM" || item["value"] == "AWFC") {
                    this.typeList.push(item);
                }
            })
        })
    }
    //获取制作单位
    getCompany() {
        let code = JSON.parse(localStorage.getItem("activeUser"))["area"]["pCode"];
        let unitArr = new Array();
        this.unitList = new Array();
        this.metaService.getChildrenData(code).subscribe(data => {
            if (!data) return;
            this.metaService.getAreaData(code).subscribe(list => {
                if (!list) return;
                data.push(list);
                this.metaService.getElement().subscribe(_data => {
                    if (!_data) return;
                    _data.forEach(item => {
                        if (item["cClass"] == "制作单位") {
                            unitArr.push(item);
                        }
                    });
                    data.forEach(item => {
                        let list = unitArr.find(unit => unit["cCode"] == item["cPCode"]);
                        if (!list) return;
                        this.unitList.push(list)
                    })
                })
            })
        })
    }
    //新建模块
    addNewConfig() {
        let config = new Config();
        this.configs.unshift(config);
    }
    //删除模块
    deleteConfig(config) {
        this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
            if (!e) return;
            let index = this.configs.indexOf(config);
            if (index > -1) {
                this.configs.splice(index, 1);
            }
        });
    }
}