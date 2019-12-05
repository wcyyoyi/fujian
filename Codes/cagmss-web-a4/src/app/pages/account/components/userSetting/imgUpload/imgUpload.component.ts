import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileLikeObject } from 'ng2-file-upload';

import 'style-loader!./imgUpload.scss';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';

@Component({
    selector: 'img-upload',
    templateUrl: 'imgUpload.html',
    // styleUrls: ['./imgUpload.scss'],
    
})

export class ImgUploadComponent implements OnInit {

    @Output() submitStatus = new EventEmitter<any>();
    @Output() submitSuccess = new EventEmitter<any>();
    @Input() selLevel: number;

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

    constructor(private fileUploadService: FileUploadService,
        private sanitizer: DomSanitizer,
        private yzNgxToastyService: YzNgxToastyService) { }


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
    }
    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
        if (status === 200) {
            this.fileNames.push(response);
        }
    }
    onCompleteAll() {
        this.submitStatus.emit(false);
        this.submitSuccess.emit();
        this.yzNgxToastyService.success('上报成功', '', 2000);
    }
    //添加图片失败时
    onWhenAddingFileFailed(item: FileLikeObject) {
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
    //添加图片
    onAfterAddingFile(fileItem: FileItem) {
        let url = window.URL.createObjectURL(fileItem.file.rawFile);
        this.imgUrlList.push(this.sanitizer.bypassSecurityTrustUrl(url));
        this.submitStatus.emit(true);
    }
    //拼接请求的地址
    onBeforeUploadItem(fileItem: FileItem) {
        let token = JSON.parse(localStorage.getItem("token"))["access_token"];
        fileItem.url = this.fileUploadService.data_url + '/system/pic/banner/upload/' + this.selLevel + "?access_token=" + token;
    }
}
