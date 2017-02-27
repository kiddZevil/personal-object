/**
 *	@author: bob
 *	@date: 2016-07-20
 */
require.config({
	baseUrl : "src/",
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
		'dialog' : 'assets/common/dialog_amd',
		'date' : 'assets/components/date',
		'tab' : 'assets/components/tab',
		'ajax' : 'assets/common/ajax_amd',
		'laydate':'assets/lib/laydate/laydate',
		'jquery.pagination':'assets/lib/pagination/1.2.1/jquery.pagination',
		'blockUI':'assets/lib/blockUI/jquery.blockUI'
	},
	waitSeconds:0,
	shim:{
		'hdb':{ exports: ['Handlebars'] },
		'hdbHelper': { deps: ['hdb'] },
		'artDialog': { deps: ['jquery'] },
		'backbone': { deps: ['underscore'] },
		'jquery.pagination':{deps:['jquery']},
		'blockUI':{deps:['jquery']}
	}
});

require(['js/workflow/auth/register'],function(){

});