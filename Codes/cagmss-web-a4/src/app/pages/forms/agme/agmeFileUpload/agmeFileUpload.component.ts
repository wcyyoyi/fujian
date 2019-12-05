import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileLikeObject } from 'ng2-file-upload';

import 'style-loader!./agmeFileUpload.scss';
import { ApiService } from '../../../services';
import { FileUploadService } from '../../../services/fileUpload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AgmeRealEle } from '../../../models/agmeRealEle';
import { AgmeRealEleService } from '../../../services/agmeRealEle.service';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'agmefile-upload',
    templateUrl: 'agmeFileUpload.html',
    styleUrls: ['./agmeFileUpload.scss'],
    
})

export class AgmeFileUploadComponent implements OnInit {

    @Output()
    submitStatus = new EventEmitter<any>();

    agmeRealEle: AgmeRealEle;

    fileNames: Array<string>;
    imgUrlList = new Array<SafeUrl>();

    nowTime = new Date();

    public uploader: FileUploader = new FileUploader({
        headers: [
            { name: 'Authorization', value: 'Bearer ' + this.fileUploadService.getToken().access_token }
        ],
        queueLimit: 4, // 最大上传文件数量
        maxFileSize: 2 * 1024 * 1024, // 最大可上传文件的大小
        allowedFileType: ['image'],
        removeAfterUpload: true
    });
    constructor(private yzNgxToastyService: YzNgxToastyService,
        private fileUploadService: FileUploadService,
        private sanitizer: DomSanitizer,
        private agmeRealEleServ: AgmeRealEleService) { }


    ngOnInit() {
        this.uploader.onAfterAddingFile = this.onAfterAddingFile.bind(this);
        this.uploader.onSuccessItem = this.onSuccessItem.bind(this);
        this.uploader.onCompleteAll = this.onCompleteAll.bind(this);
        this.uploader.onBeforeUploadItem = this.onBeforeUploadItem.bind(this);
        this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed.bind(this);
    }

    submit() {
        this.nowTime = new Date();
        this.submitStatus.emit(false);
        this.fileNames = new Array<string>();

        this.uploader.uploadAll();
        // console.log(this.uploader);
    }



    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
        if (status === 200) {
            this.fileNames.push(response);
        }
    }

    onCompleteAll() {
        this.agmeRealEle.cPhotoId = this.fileNames.join(',');
        this.agmeRealEleServ.update(this.agmeRealEle).subscribe();
        this.submitStatus.emit(false);
        this.yzNgxToastyService.success('上报成功', '', 2000);
    }

    onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
        if (item.size > 2 * 1024 * 1024) {
            this.yzNgxToastyService.error('图片过大', '', 3000);
        }
        else if (this.uploader.queue.length > 3) {
            this.yzNgxToastyService.error('上传图片不能超过四张', '', 3000);
        }
        else if (item.type != "image") {
            this.yzNgxToastyService.error('只能上传图片', '', 3000);
        }
    }

    onAfterAddingFile(fileItem: FileItem) {
        let url = window.URL.createObjectURL(fileItem.file.rawFile);
        this.imgUrlList.push(this.sanitizer.bypassSecurityTrustUrl(url));
        this.submitStatus.emit(true);
    }

    onBeforeUploadItem(fileItem: FileItem) {
        let date = new Date();
        let agmeDate = new Date(this.agmeRealEle.vdate);
        date.setFullYear(agmeDate.getFullYear());
        date.setMonth(agmeDate.getMonth());
        date.setDate(agmeDate.getDate());
        date.setHours(this.nowTime.getHours());
        date.setMinutes(this.nowTime.getMinutes());
        date.setSeconds(this.nowTime.getSeconds());
        this.nowTime.setSeconds(this.nowTime.getSeconds() + 1);
        // console.log(fileItem);
        // if(fileItem.length>0){
        // this.yzNgxToastyService.warning('图片不能为空',"",3000);
        //     return;
        // }

        fileItem.url = this.fileUploadService.data_url + '/real/ele/upload?id=' + this.agmeRealEle.id
            + '&cAreaCode=' + this.agmeRealEle.cAreaCode
            + '&cCropCode=' + this.agmeRealEle.cCropCode + '-' + this.agmeRealEle.id
            + '&time=' + date.getTime();
        // this.uploader.setOptions({
        //     url: this.fileUploadService.data_url + '/dist/ele/upload?id=' + this.agmeRealEle.id
        //     + '&cAreaCode=' + this.agmeRealEle.cAreaCode
        //     + '&cDistCode=' + this.agmeRealEle.cDistCode + '-' + this.agmeRealEle.id
        //     + '&time=' + date.getTime()
        // });
    }
}
