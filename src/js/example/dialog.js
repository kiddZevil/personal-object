/**
 *	@author: zhanglizhao
 *	@date: 2016-06-02
 *  这是一个 业务代码编写实例（可复制后 编写业务代码）
 */
define(['Util','text!module/example/dialog.tpl'],
    function (Util,Tpl) {
        //系统变量-定义该模块的根节点
        var $el = $(Tpl);
        //系统变量-构造函数
        var indexModule = null,param;
        var initialize = function(_indexModule, _param){
            indexModule = _indexModule;
            param=_param;
            $el.on("click","#dialog",function(){
                indexModule.showDialog({
                    title:"一个弹出模块",
                    url:"js/example/example",
                    width:600,
                    height:400,
                    param:{name:"zhanglizhao"}
                });
            });
            //将根节点赋值给接口
            this.content = $el;
        };

        return initialize;
    });
