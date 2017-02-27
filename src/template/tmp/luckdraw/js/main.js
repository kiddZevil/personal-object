var Draw = function(opt){
	this.option = $.extend({
		id: ""
		,el_0:""
		,el_1:""
		,el_2:""
		,el_3:""
		,btn:""
		,se:""
		,onceMore:""
		,loadUrl: "front/sh/campaign!activity?uid=mk003"
		,drawUrl:"front/sh/luckdraw!execute?uid=lu005"
		,numUrl: "front/sh/luckdraw!execute?uid=lu006"
		,recordUrl:'front/sh/luckdraw!execute?uid=lu007'
	},opt);
	this.init();
};
Draw.prototype = {
	init : function(){  //初始化
		var _this = this
			,clickNum		//可抽奖次数
			,rotNum = 0;	//旋转次数
		var loadResults = _this.load(_this.option.loadUrl, _this.option.id,_this.option.se);
		_this.create(loadResults);
		//执行抽奖
		_this.option.btn.on('tap',function(){
			if(_this.option.se){
				Util.layer.tips('活动预览中，无法抽奖');
				return
			}
			//是否登录
			if($(this).hasClass('disabled')){
				return;
			}else{
				if(!Util.isLogin.login()){
					Util.act.power($('input[name="chnlId"]').val());
					return
				}
			}
			clickNum = _this.clickTm(_this.option.numUrl);
			//抽奖次数加载失败，重新请求
			if(clickNum == ''){
				Util.layer.confirm({
					content : '无法抽奖，请刷新重试',
					btn : '刷新',
					close: false,
					okFn : function(){
						clickNum = _this.clickTm(_this.option.numUrl);
					}
				});
			}
			/*$('#G-actNum').text(clickNum);*/
			if (clickNum >= 1) {
				var przMsg = '';
				//可抽奖次数减一
				clickNum = clickNum-1;
				$('#G-actNum').text(clickNum);
				//统计大转盘抽奖次数
				var el = $('#btn_chick');
				el.click(function(){
					Log.trackEvent(['互动营销','抽奖',_this.option.id,'1'], this); //统计抽奖次数
				});
				el.click();
				//转盘旋转
				var drawResults = _this._runCup(_this.option.el_0,rotNum);
				if( drawResults[0] == 'no'){
					return
				}
				if(drawResults[0] == ''){
					przMsg  = '亲爱的用户，谢谢您的参与！<br />剩余抽奖次数：' + clickNum + '次';
				}else{
					przMsg  = '亲爱的用户，恭喜您中了'+ drawResults[2] +'！<br />' + drawResults[1] + '<br />剩余抽奖次数：' + clickNum + '次';
				}
				//转盘旋转过程“开始抽奖”按钮无法点击
				_this.option.btn.addClass('disabled');
				//旋转次数加一
				rotNum = rotNum + 1;
				//“开始抽奖”按钮无法点击恢复点击
				setTimeout(function(){
					/*中奖提示在这里*/
					Util.layer.confirm({
						title : "抽奖结果",
						content : przMsg,
						btn : ['确认'],
						yes : "",
						no  : "",
						cancel:""
					});
					//-------------------
					_this.option.btn.removeClass("disabled");
				},6000);
			}else{
				Util.layer.tips('亲，您的抽奖机会用光了')
			}
		});
		$('.act-record').on('click',function(){
			if(_this.option.se){
				Util.layer.tips('活动预览中，无法查看');
				return
			}
			_this._record();
		});
	}
	,load : function(url, id,flag){  //加载活动数据
		var _this = this;
		var imgArr = []
			,prizeArr = []
			,drawInfo = [];
		Util.ajax.postJsonAsync(url,"&cmpgnId=" + id,function(json,status){
			var loading = Util.layer.loading(10000);
			var data;
			if(status){
				data = json;
				var bean = data.bean
					,object = data.object
					,ftpUrl = bean.ftpUrl;
				$('title').text( bean.cmpgnNm + '-云营销'); //网页标题
				$('input[name="chnlId"]').val(bean.chnlId);
				if(!!json.bean.actvBannerPicAddr){
					$('.banner img').attr('src',ftpUrl + bean.actvBannerPicAddr);
				}
				$.each(object,function(i){
					imgArr.push(ftpUrl + object[i].bean.przitmPicUrlAddr);
					prizeArr.push(object[i].bean.lvlNm)
				});
				_this.option.onceMore = bean.rwdPrzdrwChancFlag;
				imgArr.push('img/no_prize _01.png');
				prizeArr.push('谢谢参与');
				imgArr.push.apply(imgArr,imgArr);
				prizeArr.push.apply(prizeArr,prizeArr);
				drawInfo.push(imgArr,prizeArr);
				$('#G-actRule').append(bean.cmpgnRuleCntt);
				var prizeData = _this.formatPrizeData(json);
				$.each(prizeData,function(i){
					$('#G-actPrize').append('<p>' + prizeData[i] + '</p>');
				});

				Util.layer.close(loading);
			}else{
				layer.closeAll();
			}
		});
		return drawInfo;
	}
	,_record : function(){
		var _this = this;
		if(!Util.isLogin.login()){
			Util.act.power($('input[name="chnlId"]').val());
			return
		}
		Util.ajax.postJsonAsync(_this.option.recordUrl,"&cmpgnId=" + _this.option.id,function(json,status){
			if(status){
				var bean = json.bean;
				var beans = json.beans;
				if(!beans || beans.length == '0'){
					Util.layer.tips('暂无抽奖信息');
					return
				}
				$('input[name="skipUrl"]').val(bean.threeGiveAdd);
				//资源ID，资源规格ID，商品ID，商品规格ID
				var listTmp = '<div class="layer-skill-header">   中奖记录查询<span id="layer-skill-close">X</span></div><ul class="layer-skill-record">    {{#if beans}}       {{#each beans}}<li><div class="record-box">            {{#expression rsSrcTypeCd "==" "02"}}              {{#expression rsGiveFlag "==" "1"}}<a href="javascript:;" class="record-btn dis">已下单</a>                {{else}}<a href="javascript:;" class="record-btn go-order" data-info="{{cmpgnRsId}},{{componId}},{{mcdsId}},{{origComponId}}">去下单</a>              {{/expression}}              {{else}}<a href="javascript:;" class="record-btn dis">已发放</a>            {{/expression}}<div class="record-info"><div class="tit txt-ellipsis">              {{rsNm}}</div><div class="sku txt-ellipsis">                  {{#expression rsSrcTypeCd "==" "02"}}                  规格：{{componNm}}                  {{/expression}}<span>数量：1</span></div></div></div></li>     {{/each}}   {{/if}}</ul>';
				var el = Handlebars.compile(listTmp)({beans:beans});
				var index = Util.layer.opendiv({
					content : el
					,anim : 'up'
					,suc : function(){
						$('#layer-skill-close').on('tap',function(){
							layer.close(index)
						});
						$('.go-order').on('tap',function(){
							var resInfoArr = $(this).data('info').split(',');
							window.location.href = $('input[name="skipUrl"]').val() + '?cmpgnId=' + cmpgnId +'&mcdsUnitId=' + resInfoArr[3] + '&mcdsId=' + resInfoArr[2] + '&rsId=' + resInfoArr[0] + '&resUnitId=' + resInfoArr[1];
						});
					}
				});
			}
		})
	}
	,formatPrizeData : function(obj){
		var data = obj.object;
		var lv = [];
		var prize ='';
		$.each(data,function(i){
			prize = '';
			if(data[i].beans.length == '0'){
				prize += '再来一次、'
			}else{
				$.each(data[i].beans,function(s){
					prize += data[i].beans[s].rsNm + '、'
				});
			}
			lv.push(data[i].bean.lvlNm + '：' + prize.substring(0,prize.length - 1))
		});
		return lv;
	}
	,clickTm : function(url){
		var _this = this;
		var num;
		Util.ajax.postJsonAsync(url,"&cmpgnId=" + _this.option.id,function(json,status){
			var loading = Util.layer.loading(10000);
			if(status){
				num = json.bean.differTmsCnt ? json.bean.differTmsCnt : '';
				Util.layer.close(loading);
			}else{
				num = '';
				Util.layer.close(loading);
			}
		});
		return num;
	}
	,create : function(arr){ //创建
		var _this = this;
		// 1(单数转盘颜色)
		// 2（转盘偶数颜色）
		// 3（按钮下面背景色）
		// 4（奖品字体颜色）
		// 5 (按钮字体颜色)
		// 6（指针颜色）
		var color = ["#ffce39","#ffe457","#c94a15","#9c7614","#c94a15","#f4c94d"];
		/*var info = ["一等奖","二等奖","三等奖","再来一次","一等奖","二等奖","三等奖","再来一次"];
		 var img = ["img/5345f40edc84f069.jpg","img/5345f41af11d3975.jpg","img/5345f41cb457b275.jpg","img/5345f41e670ec580.jpg","img/5345f40edc84f069.jpg","img/5345f41af11d3975.jpg","img/5345f41cb457b275.jpg","img/5345f41e670ec580.jpg"];*/
		var info = arr[1];
		var img = arr[0];
		var canvas = _this.option.el_0;
		var canvas01 = _this.option.el_1;
		var canvas03 = _this.option.el_3;
		var canvas02 = _this.option.el_2;
		var ctx = canvas[0].getContext('2d');
		var ctx1 = canvas01[0].getContext('2d');
		var ctx3 = canvas03[0].getContext('2d');
		var ctx2 = canvas02[0].getContext('2d');

		_this._createCircle(ctx,color);
		_this._prizes(ctx,color,info,img);
		_this._point(ctx1, ctx2 ,ctx3,color);

	}
	,_createCircle :function(ctx,color){
		var step = 2 * Math.PI / 10;
		var startAngle = 0		//扇形的开始弧度
			,endAngle = 0;		//扇形的终止弧度
		//画一个10等份扇形组成的圆形
		for (var i = 0; i< 10; i++){
			/*startAngle = Math.PI * (i/5-1/10);
			 endAngle = startAngle + Math.PI*(1/5);*/
			startAngle = i * step;
			endAngle = (i + 1) * step;
			ctx.save();
			ctx.beginPath();
			ctx.arc(150,150,100, startAngle, endAngle, false);
			ctx.lineWidth = 120;
			if (i % 2 == 0) {
				ctx.strokeStyle =  color[0];
			}else{
				ctx.strokeStyle =  color[1];
			}
			ctx.stroke();
			ctx.restore();
		}
	}
	,_prizes : function(ctx,color,info,img){ //奖项
		var _this = this;
		ctx.textAlign ='start';
		ctx.textBaseline ='middle';
		ctx.fillStyle = color[3];
		var step = 2 * Math.PI / 10;
		/*var step = (360 / 10) - (360 / (10*2));*/
		var loadPage = Util.layer.loading();
		_this._loadImg(img).done(function(images){ //处理图片加载不出来
			for ( var i = 0; i < 10; i++) {
				ctx.save();
				ctx.beginPath();
				ctx.translate(150,150);
				ctx.rotate(i * step);
				ctx.font = " .8rem Microsoft YaHei";
				ctx.fillStyle = color[3];
				ctx.fillText(info[i], -20, -135, 100);  //(A(文字内容),B(左右位置),C(圆心距离),D)
				ctx.drawImage(images[i],-18,-125,40,40);
				ctx.closePath();
				ctx.restore();
			}
			Util.layer.close(loadPage);
		})
	}
	,_point : function(ctx1, ctx2 ,ctx3,color){ //指针
		//箭头指针
		ctx1.beginPath();
		ctx1.moveTo(100,24);
		ctx1.lineTo(90,62);
		ctx1.lineTo(110,62);
		ctx1.lineTo(100,24);
		ctx1.fillStyle = color[5];
		ctx1.fill();
		ctx1.closePath();
		//中间小圆
		ctx3.beginPath();
		ctx3.arc(100,100,40,0,Math.PI*2,false);
		ctx3.fillStyle = color[5];
		ctx3.fill();
		ctx3.closePath();
		//小圆文字
		ctx3.font = "Bold 1.2rem Microsoft YaHei";
		ctx3.textAlign='start';
		ctx3.textBaseline='middle';
		ctx3.fillStyle = color[4];
		ctx3.beginPath();
		ctx3.fillText('开始',85,90,40);
		ctx3.fillText('抽奖',85,110,40);
		ctx3.fill();
		ctx3.closePath();
		//中间圆圈
		ctx2.beginPath();
		ctx2.arc(75,75,75,0,Math.PI*2,false);
		ctx2.fillStyle = color[2];
		ctx2.fill();
		ctx2.closePath();
	}
	,_runCup : function(el,rotNum){ //旋转转盘
		var _this = this
			,prize = []
			,msg
			,lvlNm
			,num = '';
		/*,num = parseInt(Math.random()*(3 - 0 + 0) + 0);
		 console.log(num)*/
		//传入中奖奖项,调用抽奖接口获得返回的中奖等级和奖品
		//调用抽奖接口
		Util.ajax.postJsonAsync(_this.option.drawUrl,"&cmpgnId=" + _this.option.id,function(json,status){
			var loading = Util.layer.loading(10000);
			if(status){
				num = json.bean.lvlCd ? json.bean.lvlCd : '';
				lvlNm = json.bean.lvlNm ? json.bean.lvlNm : '';
				if(num == '00'){
					msg = '再来一次';
				}else{
					msg = json.bean.rsNm ? json.bean.rsNm : '';
				}
				Util.layer.close(loading);
				var results = _this._assigned(num,rotNum);
				var degValue = 'rotate('+ results +'deg'+')';
				el.css('-o-transform',degValue);           //Opera
				el.css('-ms-transform',degValue);          //IE浏览器
				el.css('-moz-transform',degValue);         //Firefox
				el.css('-webkit-transform',degValue);      //Chrome和Safari
				el.css('transform',degValue);
				prize.push(num,msg,lvlNm);
			}else{
				prize.push('no');
				Util.layer.tips(json.returnMessage);
				Util.layer.close(loading);
			}
		});
		return prize;
	}
	,_assigned : function(num,rotNum){
		var _this = this;
		/*num = '03';*/
		var angles;		//旋转角度
		var sel = parseInt(Math.random() * 10);
		/*sel = 1;*/
		/*console.log(sel + '-------- num = ' + num);*/
		//概率
		if(_this.option.onceMore == '0'){ //有再来一次
			if ( num == '00' ) { //再来一次
				angles = (sel > 5) ? (2160 * rotNum + 2232) : (2160 * rotNum + 1872);
			}
			//概率
			else if ( num == '01' ) { //一等奖
				angles = (sel > 5) ? (2160 * rotNum + 2160) : (2160 * rotNum + 1800);
			}
			//概率
			else if ( num == '02' ) { //二等奖
				angles = (sel > 5) ? (2160 * rotNum + 2124) : (2160 * rotNum + 1764);
			}
			//概率
			else if ( num == '03' ) { //三等奖
				angles = (sel > 5) ? (2160 * rotNum + 2088) : (2160 * rotNum + 1728);
			}else if(!num){
				angles = (sel > 5) ? (2160 * rotNum + 2016) : (2160 * rotNum + 1656);
			}
		}else{ //没有再来一次
			/*if ( num == '04' ) { //谢谢
				angles = (sel > 5) ? (2160 * rotNum + 2232) : (2160 * rotNum + 1872);
			}*/
			//概率
			if ( num == '01' ) { //一等奖
				angles = (sel > 5) ? (2160 * rotNum + 2160) : (2160 * rotNum + 1800);
			}
			//概率
			else if ( num == '02' ) { //二等奖
				angles = (sel > 5) ? (2160 * rotNum + 2124) : (2160 * rotNum + 1764);
			}
			//概率
			else if ( num == '03' ) { //三等奖
				angles = (sel > 5) ? (2160 * rotNum + 2088) : (2160 * rotNum + 1728);
			}else if( num == '04'){
				angles = (sel > 5) ? (2160 * rotNum + 2052) : (2160 * rotNum + 1692);
			}else if(!num){
				angles = (sel > 5) ? (2160 * rotNum + 2016) : (2160 * rotNum + 1656);
			}
		}

		return angles;
	}
	,_loadImg : function(arr){ //预加载图片处理图片加载不出来
		var newimages = []
			,loadedimages = 0;
		//此处增加了一个postaction函数
		var postaction = function(){};
		arr = (typeof arr != "object")? [arr] : arr;
		function imageloadpost(){
			loadedimages++;
			if (loadedimages == arr.length){
				//加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
				postaction(newimages);
			}
		}
		for (var i = 0; i<arr.length; i++){
			newimages[i] = new Image();
			newimages[i].src = arr[i];
			newimages[i].onload = function(){
				imageloadpost()
			};
			newimages[i].onerror = function(){
				imageloadpost()
			}
		}
		return { //此处返回一个空白对象的done方法
			done:function(f){
				postaction = f || postaction
			}
		}
	}
	,_getDevicePixelRatio : function (){
		return window.devicePixelRatio || 1;
	}
};
$(function(){
	//加载抽奖
	var url = 'front/sh/campaign!activity?uid=mk008'; //抽奖预览接口
	var id = Util.browser.getParameter('cmpgnId');
	var se = Util.browser.getParameter('se');
	if(!id){
		Util.layer.prompt({
			content : "当前活动未找到",
			shade: 'background-color: rgba(0,0,0,0.9)',
			shadeClose: false
		});
		return
	}
	if(se == '0'){
		new  Draw({
			id: id,
			el_0:$('#G_00')
			,el_1:$('#G_01')
			,el_2:$('#G_02')
			,el_3:$('#G_03')
			,loadUrl: url
			,se:true
			,btn:$('#G_drawBtn')
		});
		return
	}
	if(!Util.act.state(id)){
		new  Draw({
			id: id,
			el_0:$('#G_00')
			,el_1:$('#G_01')
			,el_2:$('#G_02')
			,el_3:$('#G_03')
			,btn:$('#G_drawBtn')
		});
	}else{
		$('.turnplate_box').remove();
		$('.act-rule').remove();
	}
});