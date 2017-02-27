/**
 * Created by kidd on 2016/11/2.
 */
define([
    'Util'
    ,"date"
    ,'text!module/workflow/resManage/resDetail.tpl'
    ,'text!module/workflow/resManage/typeSelectOption.tpl'
    ,'text!module/workflow/resManage/resDetailList.tpl'],
    function (Util,Date,Tpl,typeTpl,listTpl) {
        //系统变量-定义该模块的根节点
        var $el;
        //系统变量-构造函数
        var _indexModule = null,_param;
        initialize = function(indexModule, param){
            $el = $(Tpl);
            _indexModule = indexModule;
            _param = param;
            //获取活动类型
            getActType();
            //点击搜索清理转变提交参数为表单提交
            resDetailList(false);

            if(_param.param){
                var aParam = {
                    bgnValidTime:_param.param.bTime+" 00:00:00",
                    endValidTime:_param.param.eTime+" 23:59:59",
                    rsTypeCd:_param.param.type
                };
                dateTimeParam(aParam.bgnValidTime,aParam.endValidTime);
                $("#G-type",$el).val(_param.param.type);
                /*if(_param.param.type == "01"){
                 $("#G-type",$el).val('01');
                 }else if(_param.param.type == "02"){
                 $("option[text='优惠券']",$el).attr("selected",true);
                 }else if(_param.param.type == "03"){
                 $("option[text='虚拟物品']",$el).attr("selected",true);
                 }*/
            }else{
                dateTime();
            }

            $el.on('click','.search', function () {
                resDetailList(true);
            });

            //将根节点赋值给接口
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
        //加载时间控件
        var dateTime = function(){
            new Date( {
                el:$('.datetime',$el),
                label:'活动开始：',     //label内容
                mid: '活动结束：',
                double:{    //支持一个字段里显示两个日期选择框
                    start:{
                        value:laydate.now(-14).substring(0,10)+" 00:00:00",
                        name:'bgnValidTime',   //开始日期文本框name
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        min: laydate.now(-9999),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istime: true,
                        istoday: false,
                        choose: function(datas){
                            this.end.min = datas;     //设置结束日期的最小限制
                            this.end.start = datas;     //设置结束日期的开始值
                        }
                    },
                    end:{
                        value:laydate.now().substring(0,10)+" 23:59:59",
                        name:'endValidTime',     //结束日期文本框name
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        min: laydate.now(-1),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istime: true,
                        istoday: false,
                        choose: function(datas){
                            this.start.max = datas;     //设置开始日期的最大日期
                        }
                    }
                }
            });
        };
        //有参数时间控件
        var dateTimeParam = function(bTime,eTime){
            new Date( {
                el:$('.datetime',$el),
                label:'活动开始：',     //label内容
                mid: '活动结束：',
                double:{    //支持一个字段里显示两个日期选择框
                    start:{
                        value:bTime,
                        name:'bgnValidTime',   //开始日期文本框name
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        min: laydate.now(-9999),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istime: true,
                        istoday: false,
                        choose: function(datas){
                            this.end.min = datas;     //设置结束日期的最小限制
                            this.end.start = datas;     //设置结束日期的开始值
                        }
                    },
                    end:{
                        value:eTime,
                        name:'endValidTime',     //结束日期文本框name
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        min: laydate.now(-1),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istime: true,
                        istoday: false,
                        choose: function(datas){
                            this.start.max = datas;     //设置开始日期的最大日期
                        }
                    }
                }
            });
        };
        //获取列表
        var resDetailList = function(searchFlag){

            $('#G-listCon').html();
            var G_params = {
                url : 'front/sh/resources!index?uid=sg001',
                items_per_page : 10 ,                       // 每页数     @param : limit
                page_index : 0 ,                            //当前页  @param : start
                pagination : $('.pagination',$el) ,         //分页id
                searchformId : $('.J_formSearch',$el),      //搜索表单的id
                tabletpl :Util.hdb.compile(listTpl), //表格模板
                tablewrap : $('#G-listCon',$el)//表格容器
            };
            var paramStr;
            if(_param.param && !searchFlag){
                var aParam = {
                    bgnValidTime:_param.param.bTime+" 00:00:00",
                    endValidTime:_param.param.eTime+" 23:59:59",
                    rsTypeCd:_param.param.type
                };
                paramStr = '&bgnValidTime='+aParam.bgnValidTime+'&endValidTime='+aParam.endValidTime+'&rsTypeCd='+aParam.rsTypeCd;

            }else{
                paramStr = $('.J_formSearch',$el).serialize(); //把form序列化
            }
            Util.ajax.pagination(G_params.page_index , true , G_params, paramStr);
        };

        return initialize;
    });