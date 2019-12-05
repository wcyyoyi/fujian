import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { MetaService } from '../../../../services/meta.service';
import { FileUploader } from 'ng2-file-upload';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { UserConfig } from '../../../../models/userConfig/userConfig';
import { BannerImg } from '../../../../models/bannerImg';
import { Model } from '../../../../models/userConfig/Model';
import { UserService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'img-setting',
    templateUrl: './imgSetting.html',
    styleUrls: ['./imgSetting.scss'],
    
})
export class ImgSettingComponent implements AfterViewInit {
    public imgsrc = '';
    public btnClassLevel: string = 'yz-btn-level1';
    public bannerImgs: Array<string>;
    public allImgList: Array<BannerImg>;
    public selImg: string;
    public file;
    public imgUrl: string;
    public levelList: Array<any>;
    public selLevel: number;
    public selFile: any;
    public token: string;
    public userLevel: number;
    public themeLevel: number;
    userConfig = new UserConfig();
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('sub') sub;
    uploader: FileUploader = new FileUploader({
        url: '/uploadFile',
        method: 'POST',
        itemAlias: 'uploadedfile',
        autoUpload: true, // 是否自动上传
        allowedFileType: ['image']
    });
    constructor(public _d: DomSanitizer, private fileService: FileUploadService,
        private metaService: MetaService, private yzNgxToastyService: YzNgxToastyService,
        private route: ActivatedRoute, private router: Router, private userService: UserService) {
    };

    ngAfterViewInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.themeLevel = level;
        this.userLevel = JSON.parse(localStorage.getItem('activeUser'))["area"]['level'];
        this.selLevel = this.userLevel;
        this.btnClassLevel = 'yz-btn-level' + level;
        this.token = JSON.parse(localStorage.getItem("token"))["access_token"];
        this.getLevelList();
        this.getSelectImgs().then(data => {
            this.getAllImgs();
        });
    }
    //上传位置等级发生改变
    onLevelChange(level) {
        this.selLevel = Number(level);
    }
    //获取所有位置等级
    getLevelList() {
        this.metaService.getSystemCatalogLevel().subscribe(data => {
            if (!data) return;
            this.levelList = new Array();
            data.forEach(list => {
                if (list["code"] > this.userLevel) {
                    this.levelList.push(list);
                }
            })
            this.selLevel = this.levelList[0]["code"];
        })
    }
    //保存当前设置的banner图片
    save() {
        this.yzNgxToastyService.confirm("确认保存？", 'info', (e) => {
            if (!e) return;
            let config: Map<string, string> = new Map<string, string>();
            let model = this.userConfig.models.find(value => { return value.code === 'dashboard'; });
            model.maps.forEach(map => {
                config.set(map.key, map.value);
            });
            let imgArr = new Array();
            this.bannerImgs.forEach(img => {
                imgArr.push(img.split("=")[1].split("&")[0])
            })
            config.set('bannerImgs', JSON.stringify(imgArr));
            model = new Model();
            config.forEach((value, key) => {
                model.maps.push({ key: key, value: value });
            });
            for (let index = 0; index < this.userConfig.models.length; index++) {
                if (this.userConfig.models[index].code === "dashboard") {
                    this.userConfig.models[index].maps = model.maps;
                }
            }
            this.yzNgxToastyService.wait("正在修改请稍后", "");
            this.userService.updateSetting(this.userConfig).toPromise().then(result => {
                this.yzNgxToastyService.close();
                if (result) {
                    this.yzNgxToastyService.success("修改成功", "重新登录应用新配置", 3000);
                } else {
                    this.yzNgxToastyService.error("修改失败", "", 3000);
                }
            }).catch(e => {
                this.yzNgxToastyService.close();
                this.yzNgxToastyService.error("修改失败", "", 3000);
            })
        });
    }
    //上传
    upload() {
        this.yzNgxToastyService.confirm("确认上传？", 'info', (e) => {
            if (!e) return;
            if (this.fileUpload.uploader.queue.length == 0) {
                this.yzNgxToastyService.error('图片不能为空', '', 3000)
                return;
            }
            this.fileUpload.submit();
        });
    }
    //删除右侧已选图片
    delete(item) {
        this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
            if (!e) return;
            for (let i = 0; i < this.bannerImgs.length; i++) {
                if (this.bannerImgs[i] == item) {
                    this.bannerImgs.splice(i, 1);
                }
            }
        });
    }
    //添加图片到右侧
    addImg() {
        this.allImgList.forEach(list => {
            if (!list.state) return;
            let img = this.bannerImgs.find(item => item == list.url);
            if (img) return;
            this.bannerImgs.push(list.url)
        })
    }
    //删除左侧可选图片
    deleteImg() {
        this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
            if (!e) return;
            let promiseArr = new Array<Promise<any>>()
            this.allImgList.forEach(list => {
                if (!list.state) return;
                let img = list.url.split("=")[1].split("&")[0];
                promiseArr.push(this.deleteAllImg(img));
            })
            Promise.all(promiseArr).then(() => {
                this.getAllImgs();
            })
        });
    }
    //删除左侧可选图片
    deleteAllImg(img) {
        return this.fileService.deleteImg(img).toPromise().then(data => {
            if (!data) {
                this.yzNgxToastyService.error("删除图片失败", "", 3000);
            }
            this.yzNgxToastyService.success("删除图片成功", "", 3000);
        }).catch(e => {
            this.yzNgxToastyService.error("删除图片失败", "", 3000);
        })
    }
    //获取所有可作为banner的图片
    getAllImgs() {
        let levels = "-1" + "," + this.userLevel + ",4";
        this.allImgList = new Array();
        this.fileService.getImgsByLevel(levels).subscribe(data => {
            if (!data) return;
            data.forEach(name => {
                let imgUrl = this.fileService.data_url + '/system/pic/banner?name=' + name + "&access_token=" + this.token;
                let img = this.bannerImgs.find(item => item == imgUrl);
                let obj = new BannerImg();
                obj.state = true;
                obj.url = imgUrl;
                obj.state = img ? true : false;
                this.allImgList.push(obj);
            });
        })
    }
    //获取当前选择的banner图片
    getSelectImgs() {
        return this.fileService.getUserConfig().then((userConfig: UserConfig) => {
            this.userConfig = userConfig;
            let config: Map<string, string> = new Map<string, string>();
            let model = userConfig.models.find(value => { return value.code === 'dashboard'; });
            model.maps.forEach(map => {
                config.set(map.key, map.value);
            });
            this.bannerImgs = new Array();
            if (!config.get('bannerImgs') || JSON.parse(config.get('bannerImgs')).length == 0) {
                this.fileService.getImgsByLevel('-1').subscribe(data => {
                    if (!data) return;
                    data.forEach(_name => {
                        this.bannerImgs.push(this.fileService.data_url + '/system/pic/banner?name=' + _name + "&access_token=" + this.token);
                    });
                })
            } else {
                let imgArr = new Array();
                imgArr = JSON.parse(config.get('bannerImgs'));
                imgArr.forEach(img => {
                    this.bannerImgs.push(this.fileService.data_url + '/system/pic/banner?name=' + img + "&access_token=" + this.token);
                })
            }
        })
    }
    submitStatus(event) {
        this.sub.nativeElement.disabled = !event;
    }
    submitSuccess(event) {
        this.getAllImgs();
    }
}