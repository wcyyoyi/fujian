import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

import 'style-loader!./imgViewer.modal.scss';

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

    width;
    height;

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {
        this.width = window.document.body.clientWidth;
        this.height = window.document.body.clientHeight - 200;
        document.getElementById('img').style.maxHeight = this.height + 'px';
    }

    view() {
        if (this.imgList || this.imgList.length > 0) {
            this.src = this.imgList[this.num].url;
            this.title = this.imgList[this.num].label;
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

    rollImg(event) {
        /* 获取当前页面的缩放比
            若未设置zoom缩放比，则为默认100%，即1，原图大小
        */
        var zoom = parseInt(document.getElementById('img').style.zoom) || 100;
        /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom
            wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
        */
        zoom += event.wheelDelta / 12;
        /* 如果缩放比大于100，则将缩放比加载到页面元素 */
        if (zoom > 100) {
            if (document.getElementsByClassName('modal-dialog').item(0).clientWidth > this.width - 20 && event.wheelDelta > 0) return;
            document.getElementById('img').style.zoom = zoom + '%';
        }
    }
}
