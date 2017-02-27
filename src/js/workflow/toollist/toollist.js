define(['Util'
    ,'text!module/workflow/toollist/tool.tpl'
    ,'text!module/workflow/toollist/toollist.tpl'],
    function (Util,toolTpl,toollistTpl) {
        //系统变量-定义该模块的根节点
        var $el = $(toolTpl);
        //系统变量-构造函数
        var _indexModule = null,_param;
		initialize = function(indexModule, param){
            _indexModule = indexModule;
            _param = param;
            loadData();
            $el.on('click','.tool-box',openToolsEdit);
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
        var openToolsEdit = function(){
            var $this = $(this)
                ,cType = $this.data('ctype')
                ,type = $this.data('type')
                ,name = $this.data('name')
                ,cs = $this.data('class')
                ,url = $this.data('url');
            _indexModule.main.createTab({
                title:'新建'+name+'营销活动',
                url:url,
                param:{editFlag:'1',activityTit:'新建'+name+'营销活动',activityType:type,newFlag:'0',backTit:'营销组件',cType:cType,actNm:name,actClass:cs}
            });
        };

        
        return initialize;
    });