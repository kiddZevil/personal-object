/**
 * Created by yuanyan on 2016/11/7.
 */
define(["Util","text!module/workflow/channelManage/chaList.tpl",
    "text!module/workflow/channelManage/chaListDetail.tpl",
    "text!module/workflow/channelManage/editChannel.tpl",
    "text!module/workflow/channelManage/newChannel.tpl"
],
    function (Util,Tpl,detailList,editTpl,newTpl) {
        //系统变量，定义该模块的根节点
        var $el = $(Tpl);
        //系统变量，构造函数
        var _indexModule = null, _param;
        initialize =function (indexModule,param) {
            _indexModule = indexModule;
            _param = param;
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

            //绑定新建渠道事件
            $el.on('click','#newChaBtn',function () {
                _indexModule.showDialog({
                    title:"新建渠道",
                    url:"js/workflow/systemManage/channelManage/newChannel",
                    width:560,
                    height:350,
                    okVal:"确定提交",  //确认按钮文本
                    okCallback:function(){
                        return newChannel();      //确认按钮点过执行的函数
                    },
                    cancelVal:"取消",  //取消按钮文本
                    cancelCallback:function () {
                    },                 //点击取消按钮执行的函数
                    param:{}
                });
            });
            //绑定编辑渠道事件
            $el.on("click",".G-chanEdit",function () {
                var mktgchnlid = $(this).attr("mktgchnlid");
                _indexModule.showDialog({
                    title:"编辑渠道",
                    url:"js/workflow/systemManage/channelManage/editChannel",
                    width:560,
                    height:350,
                    okVal:"确定",  //确认按钮文本
                    okCallback:function(){
                       return Ok();      //确认按钮点过执行的函数
                    },
                    cancelVal:"取消",  //取消按钮文本
                    cancelCallback:function () {
                    },                 //点击取消按钮执行的函数
                    param:{"mktgChnlId":mktgchnlid}
                });
            });
            //绑定删除渠道事件
            $el.on("click",".G-chanDel",channelDel);

            this.content = $el;
            //获取账号列表
            function getsearchList() {
                var G_param = {
                    url : "front/sh/user!index?uid=006",                 //front/sh/user!index?uid=003
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
            //删除渠道
            function channelDel() {
                var mktgChnlId= $(this).attr("mktgChnlId");
                var $this = $(this);
                var chnlRspderNm = $this.closest('tr').find('.chnlRspderNm').text();
                var chnlRspderTelnum = $this.closest('tr').find('.chnlRspderTelnum').text();
                var validStsCd = $(this).attr("validStsCd");
                if( validStsCd == '1'){
                    validStsCd = '0';
                    Util.dialog.confirm({
                        content : "确定要删除该渠道吗？",
                        okCallback: function () {
                            Util.ajax.postJson("front/sh/user!index?uid=005",
                        {"mktgChnlId":mktgChnlId,"validStsCd":validStsCd,"chnlRspderTelnum":chnlRspderTelnum,"chnlRspderNm":chnlRspderNm},
                                function (json,status) {
                                    if(status){
                                        $this.closest('tr').remove();
                                        Util.dialog.tips("删除成功！");
                                       getsearchList();
                                    }else{
                                        Util.dialog.tips("删除失败！");
                                    }
                                });
                        }
                    });
                }else{
                    Util.dialog.tips("系统错误，请稍后再试！");
                }
                return validStsCd;
            }
            // 清除错误提示信息
            function clearError(){
                $('#J-channel-name_wrapper').addClass('fn-hide');
                $('#J-channel-code_wrapper').addClass('fn-hide');
                $('#JC-phone_wrapper').addClass('fn-hide');
                $('#JC-responsible_wrapper').addClass('fn-hide');
            }
            //编辑弹框确定按钮事件
            function Ok() {
                var chnlRspderNm = $.trim($("input.chnlRspderNm").val());
                var chnlRspderTelnum = $('input.chnlRspderTelnum').val();
                var validStsCd = $("input.validStsCd").text();
                var mktgChnlId = $("input.channel-code").val();
                clearError();
                //验证表单内容是否填写
                //验证渠道负责人
                if(chnlRspderNm == "")   {
                    $("#JC-responsible_wrapper").removeClass("fn-hide");   //渠道负责人
                    return false;
                }
                //验证手机号码
                if(!(/^0?(13|15|17|18|14)[0-9]{9}$/g).test(chnlRspderTelnum)){
                    $("#JC-phone_wrapper").removeClass("fn-hide");   //联系方式校验
                    return false;
                }
              
                var param = {
                    "chnlRspderNm":chnlRspderNm,
                    "chnlRspderTelnum":chnlRspderTelnum,
                    "mktgChnlId":mktgChnlId,
                    "validStsCd":validStsCd
                };
                Util.ajax.postJson("front/sh/user!index?uid=005",param,function (json,status){
                    if(status){
                        if(json.returnCode == '0'){
                            getsearchList();
                            Util.dialog.tips("保存成功！");
                        }else{
                            Util.dialog.tips(json.rtnMsg);
                        }
                    }else{
                        Util.dialog.tips(json.rtnMsg);
                    }
                });
            }
            //新增渠道事件
            function newChannel() {
                var mktgChnlNm = $.trim($("input.mktgChnlNm").val());
                var chnlRspderTelnum =  $.trim($('input.chnlRspderTelnum').val());
                var chnlRspderNm = $.trim($("input.chnlRspderNm").val());
                var mktgChnlId = $.trim($("input.mktgChnlId").val());
                clearError();
                var len = mktgChnlNm.length;
                if(len<1 || len >20){     // 渠道名称
                    $('#J-channel-name').html('渠道名称由4-20位以字母开头并由数字、字母或下划线组成');
                    $("#J-channel-name_wrapper").removeClass("fn-hide");
                    return false;
                }else if(!(/^[\w\u4E00-\u9FA5\uF900-\uFA2D]*$/).test(mktgChnlNm) ){
                    $('#J-channel-name').html('渠道名称只含有汉字、数字、字母、下划线不能以下划线开头和结尾');
                    $("#J-channel-name_wrapper").removeClass("fn-hide");
                    return false;
                }
                //验证渠道编号
                var idLen = mktgChnlId.length;
                if(!((/^[1-9]\d*$/).test(mktgChnlId) && 1< idLen <=20)){
                    $("#J-channel-code_wrapper").removeClass("fn-hide");
                    return false;
                }
                //验证渠道负责人
                if(chnlRspderNm == "")   {
                    $("#JC-responsible_wrapper").removeClass("fn-hide");   //渠道负责人
                    return false;
                }
                //验证手机号码
                if(!(/^0?(13|15|17|18|14)[0-9]{9}$/g).test(chnlRspderTelnum)){
                    $("#JC-phone_wrapper").removeClass("fn-hide");   //联系方式校验
                    return false;
                }
                var param = {
                    "chnlRspderNm":chnlRspderNm,
                    "chnlRspderTelnum":chnlRspderTelnum,
                    "mktgChnlId":mktgChnlId,
                    "mktgChnlNm":mktgChnlNm
                };
                //提交到新增渠道接口前，进行渠道编号唯一性校验
                Util.ajax.postJson("front/sh/user!index?uid=006",{"mktgChnlId":mktgChnlId,"start":"0","limit":"10"},function (data,status) {
                    if(status){
                        if(data.beans.length == 0){  //如果没有查到
                            //提交到新建渠道接口
                            Util.ajax.postJson("front/sh/user!index?uid=004",param,function (json,status) {
                                if (status){
                                    if(json.returnCode == '0'){
                                        getsearchList();
                                        Util.dialog.tips("新增渠道成功！");
                                    }else{
                                        Util.dialog.tips(json.rtnMsg);
                                    }
                                }else{
                                    Util.dialog.tips(json.rtnMsg);
                                }
                            });
                        }else{
                            Util.dialog.tips("该渠道编号已存在，请重新输入渠道编号！");
                        }
                    }
                });


            }

        };
        return initialize;
});