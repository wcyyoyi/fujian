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

@Component({
    selector: 'disaster-report',
    templateUrl: 'disaster.html',
    styleUrls: ['./disaster.scss']
})

export class DisasterComponent implements OnInit {
    areaCode: number;
    distList: Array<SelectItem>;
    wordCount: number = 0;

    userName: string;
    nowTime = new Date();
    selDistItem: SelectItem;
    selAreaInfo: AreaInfo = new AreaInfo();
    description: string;
    date = new Date();

    modalRef: BsModalRef;

    // intervalFunc;

    bsConfig: Partial<BsDatepickerConfig>;

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
        private areaCodeService: AreaService,
        private modalService: BsModalService,
        private cropdictServ: CropDictService,
        private agmeDistServ: AgmeDistService,
    ) { }

    ngOnInit() {
        this.bsConfig = Object.assign({}, { locale: 'zh-cn' });

        this.userName = this.agmeDistServ.userName;
        this.areaCodeService.getDetailByCpcode(this.agmeDistServ.makeCompany).subscribe((area: AreaInfo) => {
            this.selAreaInfo = area;
        });
        this.cropdictServ.getDistInfo().subscribe(data => {
            if (!data) return;
            this.distList = new Array<SelectItem>();
            for (let info of data) {
                let item = new SelectItem();
                item.code = info.cCode;
                item.desc = info.cDisastername;
                this.distList.push(item);
            }
            this.selDistItem = this.distList[0];
        });
        // this.intervalFunc = setInterval(() => {
        //     this.nowTime = new Date();
        // }, 1000);
    }

    showAreaInfo(title: string): void {
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

    submit() {
        this.agmeDistServ.getByFilter(this.agmeDistServ.userName, this.selAreaInfo.cPCode, this.selDistItem.code, this.date.toLocaleDateString()).subscribe((agmeDistList: Array<AgmeDist>) => {
            if (agmeDistList.length > 0) {
                alert('该日已经提交过数据！');
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
