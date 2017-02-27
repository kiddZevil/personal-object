/**
 * Created by yuanyan on 2016/11/7.
 */
define(["Util","text!module/workflow/channelManage/newChannel.tpl"],
    function (Util,Tpl) {
        //系统变量，定义该模块的根节点
        var $el = $(Tpl);
        //系统变量，构造函数
        var _indexModule = null, _param;
        initialize =function (indexModule,param){
            _indexModule = indexModule;
            _param = param;
            clearMsg();
            iniTime();
            this.content = $el;
            //清除表单信息
            function clearMsg() {
                $(".mktgChnlNm").val("");
                $(".mktgChnlId").val("");
                $(".chnlRspderNm").val("");
                $(".channel-name").val("");
            }
            //获取当前时间和渠道创建人信息
            function iniTime() {
                var myDate = new Date();
                var year =  myDate.getFullYear()<10? "0"+myDate.getFullYear() : myDate.getFullYear();
                var month = (myDate.getMonth()+1)<10 ? "0"+(myDate.getMonth()+1):(myDate.getMonth()+1) ;
                var date = myDate.getDate()<10 ? "0"+myDate.getDate():myDate.getDate() ;
                var today = year + "-" + month+ "-" + date;
                $("#createTime",$el).attr("value",today);
               //读取cookie信息
                $("#founder",$el).attr('value',$('#userInfo_hid').val());
            }
            function get(name) {
                var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
                return v ? decodeURIComponent(v[1]) : null;
            }
        };

        return initialize;
});