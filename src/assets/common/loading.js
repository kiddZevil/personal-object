define(['jquery','blockUI'],function($){
		var loading = function(){

		}
		loading.prototype = {
			create : function(options){
				var defaults = {
					el : 'body',
					css : {padding:'6px 0'},
					message : '<h1><img src="src/assets/img/cmcc_loading_lg.gif" style="vertical-align:middle;margin-right:15px;"/>正在加载...</h1>'
				}
				this.options = $.extend(defaults,options);
				this.options.$el = this.options.el instanceof jQuery? this.options.el : $(this.options.el);
				this.options.$el.block({
					message : this.options.message,
					css : this.options.css
				});
			},
			destory : function(){
				this.options.$el.unblock();
			}
		}
		return new loading;
});