/**
 * Created by kidd on 2016/11/30.
 */
$(function() {
	var id = Util.browser.getParameter('cmpgnId'),
		flag = Util.browser.getParameter('se'),
		isChecked = false;          //判断是否已签到     
	var Checkin = function(ele, options) {
        this.ele = ele;
        this.opt = options;
        this.defaults = {
            /*width: 20.8 + 'rem',*/
            width: 100 + '%',
            height: 'auto',
            padding: 10
        };
        this.obj = $.extend({}, this.defaults, this.opt);
    }   
    Checkin.prototype.init = function() {
        var _self = this.ele,
            html = '',
            myDate = new Date(),
            year = myDate.getFullYear(),
            month = myDate.getMonth(),
            day = myDate.getDate(),
            weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        _self.css({
            width: this.obj.width,
            height: this.obj.height,
            padding: this.obj.padding
        }).append("<div class='signd-day'><p>已签到<i>"+ this.obj.signdDayCnt + "</i>天</p></div>" + "<div class='title'><p>当前日期：" + year + '年' + (month + 1) + '月' + day + '日' + "</p></div>");
        $("<ul class='week clearfix'></ul><ul class='calendarList clearfix'></ul>").appendTo(_self);
        for (var i = 0; i < 7; i++) {
            _self.find(".week").append("<li>" + weekText[i] + "</li>")
        };
        for (var i = 0; i < 42; i++) {
            html += "<li><span></span></li>"
        };
        _self.find(".calendarList").append(html);
        var $li = _self.find(".calendarList").find("li"),
            $td = (_self.width()-23)/7;                     //计算出每列格子宽高
        _self.find(".week li").css({                        //th的宽高
            width: $td + 'px',
            height: $td*0.6 + 'px',
            'line-height': $td*0.6 + 'px'
        });
        $li.css({                                           //td的宽高
            width: $td + 'px',
            height: $td + 'px'

        });
        /*_self.find(".calendarList").find("li:nth-child(7n)").css('borderRight', 'none');
        _self.find(".week li:nth-child(7n)").css('borderRight', 'none');*/
        var monthFirst = new Date(year, month, 1).getDay();
        var d = new Date(year, (month + 1), 0);
        var totalDay = d.getDate(); //获取当前月的天数
        for (var i = 0; i < totalDay; i++) {
            var $lieq = $li.eq(i + monthFirst);

            $lieq.find('span').html(i + 1);

            $lieq.addClass('data' + (i + 1));
            //获取后台数组,渲染已签到历史          
            for (var j = 0; j < this.obj.dateArray.length; j++) {
                if (i == this.obj.dateArray[j]-1) {
                    $li.eq(i + monthFirst).addClass('checked');
                }
            }
        }
        //$li.eq(monthFirst+day-1).css('background','#f7ca8e')
        _self.find($(".data" + day)).addClass('able-qiandao');
        $('.calendarList').find('li').each(
            function(){
                var $this = $(this);
                if($this.find('span').text()==""){
                    $this.css('background','#f3f6f9');
                }

            }
        );
    }
    Checkin.prototype.events = function() {
        var _self = this.ele;
        var $li = _self.find(".calendarList").find("li");
        //点击签到按钮执行签到
        var checkBtn = $(".checkBtn");
        
        checkBtn.click(function(){clickFn(_self)});
        $(".able-qiandao").click(function(){clickFn(_self)});
    }
    var clickFn = function(_self) {
    	if(flag==0){
    		return;
    	}
    	//TODO 添加正在签到

    	if(Util.isLogin.login()){
    		if(!isChecked){
                Util.ajax.postJson("front/sh/sign!execute?uid=si006",{'cmpgnId': id},function(json,status){
                    if(status){
                        modal(_self);
                        _self.find('.able-qiandao').addClass('checked');
                        isChecked = true;
                        var signdDay = $('.signd-day i').html()*1+1;
                        $('.signd-day i').html(signdDay);
                    }else{
                    	Util.layer.tips(json.returnMessage);
                    }
                });
            }else{
                modal(_self);
            }
    	}else{
    		var mktgChnlId = $('#G-mktgChnlId').val();
    		Util.act.power(mktgChnlId);
    	}
    }
    var modal = function(e) {
        var el = $('#btn_chick');
        /*var mask = e.parents().find(".mask");*/
        /*var close = e.parents().find(".closeBtn");*/
        if (/*mask && */!isChecked) {
        	Util.layer.tips("签到成功",2);
            el.click(function(){
                Log.trackEvent(['营销工具','签到',id,'1'], this); //统计签到次数
            });
            el.click();
            /*mask.addClass('trf');*/ //TODO 以后增加签到分享时启用
        } else {
            Util.layer.tips("今天已经签过了,明天再来吧",2);
            return
        };
        /*close.click(function(event) {
            event.preventDefault();
            mask.removeClass('trf')
        });*/
        //e.parents().find('.checkBtn').text("已签到");

    }
    $.fn.Checkin = function(options) {
        var checkin = new Checkin(this, options);
        var obj = [checkin.init(), checkin.events()];
        return obj
    }          	
    // 插件调用
    	//查看签到
    	Util.ajax.postJson("front/sh/campaign!activity?uid=mk004",{'cmpgnId': id}, function(json,status){
            if(status){
            	var data = {
        			bgnValidTime:json.bean.bgnValidTime,
        			mktgChnlId:json.bean.mktgChnlId,
        			endValidTime:json.bean.endValidTime,
        			cmpgnNm:json.bean.cmpgnNm,
        			cmpgnRuleCntt:json.bean.cmpgnRuleCntt,
            	}
            	 if(!!json.bean.actvBannerPicAddr){
                    console.log(json.bean.ftpUrl+ json.bean.actvBannerPicAddr)
            		 $('.sign_banner').css('background','url('+json.bean.ftpUrl + json.bean.actvBannerPicAddr+')center no-repeat');
            		 $('.sign_banner').css('background-size','100%');
                 }
            	 	$('#G-timeStar').html(data.bgnValidTime);
                	$('#G-timeEnd').html(data.endValidTime);
                	$('#G-rule').html(data.cmpgnRuleCntt);
                	$('#G-mktgChnlId').val(data.mktgChnlId);
                	$("title").html(data.cmpgnNm);
		     }
		});    	
    	//判断是否为预览页面 flag=0是预览,
        if(flag == '0'){
    		isChecked=true;
    		$(".checkin").Checkin({dateArray:[],signdDayCnt:0});
        }else{
        	if(!id){
                Util.layer.prompt({
                    content : "当前活动未找到",
                    shade: 'background-color: rgba(0,0,0,0.9)',
                    shadeClose: false
                });
                return
            }
        	if(Util.act.state(id)){
        		return;
        	}
        	if(Util.isLogin.login()){
            	//签到历史
               Util.ajax.postJson("front/sh/sign!execute?uid=si005",{'cmpgnId': id}, function(json,status){
                    if(status){
                    	if(json.bean.historyDay){
        	            var data = {              
        	                dateArray:json.bean.historyDay.split(","),
        	                signdDayCnt:json.bean.signdDayCnt
        	            };
                    	}else{
                    		var data = {              
                	                dateArray:[0],
                	                signdDayCnt:0
                	            };
                    	}                    	
                        $(".checkin").Checkin(data);
                        //判断历史记录中是否有当天的记录
                           _day = new Date().getDate();
                        for(var i = 0 ; i<=data.dateArray.length; i++){
                        	if(data.dateArray[i] == _day){                		
                        		isChecked = true;
                        		break;
                        	}
                        	 
                        }            
                    }        
               });
            }else{
            	$(".checkin").Checkin({dateArray:[0],signdDayCnt:0});                
            }
        }
    

});