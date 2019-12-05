import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'marker-viewer',
    templateUrl: './markerViewer.html'
})

export class MarkerViewer implements OnInit {
    private src: string;
    private num: number;
    private title: string;

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() { }
}