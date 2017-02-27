/**
 * Created by YSG on 2016/11/30.
 */
var Seckill = function(opt){
    this.option = $.extend({
        rsId:"",
        cmpgnId:"",
        loadUrl: "front/sh/seckill!execute?uid=005",
        /*detailsUrl: "front/sh/resources!rsExtFromCache?uid=g001",*/
        skUrl:"front/sh/seckill!execute?uid=008"
    },opt);
    this.init();
};
Seckill.prototype.init = function(){
    var _this = this;
    _this.load(_this.option.loadUrl);
};
Seckill.prototype.load = function(url){
    var _this = this
        ,sku;
    Util.ajax.postJson(url +"&cmpgnId="+ _this.option.cmpgnId +"&rsId=" + _this.option.rsId,'',function(json,status){
        var loading = Util.layer.loading(10000);
        if(status){
            var bean = json.bean
                ,beans = json.beans;
            sku = beans;
            //基本信息
            $('input[name="cmpgnNm"]').val(bean.cmpgnNm);
            $('input[name="mcdsNm"]').val(bean.mcdsNm);
            $('input[name="cmpgnId"]').val(_this.option.cmpgnId);
            $('input[name="rsId"]').val(_this.option.rsId);
            $('input[name="mcdsId"]').val(json.bean.mcdsId);
            $('input[name="rsUnitId"]').val(beans[0].rsUnitId);
            $('input[name="mcdsUnitId"]').val(beans[0].mcdsUnitId);
            $('input[name="specVal"]').val(beans[0].specVal);

            //添加BANNER,如果商品图为空，取用第一张规格图片展示
            $('.group_banner > img').attr('src',bean.mcdsPic ? bean.ftpUrl + bean.mcdsPic : bean.ftpUrl + beans[0].mcdsUnitPic);
            $('#G_price').text(beans[0].pmtUprc);
            $('#G_oldprice').text('￥' + beans[0].origUprc);
            //倒计时
            _this.countdown($('.sk_time'),beans[0].bgnTime,beans[0].finishTime);
            //资源名称
            $('.product_title_con').text(bean.mcdsNm);
            //限购
            /*var skLine = '{{#if bean}}    {{#expression bean.lmtpchsFlag "==" "1"}}<p class="product_title_gz"><span>规则</span><i>限购</i>每个ID限购{{bean.lmtpchsQty}}件，超出数量以结算价为准</p>    {{/expression}}    {{/if}}';
            Util.handlebars.loadTemp($('.sk_line'),skLine,{bean:beans[0]},true);*/
            //默认规格显示
            $('#G_sku').text(beans[0].specVal);
            //资源详情
            if(bean.extdTypeCd == '1112'){ //商户入驻
                $('#G_res_section').html(bean.mcdsExtdMdmtxt ? bean.mcdsExtdMdmtxt : "暂无图文详情");
            }else if(bean.extdTypeCd == '1113'){ //85微商城
                var imgArr = JSON.parse(bean.mcdsExtdMdmtxt);
                $.each(imgArr,function(i){
                    $('#G_res_section').append(imgArr[i])
                })
            }

            //销售范围
            if(!bean.suitRng){
                //默认显示配送地址
                $('#G_region').text('全国');
            }else{
                var suitRngArr = bean.suitRng.split(',');
                var suitRng = _this._transData(suitRngArr);
                //默认显示配送地址
                $('#G_region').text(suitRng[0].regnName).data('code',suitRng[0].rngId);
                $('.address').on('click',function(){
                    //当前显示的销售范围
                    var defCode = $('#G_region').data('code');
                    var regionTpl = '<section class="resRegion-locBox" id="G_resRegion"><div class="resRegion-header"><span id="G_close">X</span><span>配送范围</span></div><ul class="resRegion-con">{{#if beans}}{{#each beans}}<li data-code="{{rngId}}"><span>{{regnName}}</span></li>{{/each}}{{/if}}</ul></section>';
                    var regionCon = Handlebars.compile(regionTpl)({beans:suitRng});
                    $('body').css({
                        'height': '100%',
                        'overflow': 'hidden'
                    });
                    var LRegion = layer.open({
                        type: 1
                        ,content: regionCon
                        ,anim: 'left'
                        ,style: 'position:fixed; right:0; top:0; width:80%; height:100%; border:none;-webkit-animation-duration: .5s; animation-duration: .5s;'
                        ,end: function(){
                            $('body').css({
                                'height': 'auto',
                                'overflow': 'auto'
                            });
                        }
                    });
                    var parentDom = $('#G_resRegion');
                    //遍历选中项
                    parentDom.find('li').each(function(i){
                        if($(this).data('code') == defCode){
                            $(this).addClass('active');
                            return false
                        }
                    });
                    $('#G_close').on('tap',function(){
                        layer.close(LRegion);
                    });
                    parentDom.on('tap','li',function(){
                        $(this).addClass('active').siblings().removeClass('active');
                        $('#G_region').text($(this).text()).data('code',$(this).data('code'));
                        layer.close(LRegion);
                    })
                });
            }
            //SKU弹出层
            $('.open_sku').on('tap',function(){
                _this.openSkLayer(sku);
            });
            //绑定其他事件
            _this.even();
            Util.layer.close(loading);
        }else{
            layer.closeAll();
        }
    });

};
Seckill.prototype.even = function(){
    var _this = this
        ,click_time
        ,interval_time
        ,i = 0
        ,s = 0;
    $('#G_seckill').on('tap',function(){
        if(!Util.isLogin.login()){
            window.location.href = '../seckill/index.html?cmpgnId=' + _this.option.cmpgnId;
            return
        }
        click_time = '';
        if(!$(this).hasClass('dis_over')){
            Log.trackEvent(['营销工具','秒杀资源',_this.option.cmpgnId,'1'], this); //统计秒杀次数
            i++;
            click_time = new Date().getTime();
            if(i!= '0' && click_time -interval_time < 300){ //限制300毫秒点击一次
                s++;
                if(s % 3 == 0){
                    Util.layer.tips('点太快了，休息一下吧~');
                }
                return false;
            }else{
                interval_time = click_time;
                var param = {
                    'cmpgnNm':$('input[name="cmpgnNm"]').val()
                    ,'mcdsNm':$('input[name="mcdsNm"]').val()
                    ,'specVal':$('input[name="specVal"]').val()
                    ,'cmpgnId': _this.option.cmpgnId
                    ,'rsId' :  _this.option.rsId
                    ,'rsUnitId' : $('input[name="rsUnitId"]').val()
                    ,'mcdsId' : $('input[name="mcdsId"]').val()
                    ,'mcdsUnitId' : $('input[name="mcdsUnitId"]').val()
                };
                var queue = Util.layer.tips('正在努力秒杀中...',1000000,false);
                _this._skillQueue(param,queue);
            }
        }
    })
};
//进行秒杀
Seckill.prototype._skillQueue = function(param,lay){
    var _this = this;
    Util.ajax.postJson(_this.option.skUrl,param,function(json,status){
        if(status){
            var bean = json.bean;
            if(bean.seckillSuc == '1'){
                Util.layer.tips('恭喜您，秒杀成功',2);
                $('#G_seckill').addClass('dis_over').text('秒杀成功');
            }else if(bean.seckillSuc == '2'){
                Util.layer.confirm({
                    content : '您已参加该活动并秒杀成功，返回活动列表',
                    btn : '确认',
                    close: false,
                    okFn : function(){
                        window.location.href='../seckill/index.html?cmpgnId=' + _this.option.cmpgnId;
                    }
                });
            }else if(bean.seckillSuc == '0'){
                Util.layer.tips('商品已售罄');
                $('#G_seckill').addClass('dis_over').text('商品已售罄');
            }else if(bean.msg){
                Util.layer.tips(bean.msg)
            }
            Util.layer.close(lay);
            setTimeout(function(){
                window.location.href='../seckill/index.html?cmpgnId=' + _this.option.cmpgnId;
            },2200)
        }else{
            if(json.returnCode == 'timeout'){
                _this._skillQueue(param)
            }else{
                Util.layer.tips(json.returnMessage)
            }
        }
    });
};
Seckill.prototype._transData = function(arr){
    var data = [];
    $.each(arr,function(i){
        data.push({
            "rngId":arr[i].substring(0,arr[i].indexOf('='))
            ,"regnName":arr[i].substring(arr[i].indexOf('=') + 1,arr[i].length)
        })
    });
    return data
};
Seckill.prototype.countdown = function(el,bTime,eTime){
    var flag
        ,sys_second
        ,day_elem = el.find('.day')
        ,hour_elem = el.find('.hour')
        ,minute_elem = el.find('.minute')
        ,second_elem = el.find('.second')
        ,now = Util.time.gTime().getTime();  //服务器时间
    bTime = new Date(bTime.replace(/\-/g, "/")).getTime(); //开始时间
    eTime = new Date(eTime.replace(/\-/g, "/")).getTime(); //结束时间
    if(now < bTime){
        flag = '01';
        el.find('p').eq(0).text('距开始还剩');
        $('#G_seckill').addClass('dis_over');
        sys_second = (bTime - new Date().getTime())/1000; //活动未开始
     }else if(now > bTime && now < eTime){
        flag = '02';
        el.find('p').eq(0).text('距结束还剩');
        sys_second = (eTime - new Date().getTime())/1000; //活动进行中
     }else{
        flag = '03';
        $('#G_seckill').addClass('dis_over');
        el.html('<span class="act-over">活动已结束</span>');
        Util.layer.tips('活动已结束');
    }
    if(flag == '01'){
        timing(sys_second,function(){
            var time;
            el.find('p').eq(0).text('距结束还剩');
            $('#G_seckill').removeClass('dis_over');
            time = (eTime - Util.time.gTime().getTime()) / 1000;
            timing(time,function(){
                $('#G_seckill').addClass('dis_over');
                el.html('<span class="act-over">活动已结束</span>');
                Util.layer.tips('活动已结束');
            })
        })
    }else if(flag == '02'){
        timing(sys_second,function(){
            $('#G_seckill').addClass('dis_over');
            el.html('<span class="act-over">活动已结束</span>');
            Util.layer.tips('活动已结束');
        })
    }
    function timing(time,callback){
        var sys_second = time;
        var timer = setInterval(function(){
            if (sys_second > 1) {
                sys_second -= 1;
                /*var day = Math.floor((sys_second / 3600) / 24);*/
                var hour = Math.floor((sys_second / 3600));
                var minute = Math.floor((sys_second / 60) % 60);
                var second = Math.floor(sys_second % 60);
                //day_elem && $(day_elem).text(day);//计算天
                $(hour_elem).text(hour<10?"0"+hour:hour);//计算小时
                $(minute_elem).text(minute<10?"0"+minute:minute);//计算分钟
                $(second_elem).text(second<10?"0"+second:second);//计算秒杀
            } else {
                clearInterval(timer);
                (callback && typeof(callback) === "function") && callback();
            }
        }, 1000);
    }
};
Seckill.prototype.skLayer = function(data){
    var el
        ,skuTpl = '{{#if beans}}<section class="chose_spec"><div class="chose_spec_pic"><img src="" /><p></p></div><div class="sku-sec"><div class="chose_spec_class"><div class="sel-sku">       选择规格</div><p id="G_skuBox"> {{#each beans}}<span data-i="{{mcdsUnitPic}}" data-p="{{pmtUprc}}" data-ruid="{{rsUnitId}}" data-muid="{{mcdsUnitId}}" data-op="{{origUprc}}">{{specVal}}</span> {{/each}}</p></div><div class="chose_spec_num clearfix"><p>数量</p><div class="num_add"><p><span class="jian dis">—</span><span class="num">1</span><span class="add dis">+</span></p></div></div></div><div class="sk_btn_box"><a class="sk_btn">确认</a></div></section> {{/if}}';
    el = Handlebars.compile(skuTpl)({beans:data});
    return el;
};
Seckill.prototype.openSkLayer = function(sku){
    var _this = this;
    var el = _this.skLayer(sku);
    var sk = Util.layer.opendiv({
        content : el,
        style:'position:fixed;bottom:0;width:100%;height:55%;padding:10px 0;border:none;display:block;'
    });
    var banner_img = $('.group_banner').find('img').attr('src'); //获得banner图片，如果规格图片为空的时候需要用到
    var res_info = $('.chose_spec_pic')
        ,sku_box = $('#G_skuBox');
    //设置选择SKU高度
    $('.sku-sec').height($('.layui-m-layerchild').height() - res_info.height() - $('.sk_btn_box').height() - 10).css('overflow-y','auto');
    //设置默认规格图片和价格
    sku_box.find('span').eq(0).addClass('current');
    res_info.find('img').attr('src',sku[0].mcdsUnitPic ? sku[0].mcdsUnitPic : banner_img);
    res_info.find('p').text(sku[0].pmtUprc);
    //绑定规格选择事件
    sku_box.find('span').on('tap',function(){
        if($(this).hasClass('current')){
            return
        }
        $(this).addClass('current').siblings().removeClass('current');
        res_info.find('img').attr('src',$(this).data('i') ? $(this).data('i') : banner_img);
        res_info.find('p').text($(this).data('p'));
    });
    /*_this.numBox($('.num_add'),{flag:sku[0].lmtpchsFlag,qty:sku[0].lmtpchsQty});*/
    _this.numBox($('.num_add'),{flag:sku[0].lmtpchsFlag,qty:'1'});
    $('.sk_btn').on('tap',function(){
        var sel = sku_box.find('span.current');
        $('input[name="rsUnitId"]').val(sel.data('ruid'));
        $('input[name="mcdsUnitId"]').val(sel.data('muid'));
        $('input[name="specVal"]').val(sel.text());
        $('#G_price').text(sel.data('p'));
        $('#G_oldprice').text(sel.data('op'));
        $('#G_sku').text(sel.text());
        /*$('#G_qty').text($('.num').text());*/
        Util.layer.close(sk);
    });

};
Seckill.prototype.numBox = function(el,opt){
    var reduce = el.find('.jian')
        ,plus = el.find('.add')
        ,num = el.find('.num');
    reduce.on('tap',function(){
        var oNum = parseInt(num.text());
        if($(this).hasClass('dis')){
            return
        }
        if(oNum > 1){
            oNum--;
            plus.removeClass('dis');
            num.text(oNum)
        }else if(oNum == '1'){
            $(this).addClass('dis');
        }
    });
    plus.on('tap',function(){
        var oNum = parseInt(num.text());
        if($(this).hasClass('dis')){
            Util.layer.tips('亲，每人限购' + opt.qty + '件');
            return
        }
        if(opt.flag == '1'){
            if(oNum < opt.qty){
                oNum++;
                reduce.removeClass('dis');
                num.html(oNum);
            }else if(oNum == opt.qty){
                Util.layer.tips('亲，每人限购' + opt.qty + '件');
                $(this).addClass('dis')
            }
        }else{
            oNum++;
            num.html(oNum);
        }
    })
};
$(function(){
    var cmpgnId = Util.browser.getParameter('cmpgnId');
    var rsId = Util.browser.getParameter('rsId');
    if(!cmpgnId){
        Util.layer.prompt({
            content : "当前活动未找到",
            shade: 'background-color: rgba(0,0,0,0.9)',
            shadeClose: false
        });
        return
    }else if(cmpgnId != '' && !rsId){
        window.location.href='../seckill/index.html?cmpgnId=' + cmpgnId;
    }
    if(Util.isLogin.login()){
        new  Seckill({
            rsId: rsId,
            cmpgnId: cmpgnId
        });
    }else{
        window.location.href='../seckill/index.html?cmpgnId=' + cmpgnId;
    }

});

