/**
 *	@author: zhanglizhao
 *	@date: 2016-06-02
 *  这是一个 业务代码编写实例（可复制后 编写业务代码）
 */
define(['Util','text!module/error/error.tpl'],
    function (Util,Tpl) {
        var $el,indexModule,param;
        return function(_indexModule,_param){
            indexModule=_indexModule;
            param=_param;
            //将根节点赋值给接口
            this.content=$el =$(Tpl);
            //页面渲染后执行函数
            this.renderCallback=init;
        };
        function init(){
            //页面渲染后执行函数-业务代码入口
        }
    });
