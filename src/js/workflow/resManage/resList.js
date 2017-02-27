/**
 * Created by kidd on 2016/11/2.
 */
define(['Util',
    'text!module/workflow/resManage/resListHeader.tpl',
    'text!module/workflow/resManage/resList.tpl'],
    function (Util,Tpl,listTpl) {
        //系统变量-定义该模块的根节点
        var $el;
        //系统变量-构造函数
        var _indexModule = null,_param;
        initialize = function(indexModule, param){
        	$el = $(Tpl);
        	_indexModule = indexModule;
            _param = param;            
            resList();
            $el.on("click",".search",resList);
            $el.on("click",".oper-activity",operationActivity);
            $el.on("click",".oper-check",operationCheck);
            $el.on("click","#G-newRes",function(){
                _indexModule.main.createTab({
                    title:"新建营销资源",
                    url:"js/workflow/resManage/newRes",
                    //需要传参时用到
                   param:{pageTit:"新建资源",backTit:'资源列表'}
                });
            });
            //将根节点赋值给接口
            this.content = $el;
        };
        //获取列表
        var resList = function(){
        	$('#G-listCon',$el).html();
            var G_params = {
                url : 'front/sh/resources!index?uid=s001',
                items_per_page : 10 ,                       // 每页数     @param : limit
                page_index : 0 ,                            //当前页  @param : start
                pagination : $('.pagination',$el) ,         //分页id
                searchformId : $('.J_formSearch',$el),      //搜索表单的id
                tabletpl :Util.hdb.compile(listTpl), //表格模板
                tablewrap : $('#G-listCon',$el)//表格容器
            };
            var paramStr = $('.J_formSearch',$el).serialize(); //把form序列化
            Util.ajax.pagination(G_params.page_index , true , G_params, paramStr);
        };
        var operationActivity = function(){
            var $this = $(this),
            	$thisTr = $this.parents('tr')
                ,operation = $this.data('operation'),	  //
                state = $thisTr.data('state');//资源状态
            var param = {
                'cmpgnRsId':$thisTr.data('id'),//资源id
                'validStsCd': state                        //资源状态
            };
            //0,为已停用,1为以启用
            if(operation == 'begin-activity' || operation == 'stop-activity'){
                if(state == '0'){
                    $this.text('停用');
                    $thisTr.data('state','1');
                    param.validStsCd = 1;
                }else{
                    $this.text('启用');
                    $thisTr.data('state','0');
                    param.validStsCd = 0;
                }
            }
            Util.ajax.postJson("front/sh/resources!index?uid=us001", param, function(json,status){
                if(status){
                	Util.dialog.tips("操作成功");
                	if(param.validStsCd == 1){
                		$thisTr.find('.t-tag-todo').show();
                		$thisTr.find('.t-tag').hide();
                	}else{
                		$thisTr.find('.t-tag').show();
                		$thisTr.find('.t-tag-todo').hide();
                	}                	
                }else{
                    Util.dialog.tips(json.returnMessage);
                }
            });
        };
        var operationCheck = function(){
        	var $this = $(this),
        	$thisTr = $this.parents('tr')
            ,id = $thisTr.data('id');
        	_indexModule.showDialog({
                 id : 'lookAct',
                 title : '资源详情',
                 url : 'js/workflow/resManage/listDialog',
                 width:850,
                 height:410,
                 param :{actId:id}
             });
        }
        return initialize;
    });