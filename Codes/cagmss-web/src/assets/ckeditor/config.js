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
	config.allowedContent = true;
	config.toolbar = [
		['Undo', 'Redo'], ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
		['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], ['Image', 'Table'],
		['FontSize', 'TextColor', 'BGColor'], ['Maximize']
	];
};


