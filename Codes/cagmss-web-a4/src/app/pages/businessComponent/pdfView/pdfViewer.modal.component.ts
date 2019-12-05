import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ProdService } from '../../services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import 'style-loader!./pdfViewer.modal.scss';
@Component({
    selector: 'pdfview',
    templateUrl: 'pdfViewer.modal.html',
})
export class PdfViewerModalComponent implements OnInit {
    public pdfSrc: string;
    public page: number;
    @Input() num: number;
    @Input() prodList = new Array<{ fileName: string; label: string; }>();
    public title: string;
    constructor(private sanitizer: DomSanitizer, private bsModalRef: BsModalRef, private prodService: ProdService) { }
    ngOnInit() {
        this.page = 4;
    }
    viewInit() {
        if (this.prodList || this.prodList.length > 0) {
            this.pdfSrc = this.prodService.getUrl(this.prodList[this.num].fileName)
            this.title = this.prodList[this.num].label;
        }
    }
    pagination(pag) {
        this.num += pag;
        if (this.num >= 0 && this.num < this.prodList.length) {
            this.pdfSrc = this.prodService.getUrl(this.prodList[this.num].fileName)
            this.title = this.prodList[this.num].label;
        }
        else if (this.num < 0) {
            this.num = 0;
        }
        else {
            this.num = this.prodList.length - 1;
        }
    }
}