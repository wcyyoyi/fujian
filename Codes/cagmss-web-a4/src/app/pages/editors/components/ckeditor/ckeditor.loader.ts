// window['CKEDITOR_BASEPATH'] = '//cdn.ckeditor.com/4.6.1/full-all/';
// window['CKEDITOR_BASEPATH'] = '//127.0.0.1:3005/assets/ckeditor/';
const HOST = window.location.hostname || '127.0.0.1';
const PORT = window.location.port || 81;

window['CKEDITOR_BASEPATH'] = '//' + HOST + ':' + PORT + '/assets/ckeditor/';

