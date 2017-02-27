/**
 * Created by yuanyan on 2016/11/7.
 */
define(["Util","text!module/workflow/channelManage/editChannel.tpl"],
    function (Util,Tpl) {
        //系统变量，定义该模块的根节点
        var $el = $(Tpl);
        //系统变量，构造函数
        var _indexModule = null, _param;
        initialize =function (indexModule,param){
            _indexModule = indexModule;
            _param = param;
            initChannel(_param);
            //绑定确定事件
            $el.on("click","#G-confirm",function () {
                var flag =false;
                //验证表单内容是否填写
                if (flag == true) {
                    return false;   //不能重复点击提交按钮
                }
                clearError();
            });
            this.content = $el;
            //表单长度限制
            $('.mktgChnlNm',$el).keyup(function(){
                var len = $(this).val().length;
                if(len > 20){
                    $(this).val($(this).val().substring(0,20))
                }
            });
            //初始化渠道信息
          function initChannel(param){
              Util.ajax.postJson("front/sh/user!index?uid=008",param,
                  function (json,status) {
                  if(status){
                      if(json.returnCode == "0"){
                            $(".channel-name").attr("value",json.bean.mktgChnlNm);
                            $(".channel-code").attr("value",json.bean.mktgChnlId);
                            $(".setTime").attr("value",json.bean.crtTime);
                            $(".crtUserNm").attr("value",json.bean.crtUserNm);
                            $(".chnlRspderNm").attr("value",json.bean.chnlRspderNm);
                            $(".chnlRspderTelnum").attr("value",json.bean.chnlRspderTelnum);
                            $(".validStsCd").html(json.bean.validStsCd);
                            //读取cookie信息
                          $("#founder",$el).attr('value',$('#userInfo_hid').val());
                      }else{
                          Util.dialog.tips(json.rtnMsg);
                      }
                  }else{
                      Util.dialog.tips(json.rtnMsg);
                  }
              })
          }
        };

        return initialize;
});