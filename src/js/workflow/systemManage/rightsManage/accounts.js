/**
 * Created by yuanyan on 2016/11/3.
 */
define(['Util', 'text!module/workflow/rightsManage/accList.tpl',
    'text!module/workflow/rightsManage/accListDetail.tpl'
],
    function(Util,Tpl,detailList){
        //系统变量，定义该模块的根节点
       var $el ;
        //系统变量，构造函数
        var _indexModule = null, _param;
        initialize = function(indexModule,param){
            _indexModule = indexModule;
            _param = param;
            $el = $(Tpl);

            $el.on("click","#G-newAccounts", function () {
                _indexModule.main.createTab({
                    title:"新建账号",
                    url:"js/workflow/systemManage/rightsManage/newAccounts",
                    param: { }    //mcdsUnitId: $(this).attr("data-id")
                });
            });

            //将根节点赋值给接口
            //鼠标回车绑定搜索click事件
            $el.on("keypress",".search-input",function (e) {
                if(e.keyCode == 13){
                    getsearchList();
                }
            });
            //绑定搜索事件
            $el.on("click","#G-searchBox",getsearchList);
            getsearchList();
            //绑定查看事件
            $el.on("click",".J_click_detail",function () {
                var userId = $(this).data("id");
                viewDetail(userId);
            });
            //绑定编辑账号事件
            $el.on("click",".J_click_edit",function () {
                var userId = $(this).data("id");
                editAcc(userId);
            });
           //绑定启用账号事件
            $el.on("click",".J_click_operation",operationAct);
            this.content = $el;
            function operationAct () {
                var $this = $(this);
                var validStsCd = $this.attr("validStsCd");
                var userId = $this.data("id");
                if( validStsCd == 1) {      //如果账号启用
                    validStsCd = 0;
                    //向后台请求修改用户状态
                    Util.ajax.postJson("front/sh/user!index?uid=011",{"userId":userId,"validStsCd":validStsCd},function (json,status) {
                        if(status){
                            if (json.returnCode == '0'){
                                $this.attr("validStsCd",'0');
                                $this.text("启用");
                                Util.dialog.tips('停用该用户！');
                            }else{
                                Util.dialog.tips(json.rtnMsg  || '修改用户状态失败！');
                            }
                        }else{
                            Util.dialog.tips(json.rtnMsg  || '修改用户状态失败！');
                        }
                    });

                }else if( validStsCd == 0){                   //如果账号停用则开启账号
                    validStsCd =1 ;
                    //向后台请求修改用户状态
                    Util.ajax.postJson("front/sh/user!index?uid=011",{"userId":userId,"validStsCd":validStsCd},function (json,status) {
                        if(status) {
                            if (json.returnCode == '0'){
                                $this.attr("validStsCd",'1');
                                $this.text("停用");
                                Util.dialog.tips('启用该用户！');
                            }else{
                                Util.dialog.tips(json.rtnMsg || '修改用戶狀態失敗！');
                            }

                        }else{
                            Util.dialog.tips(json.rtnMsg  || '修改用戶狀態失敗！');
                        }
                    });
                }
            }
            //获取账号列表
              function getsearchList() {
                var G_param = {
                    url : "front/sh/user!index?uid=003",                 //front/sh/user!index?uid=003
                    items_per_page : 10 ,                                //每页数据条数
                    page_index : 0 ,                                    //当前页
                    pagination: $(".pagination",$el),                   //分页id
                    searchformId: $(".J_formSearch",$el),              //搜索表单的id
                    tabletpl: Util.hdb.compile(detailList),                           //表格模板
                    tablewrap : $(".search-result",$el)                              //表格容器
                };
                var paramStr = $(".J_formSearch",$el).serialize();           //把form序列化
                Util.ajax.pagination(G_param.page_index , true ,G_param , paramStr);

            }
            //查看账号详细信息
            function  viewDetail(userId) {
                _indexModule.main.createTab({
                    title:"查看账号",
                    url:"js/workflow/systemManage/rightsManage/viewAccounts",   //账号信息查看页面js地址
                    param:{"userId":userId}
                });
            }
            //编辑账号
            function  editAcc(userId) {
                _indexModule.main.createTab({
                    title:"编辑账号",
                    url:"js/workflow/systemManage/rightsManage/editAccounts",   //账号信息编辑页面js地址
                    param:{"userId":userId}
                });
            }
        };

        return initialize;
});