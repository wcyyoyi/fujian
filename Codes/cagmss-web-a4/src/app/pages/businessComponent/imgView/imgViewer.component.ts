import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ImgViewerModalComponent } from './imgViewer.modal.component';
import { NgViewCell } from '../../interfaces/ng-view-cell';
import { ProdService } from '../../services/product.service';

@Component({
    selector: 'imgViewer',
    templateUrl: 'imgViewer.html'
})

export class ImgViewerComponent implements OnInit, NgViewCell {
    value: string | number | boolean;
    rowData: any;
    @Input()
    imgList = new Array<{ url: string, label: string }>();
    @Input()
    num = 0;

    modalRef: BsModalRef;
    constructor(private modalService: BsModalService, private prodService: ProdService) { }

    ngOnInit() {
    }

    showImgViewerModal() {
        let imgList = this.rowData.imgs.split(',');
        let arr = new Array<{ url: string, label: string }>();
        imgList.forEach(img => {
            let obj = {
                url: this.prodService.getUrl(img),
                label: ''
            }
            arr.push(obj);
        });

        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(ImgViewerModalComponent, { class: 'modal-lg img-modal-dialog' });
        this.modalRef.content.imgList = arr;
        this.modalRef.content.view();
    }

}