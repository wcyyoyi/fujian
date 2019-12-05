/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function (config) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.coreStyles_bold = {
		element: 'span',
		styles: { 'font-weight': 'bold' }
	};
	config.coreStyles_italic = {
		element: 'span',
		styles: { 'font-style': 'italic' }
	};
	config.coreStyles_indent = {
		element: 'p',
		styles: { 'text-indent': '2em' }
	};
	config.contentsCss = './ckeditor/contents.css';
	config.allowedContent=true //关闭代码过滤
	config.extraPlugins += (config.extraPlugins ? ',lineheight' : 'lineheight');
	config.forcePasteAsPlainText = true; //强制去除复制来的内容格式

	config.allowedContent = true;
	config.toolbar = [
		['Source'], ['Bold', 'Italic'],
		['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], ['Image'],
		['Font', 'FontSize', 'TextColor', 'lineheight'], ['Outdent', 'Indent'],['Maximize']
	];
};


