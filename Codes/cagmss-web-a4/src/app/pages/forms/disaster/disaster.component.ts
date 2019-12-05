import { Component, OnInit, ViewChild } from '@angular/core';
import { DisasterService } from '../../services/disaster.service';
import { UserConfig } from '../../models/userConfig/userConfig';
import { AreaService, CropDictService } from '../../services';
import { AreaInfo, SelectItem } from '../../models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AreaModal } from './modal/area.modal.component';

import 'style-loader!./disaster.scss';
import { FileUploader } from 'ng2-file-upload';
import { AgmeDistService } from '../../services/agmsDist.service';
import { AgmeDist } from '../../models/agmeDist';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DictionaryService } from '../../utils/Dictionary.service';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';

@Component({
    selector: 'disaster-report',
    templateUrl: 'disaster.html',
    styleUrls: ['./disaster.scss'],
    
})

export class DisasterComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    areaCode: number;
    distList: Array<SelectItem>;
    wordCount: number = 0;
    userName: string;
    nowTime = new Date();
    selDistItem: SelectItem;
    selAreaInfo: AreaInfo = new AreaInfo();
    description: string;
    date = new Date();
    maxDate = new Date();
    public level: number;

    modalRef: BsModalRef;

    // intervalFunc;

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
        private areaService: AreaService,
        private modalService: BsModalService,
        private agmeDistServ: AgmeDistService,
        private dictionaryService: DictionaryService,
        private yzNgxToastyService: YzNgxToastyService,
    ) { }

    ngOnInit() {
        this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + this.level;
        this.maxDate = new Date();

        this.userName = this.agmeDistServ.userName;
        this.areaService.getDetailByCpcode(this.agmeDistServ.makeCompany).subscribe((area: AreaInfo) => {
            this.selAreaInfo = area;
        });

        this.distList = this.dictionaryService.DIST;
        this.selDistItem = this.distList[0];
    }

    showAreaInfo(title: string): void {
        if (this.areaService.level == 3) return;
        this.modalRef = this.modalService.show(AreaModal, { class: 'modal-lg' });
        this.modalRef.content.title = title;
        this.modalRef.content.onAreaChanged.subscribe(this.onAreaChange.bind(this));
    }

    onAreaChange(data) {
        this.selAreaInfo = data;
    }

    onDescriptionChange(event) {
        this.description = event.target.value;
        this.wordCount = this.description.length;
    }

    onDistItemChange(item: SelectItem) {
        this.selDistItem = item;
    }

    submitStatus(event) {
        this.sub.nativeElement.disabled = !event;
    }
    submitSuccess(event) {
        this.description = '';
        this.wordCount = 0;
        document.getElementById('description')['value'] = '';
    }

    submit() {
        if (this.fileUpload.uploader.queue.length == 0) {
            this.yzNgxToastyService.error('图片不能为空', '', 3000)
            return;
        }
        if (!this.description) {
            this.yzNgxToastyService.error('请添加灾情描述', '', 3000)
            return;
        }
        // if(this.fileUpload.uploader.queue["0"].file.size>2 * 1024 * 1024){
        // this.yzNgxToastyService.warning('图片过大',"",3000);
        //     return;
        // }
        this.agmeDistServ.getByFilter(this.agmeDistServ.userName, this.selAreaInfo.cPCode, this.selDistItem.code, this.date.toLocaleDateString()).subscribe((agmeDistList: Array<AgmeDist>) => {
            if (agmeDistList.length > 0) {
                this.yzNgxToastyService.error('该日已经提交过数据！', '', 3000)
                return;
            }

            let agmeDist = new AgmeDist();
            agmeDist.cAreaCode = this.selAreaInfo.cPCode;
            agmeDist.cDesc = this.description;
            agmeDist.cDistCode = this.selDistItem.code;
            agmeDist.cUsername = this.userName;
            agmeDist.vdate = this.date;
            this.agmeDistServ.create(agmeDist).subscribe(() => {
                this.agmeDistServ.getByFilter(this.agmeDistServ.userName, this.selAreaInfo.cPCode, this.selDistItem.code, this.date.toLocaleDateString()).subscribe((newAgmeDistList: Array<AgmeDist>) => {
                    this.fileUpload.agmeDist = newAgmeDistList[0];
                    this.fileUpload.submit();
                    // clearInterval(this.intervalFunc);
                });
            });
        });

    }

}
