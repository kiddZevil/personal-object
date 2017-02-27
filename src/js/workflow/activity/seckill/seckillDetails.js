define(['Util'
        ,'text!module/workflow/activity/actDetailsPage.tpl'
        ,'text!module/workflow/activity/actDetailsPageInfo.tpl'
        ,'text!module/workflow/activity/seckill/seckillDetailsCon.tpl'
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
            Util.ajax.postJson("front/sh/seckill!execute?uid=002&cmpgnId=" + _param.actId, '', function(json,status){
                if(status){
                    var bean = json.bean
                        ,beans = json.beans;
                    Util.ajax.loadTemp($('#G-details-actInfo',$el), actPageInfoTpl, {"bean":bean});
                    Util.ajax.loadTemp($('#G-details-resInfo',$el), detailsConTpl,{"beans":formatData(beans),"imgUrl":bean.ftpUrl});
                }
            });
        };
        /*格式化服务器返回数据*/
        var formatData = function(date){
            var beans = date
                ,j = 0
                ,object = []
                ,cmpnList = []
                ,len = beans.length - 1;
            $.each(beans,function(index){
                var mcdsId = beans[j].mcdsId; //获取第一个资源的ID
                if(beans[index].mcdsId == mcdsId){
                    cmpnList.push({
                        "bgnTime": beans[index].bgnTime,
                        "finishTime": beans[index].finishTime,
                        "componNm": beans[index].mcdsUnitNm,
                        "setupQty": beans[index].preprQty,
                        "origUprc": beans[index].origUprc,
                        "pmtUprc": beans[index].pmtUprc,
                        "lmtpchsFlag": beans[index].lmtpchsFlag,
                        "lmtpchsQty": beans[index].lmtpchsQty,
                        "rsComponId": beans[index].mcdsUnitId,
                        "componPicUrlAddr": beans[index].componPicUrlAddr
                    });
                }else{
                    j = index;
                    object.push({
                        "mcdsId": beans[index-1].mcdsId, //商品ID
                        "rsNm": beans[index-1].mcdsNm //商品名称
                        ,"cmpnTotal": cmpnList.length
                        ,"cmpnList": cmpnList
                    });
                    cmpnList = [];
                    cmpnList.push({
                        "bgnTime": beans[index].bgnTime,
                        "finishTime": beans[index].finishTime,
                        "componNm": beans[index].mcdsUnitNm,
                        "setupQty": beans[index].preprQty,
                        "origUprc": beans[index].origUprc,
                        "pmtUprc": beans[index].pmtUprc,
                        "lmtpchsFlag": beans[index].lmtpchsFlag,
                        "lmtpchsQty": beans[index].lmtpchsQty,
                        "rsComponId": beans[index].mcdsUnitId,
                        "componPicUrlAddr": beans[index].componPicUrlAddr
                    });
                }
                if(index == len){
                    object.push({
                        "mcdsId": beans[index].mcdsId, //商品ID
                        "rsNm": beans[index].mcdsNm //商品名称
                        ,"cmpnTotal": cmpnList.length
                        ,"cmpnList": cmpnList
                    });
                }
            });
            return object;
        };
        return initialize;
    });