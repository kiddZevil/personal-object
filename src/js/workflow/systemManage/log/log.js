define(['Util'
        ,'text!module/workflow/toollist/tool.tpl'
        ,'text!module/workflow/toollist/toollist.tpl'],
    function (Util,toolTpl,toollistTpl) {
        //系统变量-定义该模块的根节点
        var $el
            ,_indexModule = null
            ,_param;
        initialize = function(indexModule, param){
            $el = $(toolTpl);
            _indexModule = indexModule;
            _param = param;
            loadData();
            //将根节点赋值给接口
            this.content = $el;
        };
        var loadData = function(){
            Util.ajax.getJson("src/assets/data/toollist.json",'',function(json,status){
                if (status) {
                    var beans = json.beans;
                    Util.ajax.loadTemp($('#G-toollist',$el),toollistTpl,{"beans":beans});
                }
            });
        };
        return initialize;
    });