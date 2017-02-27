/**
 * Created by yuanyan on 2016/11/3.
 */
define(["Util","assets/common/des","text!module/workflow/rightsManage/editAccounts.tpl"],
    function (Util,passwordDes,Tpl) {
        //系统变量-定义该模块的根节点
        var $el ;
        //系统变量-构造函数
        var _indexModule = null ,_param;
        initialize = function (indexModule,param) {
            _indexModule = indexModule ;
            _param = param ;
           $el = $(Tpl);
            initSelect();     //初始化页面下拉框
            initialAcc(_param.param);       //初始化账户信息
            clearError();
            //绑定提交表单事件
            $el.on("click","#submit-btn",function () {
                var flag =false;
                //验证表单内容是否填写
                if (flag == true) {
                    return false;   //不能重复点击提交按钮
                }
                     clearError();
                     verification();
            });
            //绑定取消事件
            $el.on("click","#cancel-submit",function () {
            	clearError();
                //返回到权限管理列表
                _indexModule.main.createTab({
                    title:"权限管理",
                    url : "js/workflow/systemManage/rightsManage/accounts",
                    param : {"start":1,"limit":10}
                })
            });
            //将根节点赋值给接口
            this.content = $el;
            //表单长度限制
            $('input[name="account"]',$el).keyup(function(){
                var len = $(this).val().length;
                if(len > 20){
                    $(this).val($(this).val().substring(0,20))
                }
            });
            // 清除错误提示信息
            function clearError(){
                $('#J-account-name_wrapper').addClass('fn-hide');
                $('#J-account-als_wrapper').addClass('fn-hide');
                $('#J-channel_wrapper').addClass('fn-hide');
                $('#J-password_wrapper').addClass('fn-hide');
                $('#J-rePassword_wrapper').addClass('fn-hide');
                $('#J-roles_wrapper').addClass('fn-hide');
            }
            //校验表单信息
            function verification () {
                var userNm = $.trim($(".account-name").val());
                var userAls = $.trim($(".account-als").val());
                var length = strlen(userNm);
                var alsLen = strlen(userAls);
                var channel = $('.channel-select option:selected').val();
                var password = $.trim($('.accPassword').val());
                var repassword = $.trim($('.rePassword').val());
                var role = $('.role-select option:selected').val();
                var userId = $('#userId').val();
                // if (length<4 || length>20){
                //     $("#J-account-name_wrapper").removeClass("fn-hide");   //账号
                //     return false;
                // }

                //昵称验证
                if(  alsLen < 1 || alsLen > 12){
                    $('#J-account-als').html('昵称必须是1-12位字符组成');
                    $("#J-account-als_wrapper").removeClass("fn-hide");   //账号
                    return false;
                }else if ( !(/^[\w\u4E00-\u9FA5\uF900-\uFA2D]*$/).test(userAls) ){
                    $("#J-account-als_wrapper").removeClass("fn-hide");   //账号
                    $('#J-account-als').html('昵称只含有汉字、数字、字母、下划线不能以下划线开头和结尾');
                    return false;
                }

                if (channel == '-1') {
                    $('#J-channel_wrapper').removeClass('fn-hide');    //渠道
                    return false;
                }
                if( password != ""){
                    if(!((/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,20}$/).test(password) )){
                        $('#J-password').html('请输入8-20位数字、字母或特殊字符组成的密码');
                        $('#J-password_wrapper').removeClass('fn-hide');
                        return false;                                      //密码
                    }
                }else{
                    $('#J-password').html('密码不能为空');
                    $('#J-password_wrapper').removeClass('fn-hide');
                    return false;                                      //密码
                }
                if (password != repassword) {
                    $('#J-rePassword_wrapper').removeClass('fn-hide');
                    return false;
                }
                if (role == '-1') {
                    $('#J-roles_wrapper').removeClass('fn-hide');
                    return false;                                //角色
                }
                var param = {
                    "userNm":userNm,
                    "userAls": userAls,
                    "srcChnlId":channel,
                    "userLoginPw":strEnc(password,"des1","des2","des3"),
                    "roleId":role,
                    "userId":userId
                };
                Util.ajax.postJson("front/sh/user!updateUserAcct?uid=001",param,function (json,status) {
                    if(status){
                        if(json.returnCode == '0'){
                            //页面跳转到权限管理页面
                            _indexModule.main.createTab({
                                title: "权限管理",
                                url: "js/workflow/systemManage/rightsManage/accounts",
                                param: { }
                            });
                            flag = true;
                        }else {
                            Util.dialog.tips(json.returnMessage || "更新账户失败！");
                        }
                    }else {
                        Util.dialog.tips(json.returnMessage || "更新账户失败！");    //错误提示信息
                    }
                });
                flag = false;
            }
            //判断字符长度
            function strlen(str){
                var len = 0;
                for (var i=0; i<str.length; i++) {
                    var c = str.charCodeAt(i);
                    //单字节加1
                    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                        len++;
                    }
                    else {
                        len+=2;
                    }
                }
                return len;
            }
            //初始化账户信息
            function initialAcc(param) {
              
                Util.ajax.postJson("front/sh/user!index?uid=007",param,function (json,status) {
                    if(status){
                        if(json.returnCode == "0"){
                            $(".account-name").attr("value",json.bean.userNm);
                            $(".account-als").attr("value",json.bean.userAls);
                            $(".channel-select").val(json.bean.srcChnlId);
                            $("#userId").attr("value",json.bean.userId);
                            $(".role-select").val(json.bean.roleId);
                        }else{
                            Util.dialog.tips(json.rtnMsg || "获取信息失败");
                        }
                    }else{
                        Util.dialog.tips(json.rtnMsg || "获取信息失败");
                    }
                });
            }
            //下拉框初始化
            function initSelect() {
                var channelDom = $("#channel-select",$el);
                var rolelDom = $("#role-select",$el);
                var channelArr = [];
                var roleArr = [];
                //获取渠道下拉框
                Util.ajax.postJsonAsync("front/sh/user!index?uid=010","",function (json,status) {
                    if(status){
                        channelArr.push('<option value="-1">请选择</option>');
                        for(var i = 0; i <json.beans.length; i++ ){
                            channelArr.push("<option value=" + json.beans[i].mktgChnlId + ">" + json.beans[i].mktgChnlNm + "</option>");
                        }
                        channelDom.append(channelArr);
                    }
                });
                //获取角色下拉框
                Util.ajax.postJsonAsync("front/sh/user!index?uid=009","",function (json,status) {
                    if(status){
                        roleArr.push('<option value="-1">请选择</option>');
                        for(var i = 0; i <json.beans.length; i++ ){
                            roleArr.push("<option value=" + json.beans[i].roleId + ">" + json.beans[i].roleNm + "</option>");
                        }
                        rolelDom.append(roleArr);
                    }
                });
            }
        };
        return initialize;
});