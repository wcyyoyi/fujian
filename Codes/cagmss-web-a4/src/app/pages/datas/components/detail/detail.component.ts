import { Component, Input, ViewChild, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { cropManage, cropDelevolment } from '../../../models/cropInfo';
import { CropDictService, StationService } from '../../../services';
import { DictionaryService } from '../../../utils/Dictionary.service';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { StationSelectComponent } from '../stationSelect/stationSelect.component';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';

@Component({
    selector: 'data-detail',
    templateUrl: 'detail.html',
    styleUrls: ['detail.scss'],
    
})
export class DetailComponent {
    @ViewChild('station') stationCom: StationSelectComponent;
    public successChanged = new EventEmitter<any>();  //添加与更新操作完成之后执行

    btnClassLevel: string = 'yz-btn-level1';
    public crop = new cropManage();   //作物
    public cropDev = new cropDelevolment();   //作物发育期
    public title: string;      //标题
    public kind: string;      //类型
    public option: string;      //操作add添加update更新
    public statsChecked: Array<any>;    //选中站点索引
    public statList: Array<any>;      //站点列表
    public cropStatList: Array<any>;      //站点列表
    public stationString: string;
    public ifShow: boolean;        //是否显示站点表格信息
    public ifShowString: string;    //显示/隐藏
    //作物表单验证
    public form: FormGroup;
    public cCrop: AbstractControl;
    public cCropname: AbstractControl;
    public cCropvirteties: AbstractControl;
    public cCropmature: AbstractControl;
    public _station: AbstractControl;
    //发育期表单验证
    public _form: FormGroup;
    public _cCrop: AbstractControl;
    public _cCorpdev: AbstractControl;
    constructor(private dictionaryService: DictionaryService, fb: FormBuilder, public bsModalRef: BsModalRef,
        private cropDictService: CropDictService, private yzNgxToastyService: YzNgxToastyService, private statService: StationService) {
        this.form = fb.group({
            'cCrop': ['', Validators.compose([Validators.required])],
            'cCropname': ['', Validators.compose([Validators.required])],
            'cCropvirteties': ['', Validators.compose([Validators.required])],
            'cCropmature': ['', Validators.compose([Validators.required])],
            '_station': [''],
        });
        this.cCrop = this.form.controls['cCrop'];
        this.cCropname = this.form.controls['cCropname'];
        this.cCropvirteties = this.form.controls['cCropvirteties'];
        this.cCropmature = this.form.controls['cCropmature'];
        this._station = this.form.controls['_station'];

        this._form = fb.group({
            '_cCrop': ['', Validators.compose([Validators.required])],
            '_cCorpdev': ['', Validators.compose([Validators.required])],
        });
        this._cCrop = this._form.controls['_cCrop'];
        this._cCorpdev = this._form.controls['_cCorpdev'];
    }
    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.ifShow = false;
        this.ifShowString = "显示";
    }
    initStationDto(title, selItem, kind, option, cCropName) {
        this.title = title;
        this.kind = kind;
        this.option = option;
        if (kind == 'cropManage') {
            for (let key in selItem) {
                this.crop[key] = selItem[key];
            }
            this.statList = this.dictionaryService.MANG_STAT;
            this.statsChecked = new Array<number>();
            this.stationString = "当前共选择" + this.statsChecked.length + "个站点";
            if (option == 'update') {
                this.getStationByCropName(this.crop.cCropname);
            }
        } else {
            for (let key in selItem) {
                this.cropDev[key] = selItem[key];
            }
            if (option == 'add') {
                this.cropDev["cCrop"] = cCropName;
            }
        }
    }
    //提交
    public onSubmit(values: Object): void {
        if (this.kind == 'cropManage') {
            if (!this.form.valid) return;
            if (this.option == 'add') {
                this.addNewCrop(this.crop);
            } else {
                this.updateCrop(this.crop);
            }
        } else {
            if (!this._form.valid) return;
            if (this.option == 'add') {
                this.addNewDevelopment(this.cropDev);
            } else {
                this.updateNewDevelopment(this.cropDev);
            }
        }
    }
    //添加新的作物
    addNewCrop(values) {
        let statArr = new Array();
        if (this.ifShow) {
            statArr = this.stationCom.getSelectedStation();
        } else {
            this.statsChecked.forEach(index => {
                statArr.push(this.statList[index])
            })
        }
        if (statArr.length == 0) {
            this.yzNgxToastyService.error("选择站点不能为空请重新进行选择", "", 3000);
            this.statsChecked = new Array();
            this.stationString = "当前共选择" + statArr.length + "个站点";
            return;
        }
        this.yzNgxToastyService.wait("正在添加作物请稍后", "");
        this.cropDictService.createCrop(values).then(data => {
            this.yzNgxToastyService.close();
            if (!data) {
                this.yzNgxToastyService.error("添加作物失败", "", 3000);
                return;
            }
            this.addStationCrop(values.cCropname, statArr).then(_data => {
                this.updateE001().then(result => {
                    this.yzNgxToastyService.success("添加作物成功", "", 3000);
                    this.bsModalRef.hide();
                    let cropArr = JSON.parse(localStorage.getItem("newCropArr"));
                    if (cropArr) {
                        cropArr.push(values.cCropname);
                    } else {
                        cropArr = new Array();
                        cropArr.push(values.cCropname);
                    }
                    localStorage.setItem('newCropArr', JSON.stringify(cropArr));
                    this.successChanged.emit('crop');
                })
            });
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("添加作物失败", "", 3000);
        })
    }
    //更新作物信息
    updateCrop(values) {
        let statArr = new Array();
        statArr = this.stationCom.getSelectedStation();
        let addArr = new Array();
        statArr.forEach(stat => {
            let item = this.cropStatList.find(list => list.v01000 == stat.v01000);
            if (!item) {
                addArr.push(stat);
            }
        })
        let deleteArr = new Array();
        this.cropStatList.forEach(_item => {
            let _list = statArr.find(_stat => _stat.v01000 == _item.v01000);
            if (!_list) {
                deleteArr.push(_item);
            }
        })
        if (this.statsChecked.length == 0 && this.option == 'update') {
            this.yzNgxToastyService.error("请选择站点", "", 3000);
            return;
        }
        if (statArr.length == 0) {
            this.yzNgxToastyService.error("选择站点不能为空请重新进行选择", "", 3000);
            this.stationString = "当前共选择" + 0 + "个站点";
            return;
        }
        this.yzNgxToastyService.wait("正在更新作物请稍后", "");
        this.cropDictService.updateCrop(values).then(data => {
            this.yzNgxToastyService.close();
            if (!data) {
                this.yzNgxToastyService.error("更新作物失败", "", 3000);
                return;
            }
            let promiseArr = new Array<Promise<any>>()
            promiseArr.push(this.addStationCrop(values.cCropname, addArr), this.deleteStationCrop(values.cCropname, deleteArr));
            Promise.all(promiseArr).then(() => {
                this.updateE001().then(result => {
                    this.yzNgxToastyService.success("更新作物成功", "", 3000);
                    this.successChanged.emit('crop');
                    this.bsModalRef.hide();
                })
            })
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("更新作物失败", "", 3000);
        })
    }
    //给作物添加新的发育期
    addNewDevelopment(values) {
        this.yzNgxToastyService.wait("正在添加作物发育期请稍后", "");
        this.cropDictService.createDev(values).then(data => {
            this.yzNgxToastyService.close();
            if (!data) {
                this.yzNgxToastyService.error("添加作物发育期失败", "", 3000);
                return;
            }
            this.updateE009().then(result => {
                this.yzNgxToastyService.success("添加作物发育期成功", "", 3000);
                this.successChanged.emit('development');
                this.bsModalRef.hide();
            })
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("添加作物发育期失败", "", 3000);
        })
    }
    //更新作物的发育期信息
    updateNewDevelopment(values) {
        this.yzNgxToastyService.wait("正在更新作物发育期请稍后", "");
        this.cropDictService.updateDev(values).then(data => {
            this.yzNgxToastyService.close();
            if (!data) {
                this.yzNgxToastyService.error("更新作物发育期失败", "", 3000);
                return;
            }
            this.updateE009().then(result => {
                this.yzNgxToastyService.success("更新作物发育期成功", "", 3000);
                this.successChanged.emit('development');
                this.bsModalRef.hide();
            })
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("更新作物发育期失败", "", 3000);
        })
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
    //是否显示站点表格
    ifTableShow() {
        this.ifShow = !this.ifShow;
        this.ifShowString = this.ifShow ? "隐藏" : "显示";
        if (this.ifShow) return;
        this.statsChecked = new Array();
        let arr = new Array();
        arr = this.stationCom.getSelectedStation();
        for (let i = 0; i < this.statList.length; i++) {
            let list = arr.find(item => item["v01000"] == this.statList[i]["v01000"]);
            if (list) {
                this.statsChecked.push(i)
            }
        }
        this.stationString = "当前共选择" + this.statsChecked.length + "个站点";
    }
    //根据作物名称获取站点
    getStationByCropName(cropName) {
        this.statService.getByCropName(cropName).then(data => {
            if (!data) return;
            this.cropStatList = new Array();
            this.statsChecked = new Array();
            for (let i = 0; i < this.statList.length; i++) {
                let list = data.find(item => item["v01000"] == this.statList[i]["v01000"]);
                if (list) {
                    this.statsChecked.push(i);
                    this.cropStatList.push(list)
                }
            }
            this.stationString = "当前共选择" + this.statsChecked.length + "个站点";
        })
    }
    //给站点添加作物
    addStationCrop(cCropname, statArr) {
        if (statArr.length == 0) return;
        let result = new Array();
        this.stationString = "当前共选择" + statArr.length + "个站点";
        statArr.forEach(stat => {
            let obj = new Object();
            obj["id"] = null;
            obj["cCropname"] = cCropname;
            obj["v01000"] = stat["v01000"];
            result.push(obj);
        })
        return this.cropDictService.addCropToStation(result).then(data => {
            if (!data) return;
        })
    }
    //删除站点中的作物
    deleteStationCrop(cCropname, deleteArr) {
        if (deleteArr.length == 0) return;
        let statNum = new Array();
        deleteArr.forEach(stat => {
            statNum.push(stat.v01000);
        })
        return this.statService.deleteStationCrop(statNum, cCropname).then(data => {
            if (!data) return;
        })
    }
}