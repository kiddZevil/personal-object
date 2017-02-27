/**
 * Created by yuanyan on 2016/11/3.
 */
define(['Util', 'text!module/workflow/rightsManage/viewAccounts.tpl'],
    function(Util,Tpl){
        //系统变量，定义该模块的根节点
       var $el = $(Tpl);
        //系统变量，构造函数
        var _indexModule = null, _param;
        initialize = function(indexModule,param){
            _indexModule = indexModule;
            _param = param;
            initSelect();     //初始化页面下拉框
            initialAcc(_param.param);       //初始化账户信息
            $el.on("click","#return-btn", function () {
                _indexModule.main.createTab({
                    title:"新建账号",
                    url:"js/workflow/systemManage/rightsManage/accounts",
                    param: { }    //mcdsUnitId: $(this).attr("data-id")
                });
            });

            //将根节点赋值给接口
            this.content = $el;
            function initialAcc(param) {
                Util.ajax.postJson("front/sh/user!index?uid=007",param,function (json,status) {
                    if(status){
                        if(json.returnCode == "0"){
                           $(".account-name").attr("value",json.bean.userNm);
                            $(".channel-select option[value="+json.bean.srcChnlId +"]").attr("selected",true);
                            $(".accPassword").attr("value",json.bean.userLoginPw);
                            $(".role-select option[value="+ json.bean.roleId +"]").attr("selected",true);
                        }else{
                            Util.dialog.tips(json.rtnMsg);
                        }
                    }else{
                        Util.dialog.tips(json.rtnMsg);
                    }
                })
            }
            //下拉框初始化
            function initSelect() {
                //获取渠道下拉框
                Util.ajax.postJson("front/sh/user!index?uid=010","",function (json,status) {
                    if(status){
                        $("#channel-select").append("<option value='-1'>请选择</option>");
                        for(var i = 0; i <json.beans.length; i++ ){
                            $("#channel-select").append("<option value=" + json.beans[i].mktgChnlId + ">" + json.beans[i].mktgChnlNm + "</option>");
                        }
                    }
                });
                //获取角色下拉框
                Util.ajax.postJson("front/sh/user!index?uid=009","",function (json,status) {
                    if(status){
                        $("#role-select").append("<option value='-1'>请选择</option>");
                        for(var i = 0; i <json.beans.length; i++ ){
                            $("#role-select").append("<option value=" + json.beans[i].roleId + ">" + json.beans[i].roleNm + "</option>");
                        }
                    }
                });
            }
        };
        return initialize;
});