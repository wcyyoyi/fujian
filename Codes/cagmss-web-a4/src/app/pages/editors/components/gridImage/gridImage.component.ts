import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { SelectItem, AreaInfo } from '../../../models';
import { SurfaceService, ApiService } from '../../../services';
import { AreaService } from '../../../services';
import 'style-loader!./gridImage.scss';
import { AreaModal } from './areaChoose/area.modal.component';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { BsModalRef, BsModalService } from '../../../../../../node_modules/ngx-bootstrap';
import { environment } from 'environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';


@Component({
  selector: 'grid-image',
  templateUrl: 'gridImage.html',
  styleUrls: ['./gridImage.scss'],
  providers: [YzNgxToastyService, SlimLoadingBarService]
})

export class GridImage implements OnInit {
  btnClassLevel: string = 'yz-btn-level1'
  public now = new Date();

  public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
    containerClass: 'theme-green',
    locale: 'zh-cn',
    dateInputFormat: 'YYYY/MM/DD'
  });
  startDate = new Date();
  endDate = new Date();

  selStationInfo: string;
  modalRef: BsModalRef;

  public eleList: Array<SelectItem>;
  public selEleItem: SelectItem;
  public selArea: AreaInfo;
  public level: number;
  isCanSubmit: boolean = false;

  constructor(private surfServ: SurfaceService,
    private modalService: BsModalService,
    private areaService: AreaService,
    private yzNgxToastyService: YzNgxToastyService,
  ) {

  }

  ngOnInit() {
    this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
    this.btnClassLevel = 'yz-btn-level' + this.level;
    this.eleList = environment.dayList;
    if (this.areaService.level == 3) {
      this.areaService.getByFilter(Number(this.areaService.areaCode), this.areaService.level).then(data => {
        this.selStationInfo = data[0]["cName"];
        this.selArea = data[0];
        this.isCanSubmit = true;
      })
    }
    this.onEleChange(this.eleList[0]);
  }

  onEleChange(item: SelectItem) {
    if (!item) return;

    this.selEleItem = item;
  }

  onClick() {
    // this.startLoading();
    if (!this.isCanSubmit) {
      return;
    }
    this.yzNgxToastyService.wait("在线制图", "正在出图，请稍后…");
    let image: any = document.getElementById("imgGrid");
    let url = this.surfServ.createGrid(this.selArea.cCode, this.selEleItem.code, this.startDate, this.endDate);
    image.src = url;
    image.onload = () => {
      this.yzNgxToastyService.close();
      // this.completeLoading();
    };

  }

  showAreaInfo(title: string): void {
    if (this.areaService.level == 3) return;
    this.modalRef = this.modalService.show(AreaModal, { class: 'modal-lg' });
    this.modalRef.content.title = title;
    this.modalRef.content.onAreaChanged.subscribe(this.onAreaChange.bind(this));
  }

  onAreaChange(selArea: AreaInfo) {
    this.isCanSubmit = true;
    this.selArea = selArea;
    this.selStationInfo = selArea.cName;
    this.modalRef.content.bsModalRef.hide();
  }

  onError() {
    this.yzNgxToastyService.close();
    this.yzNgxToastyService.wait("提示", "没有足够的数据，请重试", 2000);
  }

  // startLoading() {
  //   this.slimLoadingBarService.start(() => {
  //     console.log('Loading complete');
  //   });
  // }

  // stopLoading() {
  //   this.slimLoadingBarService.stop();
  // }

  // completeLoading() {
  //   this.slimLoadingBarService.complete();
  // }

}