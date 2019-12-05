import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ImgViewerModalComponent } from './imgViewer.modal.component';

@Component({
    selector: 'imgViewer',
    templateUrl: 'imgViewer.html'
})

export class ImgViewerComponent implements OnInit {
    @Input()
    imgList = new Array<{ url: string, label: string }>();
    @Input()
    num = 0;

    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) { }

    ngOnInit() { }

    showImgViewerModal() {
        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(ImgViewerModalComponent);
    }

}