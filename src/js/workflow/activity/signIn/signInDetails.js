define(['Util'
        ,'text!module/workflow/activity/actDetailsPage.tpl'
        ,'text!module/workflow/activity/actDetailsPageInfo.tpl'
        ,'text!module/workflow/activity/signIn/signInDetailsCon.tpl'
    ],
    function (Util,actPageTpl,actPageInfoTpl,detailsConTpl) {
        //系统变量-定义该模块的根节点
        var $el = $(actPageTpl)
            ,_indexModule = null
            ,_param;
        initialize = function(indexModule,param){
            _indexModule = indexModule;
            _param = param;
            loadData();
            this.content = $el;
        };
        var loadData = function(){
            Util.ajax.postJson("front/sh/sign!execute?uid=si003&cmpgnId=" + _param.actId, '', function(json,status){
                
            	if(status){
                	//var data = JSON.parse(json.bean.signParam);
                    var bean = json.bean
                        ,beans = json.beans;                  
                    Util.ajax.loadTemp($('#G-details-actInfo',$el), actPageInfoTpl, {"bean":bean});
                    Util.ajax.loadTemp($('#G-details-resInfo',$el), detailsConTpl,{"beans":beans,"imgUrl":bean.ftpUrl});
                }
            });
        };
        return initialize;
    });