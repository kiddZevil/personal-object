	/*
*	@author: fanyu
*	@date: 2015-09-22
*	@desc: 弹出窗口控制，基于jquery组件artdialog
*/
define(['artDialog','style!assets/lib/dialog/6.0.4/css/ui-dialog.css'],
	function(){

	var artDialog={
		get:function(id){
			return dialog.get(id);
		},
		openDiv: function(params){
			var config = $.extend({
		        id:params.id,
				fixed: true,
			    title: params.title,
			    content: params.content,
			    okValue: params.okVal,
		        ok: params.okCallback,
		        cancelValue: params.cancelVal,
		        cancel: params.cancelCallback,
		        onclose: params.closeCallback	//关闭对话框回调函数
		    },params);
			var d = dialog(config);
			//d.width(params.width); 宽高artDialog已默认支持
			//d.height(params.height);
			if (params.modal) {
				d.showModal();
			}else{
				d.show();
			}
			return d;
		},
		tips: function(content, delay){
			var d = dialog({
				fixed: true,
				quickClose: false,	//点击空白处弹出框消失
			    content: content
			});
			d.show();
			setTimeout(function () {
			    d.close().remove();
			}, delay || 1500);
		},
		confirm: function(params){
			var d = dialog({
				id:'D_confirm',
	        	title: params.title?params.title:'',
				fixed: true,
			    content: params.content,
			    okValue: params.okVal?params.okVal:'确认',
		        ok: params.okCallback,
		        cancelValue: params.cancelVal?params.cancelVal:'取消',
		        cancel :params.cancelCallback?params.cancelCallback:function(){
		            return;
		        },
				onclose:params.oncloseCallback?params.oncloseCallback:function(){
					//debugger;
				}
			});
			d.showModal();
		},
		close: function(id){
		    dialog.get(id).close();
		},
		bubble:function(arguments){
			var d = null;
			if (typeof(arguments) === 'object' && arguments.element){
				arguments.content = arguments.content || '没有内容';
				arguments.quickClose = arguments.quickClose == null ? true : arguments.quickClose ;
				d = dialog(arguments);
				d.show(arguments.element.length ? arguments.element[0] :arguments.element);
			}else{
				d.show();
			}
		}
	};

	return artDialog
});