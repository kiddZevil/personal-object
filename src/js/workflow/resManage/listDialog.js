define(['Util','text!module/workflow/resManage/checkDialog.tpl','text!module/workflow/resManage/checkDialogList.tpl'],
    function (Util,checkDialog,checkDialogList) {
        //系统变量-定义该模块的根节点
        var $el
            ,_indexModule = null
            ,_param;
        initialize = function(indexModule,param){
            $el = $(checkDialog);
            _indexModule = indexModule;
            _param = param;
            loadData();
            this.content = $el;
        };
        
        var loadData = function(){
        	/* Util.ajax.loadTemp($('#G-details-actInfo',$el), checkDialog, {"bean":data});
             */
            Util.ajax.postJson("front/sh/resources!index?uid=b001&cmpgnRsId=" + _param.actId, '', function(json,status){
                if(status){
                    Util.ajax.loadTemp($('#G-tbody',$el), checkDialogList, {"bean":json.bean});
                }
            });
        };
        return initialize;
    });