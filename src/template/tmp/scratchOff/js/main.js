var Card = function(opt){
	this.option = $.extend({
		el : ''
		,id : ''
		,clickNum : '' //抽奖次数
		,se : ''
		,ismousedown : false
		,isOk : false  //是否正在抽奖
		,isMove : false //是否已请求抽奖次数
		,isGetPrize : false //属否已请求获取奖品
		,ctx : ''
		//,index: 0
		,loadUrl: "front/sh/campaign!activity?uid=mk003"
		,drawUrl:"front/sh/luckdraw!execute?uid=lu005"
		,numUrl: "front/sh/luckdraw!execute?uid=lu006"
		,recordUrl:'front/sh/luckdraw!execute?uid=lu007'
	},opt);
	this.init();
	this.load(this.option.loadUrl,this.option.id,this.option.se); //读取活动基本信息
	if(!this.option.se){
		this._even();
	}
};
Card.prototype = {
	//初始化
	init : function(){
		$('#c1').show();
		var _this = this;
		var CS = _this.option.el;
		_this.option.isOk = false;
		_this.option.isMove = false;
		_this.option.isGetPrize = false;
		CS[0].width = CS[0].clientWidth;
		CS[0].height = CS[0].clientHeight;
		_this.option.ctx = CS[0].getContext("2d");
		if(!_this.option.se){
			//PC端的处理
			CS[0].addEventListener("mousemove", function(e){
				/*console.log(1-1)*/
				_this._eventMove(e,CS,_this.option.ctx);
			},false);
			CS[0].addEventListener("mousedown", function(e){
				/*console.log(2-2)*/
				_this._eventDown(e,_this.option.ctx)
			},false);
			CS[0].addEventListener("mouseup", function(e){
				/*console.log(3-3)*/
				_this._eventUp(e,_this.option.ctx)
			},false);

			//移动端的处理
			CS[0].addEventListener('touchstart', function(e){
				/*console.log(1)*/
				_this._eventDown(e,_this.option.ctx)
			},false);
			CS[0].addEventListener('touchend', function(e){
				/*console.log(2)*/
				_this._eventUp(e,_this.option.ctx)
			},false);
			CS[0].addEventListener('touchmove', function(e){
				/*console.log(3)*/
				_this._eventMove(e,CS,_this.option.ctx)
			},false);
		}

		_this.create(_this.option.ctx);
	}
	//创建canvas画布
	,create : function(ctx){
		var _this = this;
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = '#aaaaaa';
		ctx.fillRect(0,0,_this.option.el[0].clientWidth,_this.option.el[0].clientHeight);
		ctx.fill();

		ctx.font = "Bold 30px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#999999";
		if(!_this.option.se){
			ctx.fillText("刮一刮",_this.option.el[0].width/2,50);
		}else{
			ctx.fillText("预览,无法刮奖",_this.option.el[0].width/2,50);
		}
		//把这个属性设为这个就可以做出圆形橡皮擦的效果
		//有些老的手机自带浏览器不支持destination-out,下面的代码中有修复的方法
		ctx.globalCompositeOperation = 'destination-out';
	}
	//获得canvas擦除面积
	,getCanvasData : function(ctx){
		var _this = this;
		var area = [];
		var j = 0;
		//得到canvas的全部数据
		var a = ctx.getImageData(0,0,_this.option.el[0].width,_this.option.el[0].height);
		for(var i = 3; i < a.data.length; i+=4){
			if(a.data[i] == 0)j++;
		}
		area.push(a.data.length,j);
		return area
	}
	//鼠标抬起 和 触摸结束
	,_eventUp : function(e,ctx){
		e.preventDefault();
		var _this = this;
		_this.option.ismousedown = false;
	}
	//鼠标按下 和 触摸开始
	,_eventDown : function(e){
		var _this = this;
		//判断登录
		if($('input[name="login"]').val() == '0') { //未登录
			if (!Util.isLogin.login()) {
				Util.act.power($('input[name="chnlId"]').val());
				return
			} else {
				$('input[name="login"]').val('1');
			}
		}
		//读取可刮奖次数
		if(!_this.option.isMove){
			_this.option.clickNum = _this.clickTm(_this.option.numUrl);
		}
		//抽奖次数加载失败，重新请求
		if(_this.option.clickNum === ''){
			Util.layer.confirm({
				content : '无法刮奖，请刷新重试',
				btn : '刷新',
				close: false,
				okFn : function(){
					_this.option.clickNum = _this.clickTm(_this.option.numUrl);
				}
			});
			return
		}
		if(_this.option.clickNum == '0'){
			Util.layer.tips('亲，您的刮奖机会用光了');
			return
		}
		_this.option.isMove = true;
		e.preventDefault();
		_this.option.ismousedown = true;
	}
	//鼠标移动 和 触摸移动
	,_eventMove : function(e,cs,ctx){
		var _this = this;
		var next = false;
		e.preventDefault();
		var CS = cs;
		//获取移动时候的面积
		var area = _this.getCanvasData(ctx);
		if(!_this.option.isGetPrize){
			if(area[1] < '1' && $('input[name="num"]').val() > '0'){ //当移动的面积小于1时候请求结果
				//_this.option.index++; //测试抽奖次数用，可删除
				var el = $('#btn_chick');
				el.click(function(){
					Log.trackEvent(['互动营销','抽奖',_this.option.id,'1'], this); //统计刮奖次数
				});
				el.click();
				Util.ajax.postJsonAsync(_this.option.drawUrl,"&cmpgnId=" + _this.option.id,function(json,status){
					_this.option.isGetPrize = true;
					var loading = Util.layer.loading(10000);
					if(status){
						_this.option.clickNum = _this.option.clickNum - 1;
						var num = json.bean.lvlCd ? json.bean.lvlCd : '';
						var lvlNm = json.bean.lvlNm ? json.bean.lvlNm : '';
						if(num == '00'){
							document.getElementById("prompt").innerHTML = '再来一次';
						}else if( num == ''){
							document.getElementById("prompt").innerHTML = '好可惜，差点就中奖了';
						}else{
							document.getElementById("prompt").innerHTML = lvlNm ? lvlNm : '';
						}
						Util.layer.close(loading);
					}else{
						Util.layer.tips(json.returnMessage);
						Util.layer.close(loading);
						next = true
					}
				});
				/*$('#ajax_load_times').html('<p>请求次数：'+ _this.option.index+'----'+area[1] +'</p>');*/
			}
		}
		if(next){
			setTimeout(function(){
				_this.init();
			},500);
		}
		if(_this.option.ismousedown) {
			if(e.changedTouches){
				e = e.changedTouches[e.changedTouches.length - 1];
			}
			var topY = document.getElementById("top").offsetTop;
			var oX = CS[0].offsetLeft,
				oY = CS[0].offsetTop+topY;

			var x = (e.clientX + document.body.scrollLeft || e.pageX) - oX || 0,
				y = (e.clientY + document.body.scrollTop || e.pageY) - oY || 0;

			//画360度的弧线，就是一个圆，因为设置了ctx.globalCompositeOperation = 'destination-out';
			//画出来是透明的
			ctx.beginPath();
			ctx.arc(x, y, _this.option.fontem*1.2, 0, Math.PI * 2,true);

			//下面3行代码是为了修复部分手机浏览器不支持destination-out
			//我也不是很清楚这样做的原理是什么
			_this.option.el[0].style.display = 'none';
			_this.option.el[0].offsetHeight;
			_this.option.el[0].style.display = 'inline-block';

			ctx.fill();
		}
		//当被刮开的区域大于1%，则请求接口返回抽奖信息
		if(area[1] >= area[0] / 7){
			_this.option.isOk = true;
			$('#c1').hide();
			$('#no').show().css('z-index','99');
		}
	}
	//绑定点击事件
	,_even : function(){
		var _this = this;
		$("#no").on('tap',function() {
			$(this).hide().css('z-index','1');
			_this.init();
		});
		$('.act-record').on('click',function(){
			_this._record();
		});
	}
	//活动基本信息 规则/奖品
	,load : function(url, id){  //加载活动数据
		var _this = this;
		Util.ajax.postJsonAsync(url,"&cmpgnId=" + id,function(json,status){
			var loading = Util.layer.loading(10000);
			if(status){
				var data = json;
				var bean = data.bean;
				$('title').text( bean.cmpgnNm + '-云营销'); //网页标题
				$('input[name="chnlId"]').val(bean.chnlId);
				if(!!json.bean.actvBannerPicAddr){
					$('.group_banner img').attr('src',json.bean.ftpUrl + json.bean.actvBannerPicAddr)
				}
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
	}
	//抽奖次数
	,clickTm : function(url){
		var _this = this;
		var num;
		Util.ajax.postJsonAsync(url,"&cmpgnId=" + _this.option.id,function(json,status){
			var loading = Util.layer.loading(10000);
			if(status){
				num = json.bean.differTmsCnt ? json.bean.differTmsCnt : '';
				$('#clickTime').show();
				$('#clickTimeNum').text(num - 1);
				Util.layer.close(loading);
			}else{
				$('#clickTime').hide();
				num = '';
				Util.layer.close(loading);
			}
		});
		$('input[name="num"]').val(num);
		return num;
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
};