/**
 * Created by yuanyan on 2016/11/29.
 */
$(function () {
    //通过解析url得到活动id
    var cmpgnId = Util.browser.getParameter('cmpgnId');
    var se = Util.browser.getParameter('se');
    var url = '';
    if(!cmpgnId){
        Util.layer.prompt({
            content : "当前活动未找到",
            shade: 'background-color: rgba(0,0,0,0.9)',
            shadeClose: false
        });
        return
    }
    if(se == '0'){
        url = "front/sh/campaign!activity?uid=mk010";
        loadData(url,cmpgnId);
        return
    }
    if(Util.act.state(cmpgnId)){
       return
    }
    url = "front/sh/campaign!activity?uid=mk005";
    loadData(url,cmpgnId)

});
function loadData(url,cmpgnId){
    //活动详情接口请求数据
    Util.ajax.postJson(url +'&cmpgnId=' + cmpgnId,'', function (json,status) {
        var loading = Util.layer.loading(10000);
        var date =json.bean.bgnValidTime.toString().substring(0,10);
        if(status){
            $('title').text( json.bean.cmpgnNm); //网页标题
            $('#campain-title').html(json.bean.cmpgnNm);
            if(!!json.bean.actvBannerPicAddr){
                $('.group_banner img').attr('src',json.bean.ftpUrl + json.bean.actvBannerPicAddr)
            }
            $('#campain-Time').html(date.replace(/-/g,'/'));
            $('#campain-rules').html(json.bean.cmpgnRuleCntt);
            Util.layer.close(loading);
        }else{
            layer.closeAll();
            Util.dialog.tips(json.returnMessage);
        }
    });
}