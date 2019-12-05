import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'imgview-modal',
    templateUrl: 'imgViewer.modal.html'
})

export class ImgViewerModalComponent implements OnInit {
    @Input()
    imgList = new Array<{ url: string, label: string }>();
    @Input()
    num = 0;
    src;
    title = '正在加载';
    constructor(
        private bsModalRef: BsModalRef,
    ) { }

    ngOnInit() {
        if (this.imgList || this.imgList.length > 0) {
            this.src = this.imgList[this.num];
        }
    }

    pagination(pag) {
        this.num += pag;
        if (this.num >= 0 && this.num < this.imgList.length) {
            this.title = this.imgList[this.num].label;
            this.src = this.imgList[this.num].url;
        } else if (this.num < 0) {
            this.num = 0;
        } else {
            this.num = this.imgList.length - 1;
        }
    }
}
