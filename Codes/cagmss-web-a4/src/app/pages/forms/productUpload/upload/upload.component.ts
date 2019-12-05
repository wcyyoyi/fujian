import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileLikeObject } from 'ng2-file-upload';
import { fileUpload } from '../../../models/fileUpload';
import 'style-loader!./upload.scss';
import { ProdService } from '../../../services/product.service';
import { FileUploadService } from '../../../services/fileUpload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'upload',
    templateUrl: 'upload.html',
    styleUrls: ['./upload.scss'],
})

export class UploadComponent implements OnInit {

    @Output()
    submitSuccess = new EventEmitter<any>();
    @Output()
    fileReady = new EventEmitter<any>();

    fileNames: Array<string>;
    imgUrlList = new Array<SafeUrl>();

    nowTime = new Date();
    @Input() dataType: string;
    @Input() dataEle: string;
    @Input() productDate: string;
    @Input() count: number;
    public date: string

    @Input() remove: boolean = false;
    public uploader: FileUploader = new FileUploader({
        headers: [
            { name: 'Authorization', value: 'Bearer ' + this.fileUploadService.getToken().access_token }
        ],
        queueLimit: 1, // 最大上传文件数量
        maxFileSize: 10 * 1024 * 1024, // 最大可上传文件的大小
        allowedFileType: ['doc', 'docx'],
        removeAfterUpload: false
    });
    constructor(private yzNgxToastyService: YzNgxToastyService,
        private fileUploadService: FileUploadService,
        private sanitizer: DomSanitizer, private _prodService: ProdService) { }

    ngOnInit() {
        this.uploader.onAfterAddingFile = this.onAfterAddingFile.bind(this);
        this.uploader.onSuccessItem = this.onSuccessItem.bind(this);
        this.uploader.onErrorItem = this.onErrorItem.bind(this);
        this.uploader.onCompleteAll = this.onCompleteAll.bind(this);
        this.uploader.onBeforeUploadItem = this.onBeforeUploadItem.bind(this);
        this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed.bind(this);
    }
    ngOnChanges(changes: SimpleChanges) {
        this.uploader.options.queueLimit = this.count;
        this.uploader.options.allowedFileType = this.dataType == "ACRS" ? ['image', 'doc', 'docx'] : ['doc', 'docx'];
        if (changes.dataType) {
            this.uploader.queue = new Array();
        }
    }
    submit() {
        this.nowTime = new Date();
        this.fileNames = new Array<string>();
        this.uploader.uploadAll();
    }
    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
        console.log(66666)
        let fileName = item.file.name;
        this.submitSuccess.emit([true, "", fileName]);
        this.fileNames.push(response);
    }
    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
        let fileName = item.file.name;
        this.submitSuccess.emit([false, response, fileName]);
    }

    onCompleteAll() {
        this.uploader.queue = new Array();
    }
    onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
        if (this.uploader.queue.length > (this.count - 1)) {
            this.yzNgxToastyService.error('上传文件不能超过' + this.count + '个', '', 3000);
        }
        else if (item.size > 2 * 1024 * 1024) {
            this.yzNgxToastyService.error('文件过大', '', 3000);
        } else if (item.type != "application/msword" && this.dataType != "ACRS") {
            this.yzNgxToastyService.error('只能上传文档', '', 3000);
        }
    }
    onAfterAddingFile(fileItem: FileItem) {
        if (fileItem.file.type.split("/")[0] == "image" && this.dataType == "ACRS") {
            if (fileItem.file.type != "image/jpeg" || fileItem.file.name.split(".")[1] == 'jpeg') {
                this.yzNgxToastyService.error('只能上传jpg格式的图片', '', 3000);
                this.uploader.queue = new Array();
                this.imgUrlList = new Array();
                return;
            }
        }
        let url = window.URL.createObjectURL(fileItem.file.rawFile);
        this.imgUrlList.push(this.sanitizer.bypassSecurityTrustUrl(url));
        if (fileItem.file.type == 'image/png' || fileItem.file.type == 'image/jpeg') {
            this.fileReady.emit([true, 'JPG']);
        } else {
            this.fileReady.emit([true, 'DOCX']);
        }
    }
    onBeforeUploadItem(fileItem: FileItem) {
        let makeCompany = JSON.parse(localStorage.getItem("activeUser"))["area"]["pCode"];
        let token = JSON.parse(localStorage.getItem("token"))["access_token"];
        this.productDate = this.dataType == 'WCRM' ? this.productDate : (Number(this.productDate) + 1).toString();
        if (fileItem.file.type == 'image/png' || fileItem.file.type == 'image/jpeg') {
            fileItem["sourceFile"] = fileItem.file;
            fileItem.alias = 'sourceFile';
            fileItem.url = this.fileUploadService.pro_url + '/product/uploadByFields?dataEle=' + this.dataEle + '&dataType=' +
                this.dataType + '&makeCompany=' + makeCompany + '&productDate=' + this.productDate + '&access_token=' + token;
        } else {
            fileItem.url = this.fileUploadService.pro_url + '/prod/word/upload?dataElementCode=' + this.dataEle + '&dataType=' +
                this.dataType + '&makeCompany=' + makeCompany + '&productDate=' + this.productDate + '&access_token=' + token;
        }
    }
}
