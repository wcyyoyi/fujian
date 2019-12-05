import { Component, OnInit, Input, Output ,TemplateRef } from '@angular/core';
import { BsModalService,ModalModule,BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'ba-modal',
    templateUrl: './baModal.component.html',
    styleUrls: ['./baModal.component.scss']
})
export class BaModal implements OnInit {

    
    //modalRef: BsModalRef;
    @Input() data:string = '数据加载中...';
    
    constructor(public bsModalRef: BsModalRef) {}

    ngOnInit() {
    }
    // 打开一个空的modal,即遮罩层
    // openModal(template: TemplateRef<any>) {
    //     this.modalRef = this.modalService.show(template, this.config);
    // }
    // 用于在其他component中关于遮罩层
    closeModal(): void {
        this.bsModalRef.hide();
    }
}