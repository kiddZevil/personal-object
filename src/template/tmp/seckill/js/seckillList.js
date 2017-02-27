/**
 * Created by yuanyan on 2016/12/1.
 */
$(function () {
    //通过解析url获得se字段，通过该字段判断是秒杀预览页面还是秒杀进行页面
    var se = Util.browser.getParameter('se') ? Util.browser.getParameter('se') :'1';
    var cmpgnId = Util.browser.getParameter('cmpgnId');
    var url;
    if(!cmpgnId){
        Util.layer.prompt({
            content : "当前活动未找到",
            shade: 'background-color: rgba(0,0,0,0.9)',
            shadeClose: false
        });
        return
    }
    if(se == '0'){ //加载预览
        url = 'front/sh/campaign!activity?uid=mk007';
        loadData(url,cmpgnId);
        return
    }
    //活动状态是否启用及活动正确性
    if(Util.act.state(cmpgnId)){
        $('.inquery-btn-box').remove();
        return
    }
    //加载缓存
    url = 'front/sh/campaign!activity?uid=mk002';
    loadData(url,cmpgnId);
    checkBtn();
    function loadData(url,cmpgnId){
        //秒杀列表tpl模板定义
        var seckillTpl;
        if(se == '0'){
            seckillTpl = '<ul class="clearfix">    {{#if beans}}      {{#each beans}}<li class="seckill-pro"><input type="hidden" class="resourceId" name="rsId" value="{{rsId}}" /><div class="seckill_img">            {{#if componPicUrlAddr}}<img src="{{../../ftpUrl}}{{componPicUrlAddr}}" data-src="{{componPicUrlAddr}}" alt="{{mcdsNm}}" />               {{else}}                {{#if rsPicPath}}<img src="{{../../../ftpUrl}}{{rsPicPath}}" data-src="{{rsPicPath}}" alt="{{mcdsNm}}" />                 {{else}}<img src="" data-src="{{rsPicPath}}" />                 {{/if}}            {{/if}}</div><div class="seckill_Info"><a class="seckill_title">{{mcdsNm}}</a><div class="basic_info"><span class="current_price">￥{{pmtUprc}}</span><a href="javascript:;" class="remind_btn goBuy">去抢购</a></div><div class="original_info"><span class="original_price">￥{{origUprc}}</span><div class="time_remind_box"><span class="utilTime">距开始</span>&nbsp;<span class="time_remind" data-bgntime="{{bgnTime}}" data-finishtime="{{finishTime}}"><span class="time_box hours_time">00</span><i>：</i><span class="time_box minutes_time">00</span><i>：</i><span class="time_box seconds_time">00</span></span></div></div></div></li>      {{/each}}    {{/if}}</ul>';
        }else{
            seckillTpl = '<ul class="clearfix">{{#if beans}}{{#each beans}}<li class="seckill-pro"><input type="hidden" class="resourceId" name="rsId" value="{{rsId}}"><div class="seckill_img"><img src="{{../ftpUrl}}{{mcdsPic}}"  data-src="{{mcdsPic}}" alt="{{mcdsNm}}"/></div><div class="seckill_Info"><a class="seckill_title">{{mcdsNm}}</a><div class="basic_info"><span class="current_price">￥{{pmtUprc}}</span><a href="javascript:;" class="remind_btn goBuy">去抢购</a></div><div class="original_info"><span class="original_price">￥{{origUprc}}</span><div class="time_remind_box"><span class="utilTime">距开始</span>&nbsp;<span class="time_remind" data-bgntime="{{bgnTime}}" data-finishtime="{{finishTime}}"><span class="time_box hours_time">00</span><i>：</i><span class="time_box minutes_time">00</span><i>：</i><span class="time_box seconds_time">00</span></span></div></div></div></li>{{/each}}{{/if}}</ul>';
        }
        //向秒杀活动参与页面请求数据
        Util.ajax.postJson(url,{'cmpgnId':cmpgnId},function (json,status) {
            if(status){
                if(json.returnCode == '0'){
                    $('title').text(json.bean.cmpgnNm + '-云营销'); //网页标题
                    if(se == '0'){    //如果se为0进入秒杀列表预览页面,预览页面数据不显示规格信息
                         //将返回的商品列表数据返回到页面上，对数据进行处理
                        var data = json.beans;
                        var len = data.length,number=[],mcdsId="",index;
                        for(var i=0;i<len;i++){
                            if(data[i].mcdsId != mcdsId){
                                number.push(i);
                                mcdsId = data[i].mcdsId;
                            }
                        }
                        var beans = [] , _len = number.length;
                        for(i=0;i<_len;i++){
                            var j=number[i];
                            beans.push(data[j]);
                        }
                    }else{
                        beans = json.beans;
                        $('input[name="chnlId"]').val(json.bean.chnlId ? json.bean.chnlId : ''); //渠道ID
                    }
                    //添加自定义banner图
                    if(!!json.bean.actvBannerPicAddr){
                        $('.seckill_banner img').attr('src',json.bean.ftpUrl + json.bean.actvBannerPicAddr)
                    }
                    //渲染列表
                    Util.handlebars.loadTemp($('.seckill_list'),seckillTpl,{'beans':beans,'ftpUrl':json.bean.ftpUrl});
                    // setInterval(refreshTime('bgntime'),1000);
                    /*src= $('.seckill_img img').attr('src');
                    $('.seckill_img img').attr('src',json.bean.ftpUrl +src);*/
                    refreshTime();
                }else{
                    Util.layer.tips(json.returnMessage || '系统错误，请稍后再试！');
                }
            }else{
                Util.layer.tips(json.returnMessage || '系统错误，请稍后再试！');
            }
        });
    }
    //秒杀资格查询
    function checkBtn(){
        $('.inquery-btn').on('click',function () {
            if(Util.isLogin.login()){
                var url = 'front/sh/seckill!execute?uid=010';
                Util.ajax.postJson(url + '&cmpgnId='+cmpgnId,'',function (json,status) {
                    if(status){
                        var beans = json.beans;
                        if(beans.length == '0'){
                            Util.layer.tips('暂无秒杀信息');
                            return
                        }
                        $('input[name="skipUrl"]').val(json.bean.detailUrl);
                        var skillRecordTpl = '<div class="layer-skill-header">秒杀结果查询<span id="layer-skill-close">X</span></div><ul class="layer-skill-record">    {{#if beans}}        {{#each beans}}<li><div class="record-box"><a href="javascript:;" class="record-btn" data-info="{{rsId}},{{rsUnitId}},{{mcdsId}},{{mcdsUnitId}}">去下单</a><div class="record-info"><div class="tit txt-ellipsis">                            {{mcdsNm}}</div><div class="sku txt-ellipsis">                            规格：{{specVal}}<span>数量：1</span></div></div></div></li>        {{/each}}    {{/if}}</ul>';
                        var el = Handlebars.compile(skillRecordTpl)({beans:beans});
                        var index = Util.layer.opendiv({
                            content : el
                            ,anim : 'up'
                            ,suc : function(){
                                $('#layer-skill-close').on('tap',function(){
                                    layer.close(index)
                                })
                                $('.record-btn').on('tap',function(){
                                    var resInfoArr = $(this).data('info').split(',');
                                    window.location.href = $('input[name="skipUrl"]').val() + '?cmpgnId=' + cmpgnId +'&mcdsUnitId=' + resInfoArr[3] + '&mcdsId=' + resInfoArr[2] + '&rsId=' + resInfoArr[0] + '&rsUnitId=' + resInfoArr[1];
                                })
                            }
                        });
                    }else{
                        Util.layer.tips(json.returnMessage || '系统错误，请稍后再试！');
                    }
                });
            }else{
                //用户鉴权
                Util.act.power($('input[name="chnlId"]').val());
            }
        });
    }
    //判断商品秒杀活动是否开始
    function timeCompare(_time) {
        // var now = new Date();   //创建一个当前的时间变量
        var now = Util.time.gTime();  //服务器时间
        return time=_time - now.getTime()/1000;
    }
    //时间处理函数获取距离开始和结束的时间差
    function timePrecessor(_time) {
        var days,hours,minutes,seconds,utilBegTime = [],time1, secday = 86400 , sechour = 3600;
        //将开始时间转变为毫秒级,计算距离开始的天时分秒
            time1 = timeCompare(_time);
            days = Math.floor(time1/secday);    //相差的天数
            hours = Math.floor(time1%secday/sechour) + days*24;  //相差的小时
            minutes = Math.floor(time1%sechour/60);    //相差的分钟数
            seconds = Math.floor(time1%60);    //相差的秒数
            utilBegTime.push({
                'days':nol(days),
                'hours': nol(hours),
                'minutes': nol(minutes),
                'seconds':nol(seconds)
            });
        return utilBegTime;
        }
        //时间位数处理函数
        function nol(t) {
            return t>9? t: '0'+t;
        }
        //字符串转时间格式
        function str2Time(t) {
            return new Date(t.replace(/\-/g, "/")).getTime()/1000;
        }
      //刷新页面的时间函数
    function refreshTime() {
        $('.time_remind').each(function () {
            var $this = $(this),time;
            //通过时间比较判断商品活动是否开始
            var time1 = str2Time( $this.data('bgntime') );
            var time2 = str2Time( $this.data('finishtime') );
            var difference1 = timeCompare(time1); //和开始时间比较
            var difference2 = timeCompare(time2); //和结束时间比较
            if(se == '0'){
                time = time1;    //显示距开始还有多久
                // Timer(time,$this);  //预览不显示时间，将此代码注释掉
            }else{
                $this.parents('.seckill_Info').find('.goBuy').on('tap',goBuyAct);  //抢购按钮绑定动作
                if(difference1>0 && difference2>0){    //活动未开始
                    time = time1;    //显示距开始还有多久
                    Timer(time,$this);
                }else if( difference1 <=0 && difference2 >0){    //活动已开始
                    time = time2;    //显示距结束还有多久
                    Timer(time,$this);
                    $this.parents('.seckill_Info').find('.utilTime').html('距结束');
                }else{    //活动已结束显示时间为0
                    $this.parents('.seckill_Info').find('.remind_btn').html('已结束').addClass('hasDone');
                    $this.parents('.seckill_Info').find('.time_remind_box').addClass('fn-hide');
                }
            }
        });
    }
    function goBuyAct() {
            if(Util.isLogin.login()){// 先判断是否登录，无登录先去登录，登录成功跳转到商品详情页面
                var rsId = $(this).parents('li').find('.resourceId').val();
                //活动详情页面跳转
                Log.trackEvent(['营销工具', '查看秒杀资源详情',cmpgnId,rsId], this); //统计团购次数
                window.location.href='../seckillDetails/index.html?cmpgnId=' + cmpgnId + '&rsId=' + rsId;
            }else{
                //用户鉴权
                var chnlId = "1112";
                Util.act.power(chnlId);
            }


        /*}else{
            Util.layer.tips('活动还未开始，请稍后再试！');
        }*/
    }
    function Timer(time,$this) {     //定时器函数
        setInterval(function () {
            var utilBegTime = timePrecessor(time);
            // $this.find('.days_time').html(utilBegTime[0].days);   //将处理好的时间渲染到页面上
            $this.find('.hours_time').html(utilBegTime[0].hours);
            $this.find('.minutes_time').html(utilBegTime[0].minutes);
            $this.find('.seconds_time').html(utilBegTime[0].seconds);
        },1000);
    }

});
