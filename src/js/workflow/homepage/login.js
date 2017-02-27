/**
 * Created by yuanyan on 2016/11/21.
 */
$(function () {
    //判断是否输入框兼容placeholder属性
    if(!isSupportPlaceholder()){  //不支持使用jquery来完成
        $('input').not('input[type="password"]').each(
            function () {
                var self = $(this);
                var val = self.attr('placeholder');
                input(self,val);
            }
        );
        //对密码框的特殊处理
        $('input[type="password"]').each(function () {
            var pwdField = $(this);
            var pwdVal = pwdField.attr('placeholder');
            var pwdId = pwdField.attr('id');
            pwdField.after('<input class="login_text" id="' + pwdId + '1" value=" ' + pwdVal+ '"autocomplete="off" />');
            var placeholder = $('#' +pwdId+ '1');
            placeholder.show();
            pwdField.hide();

            placeholder.focus(function () {
                placeholder.hide();
                pwdField.show();
                pwdField.focus();
            });
            pwdField.blur(function () {
                if(pwdField.val() == ''){
                    placeholder.show();
                    pwdField.hide();
                }
            });
        });
    }
    flushValidateCode();  //页面加载后首先刷新验证码
    $('#codeValidateImg').click(function () {
        flushValidateCode();  //点击验证码图片时图片刷新
    });
    $("#G-login-btn").click(function () {
        clearError();  //登录按钮
        verification();
    });
    //绑定回车登录
    $("body").keydown(function () {
        if(event.keyCode == '13'){
            clearError();  //登录按钮
            verification();
        }
    });
    $('.user-input').keyup(function(){
        var len = $(this).val().length;
        if(len > 20){
            $(this).val($(this).val().substring(0,20))
        }
    });
    $('.pas-input').keyup(function(){
        var len = $(this).val().length;
        if(len > 20){
            $(this).val($(this).val().substring(0,20))
        }
    });
});
//清除错误信息
function clearError() {
    $('#J_username_wrapper').addClass('fn-hide');
    $('#J_password_wrapper').addClass('fn-hide');
    $('#J_code_wrapper').addClass('fn-hide');
}
//清除表单内容
function clearMsg() {
    $('.user-input').val('');
    $('.pas-input').val('');
    $('.code-input').val('');
}
//验证表单内容
function verification() {
    var userNm = $.trim($(".user-input").val());
    var userLoginPw = $.trim($('.pas-input').val());
    var code = $.trim($('.code-input').val());
    if ( userNm.replace(/\s+/g,"") == ""){
        $("#J_username_wrapper").removeClass("fn-hide");   //用户名
        return false;
    }
    if ( userLoginPw.replace(/\s+/g,"") == ""){
        $("#J_password_wrapper").removeClass("fn-hide");   //密码
        return false;
    }
    if ( code.replace(/\s+/g,"") == ""){
        $("#login-tips").html("验证码不能为空");
        $("#J_code_wrapper").removeClass("fn-hide");   //验证码
        return false;
    }
    var param = {
        'username':userNm,
        'password':strEnc(userLoginPw,"des1","des2","des3"),
        'ncode':code
    };
    $.post("front/sh/user!login?uid=l001",param,function (json) {
        if(json.returnCode == '0'){
            clearMsg();  //清空表单信息
            window.location.href = 'index.html';
        }else if(json.bean.errorCode == '0006'){
            //验证码不匹配
            $("#login-tips").html(json.errorMsg || "验证码错误！");
            $("#J_code_wrapper").removeClass("fn-hide");
            $('.code-input').val('');  // 清空验证码输入内容
            flushValidateCode();    //重新刷新验证码
        }else if(json.bean.errorCode == '0001'){
            //账户密码不匹配
            $("#login-tips").html(json.errorMsg || "账户或密码错误！");
            $("#J_code_wrapper").removeClass("fn-hide");
            $('.code-input').val('');  // 清空验证码输入内容
            flushValidateCode();    //重新刷新验证码
        }
    },'json');

}
//刷新验证码
function flushValidateCode() {
    $('#codeValidateImg').attr('src','front/sh/user!getImageCode?uid=n001&time=' + new Date().getTime());
}
//对placeholder的兼容性处理
function isSupportPlaceholder() {
    var input = document.createElement("input");
    return 'placeholder' in input;
}
//jquery兼容输入框处理
function input(obj,val) {
    var $input = obj, val = val;
    $input.attr('value',val);
    $input.focus(function () {
        if($input.val() == val){
            $(this).attr('value','');
        }
    }).blur(function () {
        if($input.val() == ''){
            $(this).attr('value',val);
        }
    });
}
function  setCookie(name, value, expires) {
    var str = name + "=" + encodeURIComponent(value);
    if (expires != undefined && expires != null && expires != '') {
        if (expires == 0) {expires = 100*365*24*60;}
        var exp = new Date();
        exp.setTime(exp.getTime() + expires*60*1000);
        str += "; expires=" + exp.toGMTString();
    }
    document.cookie = str;
}

