define(['Util','text!module/workflow/activity/actDetailsPage.tpl'
              ,'text!module/workflow/activity/actDetailsPageInfo.tpl'],
    function (Util,actPageTpl,actPageInfoTpl) {
        //系统变量-定义该模块的根节点
        var $el
            ,_indexModule = null
            ,_param;
        initialize = function(indexModule,param){
            $el = $(actPageTpl);
            _indexModule = indexModule;
            _param = param;
            loadData();
            this.content = $el;
        };
        var loadData = function(){
            Util.ajax.postJson("front/sh/campaign!execute?uid=004&cmpgnId=" + _param.actId, '', function(json,status){
                if(status){
                    Util.ajax.loadTemp($('#G-details-actInfo',$el), actPageInfoTpl, {"bean":json.bean});
                }
            });
        };
        return initialize;
    });