/**
 *	@author: zhanglizhao
 *	@date: 2016-06-02
 *  这是一个 业务代码编写实例（可复制后 编写业务代码）
 */
define(['Util',"upload"],
    function (Util,Upload) {
        console.log(Upload);
        //系统变量-定义该模块的根节点
        var $el = $('<div style="padding: 10px 50px;"><div>这是一个编辑器</div><div class="editor"></div><div style="padding: 50px 10px"> <input id="fileupload" type="file" name="Filedata" accept="image/*" /></div></div>');
        //系统变量-构造函数
        var indexModule = null,param;
        var initialize = function(_indexModule, _param){
            indexModule = _indexModule;
            param=_param;
            //页面加载完成后执行方法
            //页面加载完成后执行方法
            this.renderCallback=function(){
                // 上传组件示例（由于没有封装、暂时引用后使用原生的写法）
                $('#fileupload').fileupload({
                    url : 'front/sh/common!uploadImgDetail?uid=up001',
                    dataType : 'json',
                    disableImageResize:false,
                    imageMaxWidth: 480,
                    imageMaxHeight: 480,
                    add: function (e, data) {
                        console.log('upload started.');
                        data.submit();
                    },
                    done : function(e, data) {
                        if (data.result.returnCode == '0') {
                            console.log('uploaded.');
                        }
                    }
                });
            };

            //将根节点赋值给接口
            this.content = $el;
        };

        return initialize;
    });
