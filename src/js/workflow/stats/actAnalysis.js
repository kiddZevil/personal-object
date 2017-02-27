define([
    'Util',
    'date',
    'text!module/workflow/stats/actAnalysis/actIndex.tpl'
    ,'text!module/workflow/stats/actAnalysis/typeSelectOption.tpl'
    ,'text!module/workflow/stats/actAnalysis/actList.tpl'],
    function (Util,Date,indexTpl,typeTpl,listTpl) {
        //系统变量-定义该模块的根节点
        var $el
            ,ACTIVE = 'active'
            ,_indexModule = null
            ,_param;
        initialize = function(indexModule, param){
            $el = $(indexTpl);
            _indexModule = indexModule;
            _param = param;
            getActType();
            $el.on('click','.nav-tab', changeTab);
            $el.on('click','.search', getActivityList);
            $el.on('click','.export', exportActivityList);
            $el.on('click','.open-details', function(e){
                operationActivity($(this));
            });
            getActivityList();
            dateTime();
            this.content = $el;
        };
        //获取活动类型
        var getActType = function(){
            var $typeListDom = $('#G-select-list',$el);
            Util.ajax.postJson("src/assets/data/cmpgnTypeCd.json",'', function(json,status){
                if(status){
                    var data = json.object;
                    Util.ajax.loadTemp($typeListDom,typeTpl,{'cmpgnType':data});
                }
            });
        };
        //tab切换
        var changeTab = function(){
            $(this,$el).closest("ul").find('li').removeClass('active');
            $(this).closest("li").addClass('active');
            getActivityList();

        };
        //获取时间
        var dateTime = function(){
            new Date( {
                el:$('.datetime',$el),
                label: '活动开始时间：',
                mid: '活动结束时间：',
                double:{    //支持一个字段里显示两个日期选择框
                    start:{
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        name:'bgnValidTime',   //开始日期文本框name
                        //min: laydate.now(),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istoday: false,
                        choose: function(datas){
                            this.end.min = datas;     //设置结束日期的最小限制
                            this.end.start = datas;     //设置结束日期的开始值
                        }
                    },
                    end:{
                        name:'endValidTime',     //结束日期文本框name
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        //min: laydate.now(),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istoday: false,
                        choose: function(datas){
                            this.start.max = datas;     //设置开始日期的最大日期
                        }
                    }
                }
            });

        };
        //获取活动列表
        var getActivityList = function(){
            var type = '';
            $('.nav-tab',$el).each(function(){
                if($(this).hasClass(ACTIVE)){
                    type =  $(this).data('flag');
                }
            });
            var G_params = {
                url : 'front/sh/campaign!execute?uid=os003&cmpgnStsCd=' + type,
                items_per_page : 10 ,                       // 每页数     @param : limit
                page_index : 0 ,                            //当前页  @param : start
                pagination : $('.pagination',$el),         //分页id
                searchformId : $('.J_formSearch',$el),      //搜索表单的id
                tabletpl :Util.hdb.compile(listTpl), //表格模板
                tablewrap : $('.listContent',$el)//表格容器
            };
            var paramStr = $('.J_formSearch',$el).serialize();
            Util.ajax.pagination(G_params.page_index , true , G_params,paramStr);
        };
        //导出
        var exportActivityList = function(){
            var type = '';
            $('.nav-tab',$el).each(function(){
                if($(this).hasClass(ACTIVE)){
                    type =  $(this).data('flag');
                }
            });
            var paramStr = $('.J_formSearch',$el).serialize();
            Util.ajax.postJsonAsync('front/sh/campaign!exportCmpgnStatList?uid=os003&cmpgnStsCd=' + type,paramStr,function(json,status) {
                if (status) {
                    window.location.href = json.bean.url;
                }else{
                    Util.dialog.tips('导出失败');
                }
            });
        };
        var operationActivity = function(el){
            var $this = el
                ,type = $this.parents('tr').data('type')
                ,actId = $this.parents('tr').data('id')
                ,bTime = $this.parents('tr').data('btime')
                ,eTime = $this.parents('tr').data('etime')
                ,url
                ,param;
            if(type == '01'){
                url = 'js/workflow/stats/groupAnalysis';
                param = {activityTit:'活动数据分析',activityType:type,actId:actId,backTit:'营销活动分析',bTime:bTime,eTime:eTime};
            }else if(type == '02'){
                url = 'js/workflow/stats/seckillAnalysis';
                param = {activityTit:'活动数据分析',activityType:type,actId:actId,backTit:'营销活动分析',bTime:bTime,eTime:eTime};
            }else if(type == '03'){
                url = 'js/workflow/stats/luckdrawStats';
                param = {activityTit:'活动数据分析',activityType:type,actId:actId,backTit:'营销活动分析',bTime:bTime,eTime:eTime};
            }else if(type == '04'){
                url = 'js/workflow/stats/signAnalysis';
                param = {activityTit:'活动数据分析',activityType:type,actId:actId,backTit:'营销活动分析',bTime:bTime,eTime:eTime};
            }else if(type == '05'){
                url = 'js/workflow/stats/propagateStats';
                param = {activityTit:'活动数据分析',activityType:type,actId:actId,backTit:'营销活动分析',bTime:bTime,eTime:eTime};
            }
            _indexModule.main.createTab({
                title:'活动数据分析',
                url: url,
                param: param
            });
        };
        return initialize;
    });