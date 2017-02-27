/**
 *	@author: zhanglizhao
 *	@date: 2016-06-02
 *  这是一个 业务代码编写实例（可复制后 编写业务代码）
 */
define(['Util',"editor"],
    function (Util,Editor,Upload) {
        console.log(Upload);
        //系统变量-定义该模块的根节点
        var $el = $('<div style="padding: 10px 50px;"><div>这是一个编辑器</div><div class="editor"></div><div style="padding: 50px 10px"> <input id="fileupload" type="file" name="files[]" accept="image/*" /></div></div>');
        //系统变量-构造函数
        var indexModule = null,param;
        var initialize = function(_indexModule, _param){
            indexModule = _indexModule;
            param=_param;

            //编辑器示例
            new Editor({
                el:$(".editor",$el),        //要绑定的容器
                content:'这里也可以是默认内容',        //要在富文本框中显示的默认值
               
            });

            //将根节点赋值给接口
            this.content = $el;
        };

        return initialize;
    });
