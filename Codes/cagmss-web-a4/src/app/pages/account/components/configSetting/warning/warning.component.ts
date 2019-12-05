import { Component, OnInit, ViewChild } from '@angular/core';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { AreaService } from '../../../../services';
import { StationService } from '../../../../services';
import { DictionaryService } from '../../../../utils/Dictionary.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import 'style-loader!./warning.scss';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { WarningService } from '../../../../services/warning.service';
import { WarningDetailComponent } from '../../../components/configSetting/warningDetail/warningDetail.component';
@Component({
    selector: 'warning',
    templateUrl: './warning.html',
    

})
export class WarningComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD'
    });
    public settings: Array<any>;
    public source: Array<any>;
    public startDate = new Date(new Date().toLocaleDateString());
    public endDate = new Date(new Date().toLocaleDateString());
    public modalRef: BsModalRef;
    public now = new Date();
    constructor(private modalService: BsModalService, private areaService: AreaService,
        private yzNgxToastyService: YzNgxToastyService, private warningService: WarningService) {
    };

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.setting();
        this.search();
    }
    search() {
        this.source = new Array();
        let vEnd = this.endDate.getTime();
        let vStart = this.startDate.getTime();
        this.yzNgxToastyService.wait("正在查询，请稍后", "");
        this.warningService.getWarning(vEnd, vStart).toPromise().then(data => {
            this.yzNgxToastyService.close();
            if (!data) return;
            this.source = data;
        }).catch(() => {
            this.yzNgxToastyService.close();
        })
    }
    setting() {
        this.settings = new Array();
        this.settings = [
            {
                headerName: '站号',
                field: "v01000",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '指标ID',
                field: "cIdxcode",
            },
            {
                headerName: '日期',
                field: "dEventtime",
                filter: "agDateColumnFilter",
                valueFormatter: (item) => new Date(item.value).toLocaleDateString(),
            },
            {
                headerName: '预警等级',
                field: "vAlertLevel",
                filter: "agNumberColumnFilter",
            },
            {
                headerName: '描述',
                field: "cDesc",
            },
            {
                headerName: '操作',
                cellRenderer: "customComponent",
                cellRendererParams: [
                    {
                        value: '详细',
                        callBackFunction: (param) => this.detail(param)
                    },
                ]
            },
        ]
    }
    detail(param) {
        this.modalService.config.ignoreBackdropClick = true;
        let modalRef = this.modalService.show(WarningDetailComponent, { class: 'modal-lg detail-modal' });
        modalRef.content.initStationDto(param);
        modalRef.content.successChanged.subscribe(param => {
            if (param) {
                this.search();
            }
        })
    }
}