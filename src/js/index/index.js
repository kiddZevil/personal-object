/**
 *	@author: zhanglizhao
 *	@date: 2016-05-14
 */
define(["Util",
	'js/index/side',
	'assets/components/routes'
	],
	function (Util,Side,Routes) {
	//url 路由
		var meuRotes,side,_dialog=null,_index = null;
		_index={
			main:meuRotes,
			side:side,
			showDialog:showDialog,
			destroyDialog:destroyDialog
		};
		meuRotes=new Routes({
			el:$("#main"),
			homeUrl:'js/workflow/toollist/toollist',
			errorUrl:'js/error/error',
			param:_index
		});

		side=new Side({
			el:"#side",
			userUrl:"/mamp/front/sh/user!session?uid=u001",
			param:meuRotes,
			url:"front/sh/user!index?uid=m001" //获取菜单接口地址
		});
		side.on("rowClick",function(itemEl,el,url){
			meuRotes.createTab({url:url});
		});
		meuRotes.on("change",function(obj){
			side.selectUrl(obj.url);
			if($('.ui-popup-backdrop').is(':visible')){
				$('.ui-popup-backdrop').remove();
				$('.ui-popup').remove();
			}
		});
		_index.side=side;
		meuRotes.goCurrentPage("js/workflow/toollist/toollist");
		side.sideShow();

		
		//打开显示模块弹框
		function showDialog(option){
			var dialogUrl = 'assets/components/dialog';
			require.undef(dialogUrl);
			require([dialogUrl], $.proxy(function(Dialog){
				option.index= $.extend(_index,{main:meuRotes});
				_dialog = new Dialog(option);
			},this));
		}
		$(document).keydown(function(e){
			if(e.target.name == 'cmpgnDesc' || e.target.name == 'cmpgnRuleCntt'){

			}else{
				if(event.keyCode ==13){
					e.preventDefault();
					e.stopPropagation();
				}
			}
		});
		$(document).on('click','#G-back-parent',function(){
			history.go(-1);
		});
		//移除模块弹框
		function destroyDialog(id){
			if(id){
				dialog.get(id).close().remove();
			}else {
				_dialog.dialog.remove();
				_dialog = null;
			}
		}
});

