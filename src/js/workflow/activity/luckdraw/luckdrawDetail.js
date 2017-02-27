define(['Util','text!module/workflow/activity/actDetailsPage.tpl'
              ,'text!module/workflow/activity/actDetailsPageInfo.tpl'
              ,'text!module/workflow/activity/luckdraw/luckdrawDetail.tpl'
    ],
    function (Util,actPageTpl,actPageInfoTpl,actTableTpl) {
        //系统变量-定义该模块的根节点
        var $el
            ,_indexModule = null
            ,_param;
		initialize = function(indexModule, param){
            $el = $(actPageTpl);
            _indexModule = indexModule;
            _param = param;
            loadData();  
            this.content = $el;
        };
        function loadData() {   //加载数据
            Util.ajax.postJson("front/sh/luckdraw!execute?uid=lu003&cmpgnId=" + _param.actId,"",function (json,status) {
                if(status){
                    var bean = json.bean;
                    var object = json.object;
                    Util.ajax.loadTemp($("#G-details-actInfo",$el),actPageInfoTpl,{'bean':bean});  //渲染抽奖活动信息
                    Util.ajax.loadTemp($("#G-details-resInfo",$el),actTableTpl,{'beans':formatData(object),"imgUrl":bean.ftpUrl});  //渲染抽奖详细信息
                }
            })
        }
        //格式化服务器返回的数据
        function formatData(data) {
            var bean
                ,object = []       //奖品等级数组
                ,cmpnList = [] ;    //每个等级下的奖品内容数组;    //获取奖品等级的数量
                $.each(data,function (index) {
                    var beans = data[index].beans;
                    var _len = beans.length;
                    for(var i=0; i<_len; i++){
                        cmpnList.push({
                            "rsNm":beans[i].rsNm,
                            "cmpgnRsId":beans[i].cmpgnRsId,
                            "prizePreprQty":beans[i].prizePreprQty,
                            "prizePicUrlAddr":beans[i].prizePicUrlAddr
                        });
                    }
                    bean = data[index].bean;
                    object.push({
                        "przdrwPrzitmId":bean.przdrwPrzitmId,
                        "lvlCd":bean.lvlCd,
                        "lvlNm":bean.lvlNm,
                        "winprzRate":bean.winprzRate,
                        "prizeItemQty":bean.prizeItemQty,
                        "przitmPicUrlAddr":bean.przitmPicUrlAddr,
                        "cmpnTotal":cmpnList.length,
                        "cmpnList":cmpnList
                    });
                    cmpnList = [];
                });
           return object;
        }
        return initialize;
    });