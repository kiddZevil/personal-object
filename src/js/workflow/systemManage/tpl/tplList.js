/**
 * Created by kidd on 2017/1/12.
 */
define(['Util',
        'text!module/workflow/tplManage/tplListHeader.tpl',
        'text!module/workflow/tplManage/typeSelectOption.tpl',
        'text!module/workflow/tplManage/tplList.tpl'],
    function (Util,Tpl,typeTpl,listTpl) {
        //系统变量-定义该模块的根节点
        var $el;
        //系统变量-构造函数
        var _indexModule = null,_param;
        initialize = function(indexModule, param){
            $el = $(Tpl);
            _indexModule = indexModule;
            _param = param;
            getCtype();
            tplList();
            $el.on("click",".search",tplList);
            $el.on("click",".oper-activity",operationActivity);
            $el.on("click","#G-newRes",function(){
                _indexModule.main.createTab({
                    title:"新建模板",
                    url:"js/workflow/systemManage/tpl/addTpl",
                    //需要传参时用到
                    param:{pageTit:"新建模板",backTit:'模板列表'}
                });
            });
            //将根节点赋值给接口
            this.content = $el;
        };
        //获取列表
        var tplList = function(){
            $('#G-listCon',$el).html();
            var G_params = {
                url : 'front/sh/campaign!execute?uid=m001&flag=true',
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
                ,operation = $this.data('operation'),
                _id = $thisTr.data('id'),
                state = $thisTr.data('state');//状态
            var param = {
                'cmpgnRsId':$thisTr.data('id'),//id
                'validStsCd': state                        //状态
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
            Util.ajax.postJson("front/sh/campaign!execute?uid=m002&tmpltId="+_id, param, function(json,status){
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
        /*
         *
         * 获得子模版并渲染
         * @param type 活动类型
         */
        var getCtype = function(){
            var $typeListDom = $('#G-select-list',$el);
            Util.ajax.postJson("src/assets/data/cmpgnTypeCd.json",'', function(json,status){
                if(status){
                    var data = json.object;
                    Util.ajax.loadTemp($typeListDom,typeTpl,{'cmpgnType':data});
                }
            });
        };
        return initialize;
    });