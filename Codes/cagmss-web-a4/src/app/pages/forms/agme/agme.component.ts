import { Component, OnInit, ViewChild } from '@angular/core';
import { DisasterService } from '../../services/disaster.service';
import { UserConfig } from '../../models/userConfig/userConfig';
import { AreaService, CropDictService, StationService } from '../../services';
import { Station, SelectItem, CropItem, CropInfo, VaridevInfo, DistInfo, IndexInfo, ClassesInfo, ExpEleInfo, IdxEleInfo, AreaInfo } from '../../models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ImgAreaModal } from './imgModal/imgArea.modal.component';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';

import 'style-loader!./agme.scss';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { AgmeDistService } from '../../services/agmsDist.service';
import { AgmeDist } from '../../models/agmeDist';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AgmeRealEle } from '../../models/agmeRealEle';
import { AgmeRealEleService } from '../../services/agmeRealEle.service';

@Component({
    selector: 'disaster-report',
    templateUrl: 'agme.html',
    styleUrls: ['./agme.scss'],
    
})

export class AgmeComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    public cropListShow: Array<CropItem> = new Array();
    public cropList: Array<CropItem> = new Array();;

    userName: string;
    selAreaInfo = new AreaInfo();
    selCropItem: any;
    date = new Date();
    modalRef: BsModalRef;
    public maxDate = new Date();
    public level: number;
    public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD'
    });

    @ViewChild('fileUpload') fileUpload;
    @ViewChild('sub') sub;

    uploader: FileUploader = new FileUploader({
        url: '/uploadFile',
        method: 'POST',
        itemAlias: 'uploadedfile',
        autoUpload: true, // 是否自动上传
        allowedFileType: ['image']
    });

    constructor(
        private yzNgxToastyService: YzNgxToastyService,
        private areaService: AreaService,
        private modalService: BsModalService,
        private stdServ: StationService,
        private agmeRealEleServ: AgmeRealEleService,
    ) { }

    ngOnInit() {
        this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + this.level;
        this.maxDate = new Date();

        this.userName = this.agmeRealEleServ.userName;
        this.areaService.getDetailByCpcode(this.agmeRealEleServ.makeCompany).subscribe((area: AreaInfo) => {
            this.selAreaInfo = area;
            this.stdServ.getIdsByArea(this.selAreaInfo.cCode, this.selAreaInfo.vLevel).then(statIds => {
                this.selAreaInfo.stationIds = statIds;
                this.onAreaChange(this.selAreaInfo);
            });
        });
    }

    showAreaInfo(title: string): void {
        if (this.areaService.level == 3) return;
        this.modalRef = this.modalService.show(ImgAreaModal, { class: 'modal-lg' });
        this.modalRef.content.title = title;
        this.modalRef.content.onAreaChanged.subscribe(this.onAreaChange.bind(this));
    }

    onAreaChange(selArea: AreaInfo) {
        this.cropListShow = new Array();
        this.selAreaInfo = selArea;
        // 根据选择区域所在站点查找对应作物
        if (selArea.stationIds.length == 0) {
            this.yzNgxToastyService.error("该地区没有作物信息", "", 3000);
            return;
        }
        this.stdServ.getCrops(selArea.stationIds.join(',')).then(datas => {
            if (!datas) return;
            datas.forEach(data => {
                if (this.cropListShow.indexOf(data.cCropname) < 0) {
                    this.cropListShow.push(data.cCropname);
                }
            });
            this.selCropItem = this.cropListShow[0];
        });
    }

    submit() {
        if (this.fileUpload.uploader.queue.length == 0) {
            this.yzNgxToastyService.warning('文件不能为空！', "", 3000);
            return;
        }
        // if (!this.selAreaInfo.cPCode || !this.userName || !this.date || !this.selCropItem) {
        // this.yzNgxToastyService.warning('不可有空行',"",3000);
        //     return;
        // }
        let agmeRealEle = new AgmeRealEle();
        this.agmeRealEleServ.getByFilter(agmeRealEle.cUsername, agmeRealEle.cAreaCode, agmeRealEle.cCropCode, this.date.toLocaleDateString()).subscribe((agmeRealEleList: Array<AgmeRealEle>) => {
            if (agmeRealEleList.length > 0) {
                this.yzNgxToastyService.warning('该日已经提交过数据！', "", 3000);
                return;
            }
            this.agmeRealEleServ.getCodeByName(this.selCropItem).subscribe((crop) => {
                agmeRealEle.cAreaCode = this.selAreaInfo.cPCode;
                agmeRealEle.cUsername = this.userName;
                agmeRealEle.vdate = this.date;
                agmeRealEle.cCropCode = crop.cCode;
                this.agmeRealEleServ.create(agmeRealEle).subscribe(() => {
                    this.agmeRealEleServ.getByFilter(agmeRealEle.cUsername, agmeRealEle.cAreaCode, agmeRealEle.cCropCode, agmeRealEle.vdate.toLocaleDateString()).subscribe((data1) => {
                        this.fileUpload.agmeRealEle = data1[0];
                        this.fileUpload.submit()

                    })
                })
            })
        })
    }

    submitStatus(event) {
        this.sub.nativeElement.disabled = !event;
    }

    onCropItemChange(event: CropInfo) {
        this.selCropItem = event
    }
}   
