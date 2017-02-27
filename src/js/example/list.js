/**
 *	@author: zhanglizhao
 *	@date: 2016-06-02
 *  这是一个 业务代码编写实例（可复制后 编写业务代码）
 */
define(['Util',"date",'text!module/example/list.tpl','text!module/example/listpl.tpl'],
    function (Util,Date,Tpl,ListTpl) {
        //系统变量-定义该模块的根节点
        var $el = $(Tpl);
        //系统变量-构造函数
        var indexModule = null,param;
        var initialize = function(_indexModule, _param){
            indexModule = _indexModule;
            param=_param;
            example();
            //将根节点赋值给接口
            this.content = $el;
        };
        function example(){
            new Date({
                el:$('#dateTest',$el),
                label:'日期',
                name:'startTime',    //开始日期文本框name
                format: 'YYYY-MM-DD',    //日期格式
                min: laydate.now(0),         //最小日期限制
                istime: true,
                istoday: false,
                choose:function(){} //用户选中日期时执行的回调函数
            });
            //页面渲染后执行函数-业务代码入口
            var G_params = {
                url : "src/assets/data/list.json",
                items_per_page : 10 ,   // 每页数     @param : limit
                page_index : 0 , //当前页  @param : start
                pagination : $("#Pagination",$el) , //分页id
                searchformId : $("#J_formSearch",$el), //搜索表单的id
                tabletpl :$(ListTpl), //表格模板
                tablewrap : $('#listContent',$el) //表格容器
            };
            Util.ajax.pagination( G_params.page_index , true , G_params, $("#J_formSearch",$el).serialize());
        }
        return initialize;
    });