/**
 *	@author: zhanglizhao
 *	@date: 2016-04-16
 */

window.console = window.console || (function () {
		var c = {};
		c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
		};
		return c;
	})();

var require={
	baseUrl : "src/",
	urlArgs: "r=" + (new Date()).getTime(),
    map: {
      	'*': { 'style': 'assets/lib/requirejs/css.min' }
    },
	paths : {
		'jquery' : 'assets/lib/jquery/jquery',
		'text' : 'assets/lib/requirejs/text',
		'hdb' : 'assets/lib/handlebars/handlebars_v4.0.4',
		'hdbHelper' : 'assets/lib/handlebars/helpers',
		'eventTarget':'assets/common/eventTarget',
		'cookie':'assets/common/cookie',
		'Util':"assets/common/global",
		'artDialog':'assets/lib/dialog/6.0.4/dialog-plus',
		'ajax' : 'assets/common/ajax_amd',
		'laydate':'assets/lib/laydate/laydate',
		"jquery.ui.widget":"assets/lib/jQuery-File-Upload/js/vendor/jquery.ui.widget",
		"jquery.fileuploader":"assets/lib/jQuery-File-Upload/js/jquery.fileupload",
		"jquery.iframe":"assets/lib/jQuery-File-Upload/js/jquery.iframe-transport",
		'ueditorConfig':'assets/lib/ueditor/ueditor.config',
		'ueditor':'assets/lib/ueditor/ueditor.all',
		'jquery.pagination': 'assets/lib/pagination/1.2.1/jquery.pagination',
		'zeroClipboard':'assets/lib/ueditor/third-party/zeroclipboard/ZeroClipboard.min',
		'echarts':'assets/lib/echarts/build/source/echarts',
		//���
		'dialog': 'assets/common/dialog_amd',
		'date': 'assets/components/date',
		'tab': 'assets/components/tab',
		'select': 'assets/components/select',
		'select2': 'assets/components/select2',
		'validator': 'assets/components/validator',
		'editor': 'assets/components/editor',
		'upload': 'assets/components/upload',
		'blockUI':'assets/lib/blockUI/jquery.blockUI'
	},
	waitSeconds:0,
	shim:{
		'hdb':{ exports: ['Handlebars'] },
		"jquery.slider": { deps: ['jquery'] },
		'js/index/index':{ deps: ['jquery'] },
		'hdbHelper': { deps: ['hdb'] },
		'artDialog': { deps: ['jquery'] },
		'backbone': { deps: ['underscore'] },
		'jquery.pagination':{deps:['jquery']},
		'blockUI':{deps:['jquery']}
	}
};
