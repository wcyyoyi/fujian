import { Component, TemplateRef, ViewChild } from '@angular/core';

import { CalendarService } from './calendar.service';
import 'style-loader!./calendar.scss';
import { CropDictService } from '../../services';
import { ExpEleInfo } from '../../models';
import { BsModalRef, BsModalService } from '../../../../../node_modules/ngx-bootstrap';
import { ConverterService } from '../../utils/Converter/converter.service';
import '../../editors/components/ckeditor/ckeditor.loader';
import 'assets/ckeditor/ckeditor';
import 'assets/ckeditor/lang/zh-cn';
@Component({
  selector: 'calendar',
  templateUrl: './calendar.html'
})
export class Calendar {
  public config = {
    uiColor: '#F0F3F4',
    height: '150',
    toolbar: [],
    readOnly:true,
    contentsCss: [window['CKEDITOR_BASEPATH'] + 'contents.css'],
    forcePasteAsPlainText: true, //默认为忽略格式
};
  public calendarConfiguration: any;
  private _calendar: Object;

  expInfo = new ExpEleInfo();

  modalRef: BsModalRef;

  @ViewChild('expModel') expModel;

  modelConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };

  constructor(
    private _calendarService: CalendarService,
    private cropDictService: CropDictService,
    private modalService: BsModalService,
    private converterService: ConverterService) {
    this.calendarConfiguration = this._calendarService.getData();
    // this.calendarConfiguration.select = (start, end) => this._onSelect(start, end);
    this.calendarConfiguration.eventClick = (calEvent, jsEvent, view) => this._onClick(calEvent, jsEvent, view);
  }

  public onCalendarReady(calendar): void {
    this._calendar = calendar;
  }
  private _onClick(calEvent, jsEvent, view): void {
    if (this._calendar != null) {
      this.cropDictService.getExpEleByIdxCode(calEvent.tag.cIdxcode).then((exp: ExpEleInfo) => {
        this.expInfo = exp;
        this.expInfo['v01000Str'] = this.converterService.areaCodeToName(Number(this.expInfo.v01000));
        this.expInfo['cCropcodeStr'] = this.converterService.cropCodeToName(this.expInfo.cCropcode);
        this.expInfo['dStartdateStr'] = this.converterService.numberToDate(this.expInfo.dStartdate);
        this.expInfo['dEnddateStr'] = this.converterService.numberToDate(this.expInfo.dEnddate);
        this.modalRef = this.modalService.show(this.expModel, this.modelConfig);
      })
    }
  }

}
