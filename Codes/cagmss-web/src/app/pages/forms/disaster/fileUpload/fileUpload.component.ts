import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import 'style-loader!./fileUpload.scss';
import { ApiService } from '../../../services';
import { AgmeDist } from '../../../models/agmeDist';
import { FileUploadService } from '../../../services/fileUpload.service';
import { AgmeDistService } from '../../../services/agmsDist.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'file-upload',
    templateUrl: 'fileUpload.html',
    // styleUrls: ['./fileUpload.scss']
})

export class FileUploadComponent implements OnInit {

    @Output() submitStatus = new EventEmitter<any>();

    agmeDist: AgmeDist;

    fileNames: Array<string>;
    imgUrlList = new Array<SafeUrl>();

    nowTime = new Date();

    public uploader: FileUploader = new FileUploader({
        headers: [
            { name: 'Authorization', value: 'Bearer ' + this.fileUploadService.token.access_token }
        ],
        queueLimit: 4, // 最大上传文件数量
        maxFileSize: 2 * 1024 * 1024, // 最大可上传文件的大小
        allowedFileType: ['image'],
    });
    constructor(private fileUploadService: FileUploadService,
        private sanitizer: DomSanitizer,
        private agmeDistServ: AgmeDistService) { }


    ngOnInit() {
        this.uploader.onAfterAddingFile = this.onAfterAddingFile.bind(this);
        this.uploader.onSuccessItem = this.onSuccessItem.bind(this);
        this.uploader.onCompleteAll = this.onCompleteAll.bind(this);
        this.uploader.onBeforeUploadItem = this.onBeforeUploadItem.bind(this);
    }

    submit() {
        this.nowTime = new Date();
        this.submitStatus.emit(false);
        this.fileNames = new Array<string>();
        this.uploader.uploadAll();
    }

    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
        if (status === 200) {
            this.fileNames.push(response);
        }
    }

    onCompleteAll() {
        this.agmeDist.cPhotoId = this.fileNames.join(',');
        this.agmeDistServ.update(this.agmeDist).subscribe();
        this.submitStatus.emit(false);
        alert('上报成功');
    }

    onAfterAddingFile(fileItem: FileItem) {
        let url = window.URL.createObjectURL(fileItem.file.rawFile);
        this.imgUrlList.push(this.sanitizer.bypassSecurityTrustUrl(url));
        this.submitStatus.emit(true);
    }

    onBeforeUploadItem(fileItem: FileItem) {
        let date = new Date();
        let agmeDate = new Date(this.agmeDist.vdate);
        date.setFullYear(agmeDate.getFullYear());
        date.setMonth(agmeDate.getMonth());
        date.setDate(agmeDate.getDate());
        date.setHours(this.nowTime.getHours());
        date.setMinutes(this.nowTime.getMinutes());
        date.setSeconds(this.nowTime.getSeconds());
        this.nowTime.setSeconds(this.nowTime.getSeconds() + 1);

        fileItem.url = this.fileUploadService.data_url + '/dist/ele/upload?id=' + this.agmeDist.id
            + '&cAreaCode=' + this.agmeDist.cAreaCode
            + '&cDistCode=' + this.agmeDist.cDistCode + '-' + this.agmeDist.id
            + '&time=' + date.getTime();

        // this.uploader.setOptions({
        //     url: this.fileUploadService.data_url + '/dist/ele/upload?id=' + this.agmeDist.id
        //     + '&cAreaCode=' + this.agmeDist.cAreaCode
        //     + '&cDistCode=' + this.agmeDist.cDistCode + '-' + this.agmeDist.id
        //     + '&time=' + date.getTime()
        // });
    }
}
