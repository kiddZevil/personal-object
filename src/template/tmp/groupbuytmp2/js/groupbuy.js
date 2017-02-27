$(function(){
    var flag = Util.browser.getParameter('se')
        ,id = Util.browser.getParameter('cmpgnId')
        ,url;
    if(!id){
        Util.layer.prompt({
            content : "当前活动未找到",
            shade: 'background-color: rgba(0,0,0,0.9)',
            shadeClose: false
        });
        return
    }
    if(flag == '0'){
        url = "front/sh/campaign!activity?uid=mk006";
        groupBuy.init(url,id);
    }else{
        if(!Util.act.state(id)){
            url = "front/sh/campaign!activity?uid=mk001";
            groupBuy.init(url,id);
            groupBuy.even(id);
        }
    }
});
var groupBuy = {
    init : function(url,id){
        Util.ajax.postJsonAsync(url,"&cmpgnId=" + id,function(json,status){
            var loading = Util.layer.loading(10000);
            if(status){
                $('title').text( json.bean.cmpgnNm + '-云营销'); //网页标题
                $('input[name="chnlId"]').val(json.bean.chnlId ? json.bean.chnlId : ''); //渠道ID
                if(!!json.bean.actvBannerPicAddr){
                    $('.group_banner img').eq(1).remove();
                    $('.group_banner img').attr('src',json.bean.ftpUrl + json.bean.actvBannerPicAddr)
                }
                $('input[name="skipUrl"]').val(json.bean.detailUrl);
                var resListTpl = '{{#if beans}} {{#each beans}}<li><div class="res-info"><div class="res-img"><img src="{{../imgUrl}}{{mcdsPic}}" width="100%"/></div><p>{{mcdsNm}}</p><p><em>￥{{pmtUprc}}</em><i>￥{{origUprc}}</i></p><a href="javascript:;" class="go-buy" data-id="{{rsId}},{{mcdsId}}">立即团购</a></div></li>        {{/each}}        {{/if}}';
                Util.handlebars.loadTemp($('#G-groupbuyList'),resListTpl,{beans:json.beans,imgUrl: json.bean.ftpUrl});
                $('#G-actDes').html(json.bean.cmpgnRuleCntt);
                Util.layer.close(loading);
            }else{
                layer.closeAll();
            }
        });
    },
    even : function(id){
        $('.go-buy').on('tap',function(){
            var chnlId = $('input[name="chnlId"]').val();
            var resinfo = $(this).data('id').split(',');
            if(Util.isLogin.login()){
                Log.trackEvent(['营销工具', '查看团购资源详情',id,resinfo[0]], this); //统计团购次数
                window.location.href = $('input[name="skipUrl"]').val() + '?cmpgnId=' + id + '&rsId=' + resinfo[0] + '&mcdsId=' + resinfo[1];
            }else{
                Util.act.power(chnlId)
            }
        })
    }
};