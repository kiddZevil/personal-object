/*
 * 公共的业务js部分
 */
Util.browser = {
	/**
	 * 获取URL地址栏参数值
	 * name 参数名
	 * url [optional,default=当前URL]URL地址
	 * @return {String} 参数值
	 */
	getParameter : function(name, url) {
		var paramStr = url || window.location.search;
		paramStr = paramStr.split('?')[1];
		if ((!paramStr)||paramStr.length == 0) {return null;}
		var params = paramStr.split('&');
		for ( var i = 0; i < params.length; i++) {
			var parts = params[i].split('=', 2);
			if (parts[0] == name) {
				if (parts.length < 2 || typeof (parts[1]) === "undefined"
					|| parts[1] == "undefined" || parts[1] == "null")
					return '';
				return parts[1];
			}
		}
		return null;
	},
	isPc : function(){
		//判断浏览器是否在手机端 还是pc端  pc端返回true
		var userAgentInfo = navigator.userAgent,flag = true;
		var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
		for(var n in Agents){
			if(userAgentInfo.indexOf(Agents[n])>-1){
				flag = false;
			}
		}
		return flag;
	}
};
Util.handlebars = {
	/**
	 * Handlebars数据渲染
	 * @param obj
	 * @param temp
	 * @param data
	 * @param flag
	 */
	loadTemp : function(obj, temp, data, flag) {
		var template = Handlebars.compile((typeof(temp) == "object")?temp.html():temp);
		obj = (typeof(obj) == "object")?obj:$(obj);
		if(!flag){
			obj.html(template(data));
		}else{
			obj.append(template(data));
		}

	}
};
Util.localstorage = {
	/**
	 * 保存本地存储
	 * @param key
	 * @param value
	 */
	setParam : function(key, value){
		localStorage.setItem(key, value);
	},
	/**
	 * 获得本地存储
	 * @param key
	 * @returns {null}
	 * 查询不存在的key时，有的浏览器返回undefined，这里统一返回null
	 */
	getParam : function(key){
		var v = localStorage.getItem(key);
		return v === undefined ? null : v;
	},
	/**
	 * 清除KEY
	 * @param key
	 */
	removeParam : function(key){
		localStorage.removeItem(key);
	},
	/**
	 * 清除本地存储
	 */
	clearParam : function(){
		localStorage.clear();
	}
};
/*
* act 活动
* power 活动参与鉴权
* state 活动当前状态
* */
Util.act = {
	power : function(chnlId){
		var url = '/mamp/front/sh/user!userOauth?uid=u001';
		window.location.href = url + '&chnlId=' + chnlId + '&redirectUrl=' + window.location.href;
	}
	,state : function(cmpgnId){
		var flag = false;
		var url = 'front/sh/user!checkCmpgn?uid=c001';
		Util.ajax.postJsonAsync(url,'&cmpgnId=' + cmpgnId,function(json,status){
			if(status){
				var cmpgnUrlAddr = json.bean.cmpgnUrlAddr;
				var locUrl = window.location.href;
				if(locUrl.indexOf(cmpgnUrlAddr) == '-1' || json.bean.cmpgnStsCd == '01'){
					Util.layer.prompt({
						content : "当前活动未找到",
						shade: 'background-color: rgba(0,0,0,0.9)',
						close: false
					});
					flag = true;
				}
			}else{
				flag = true;
				Util.layer.prompt({
					content : json.returnMessage,
					shade: 'background-color: rgba(0,0,0,0.9)',
					close: false
				});
			}
		});
		return flag;
	}
};
Util.layer = {
	tips : function(obj,times,close){
		return layer.open({
			content:obj,
			time :times ? times : 1,
			style :"background:rgba(255,255,255,1);color:#555;min-width:150px;",
			shadeClose: !close ? close : true
		});
	},
	confirm : function(opt){
		//确认提示
		return layer.open({
			title : opt.title,
			content : opt.content,
			btn : opt.btn? opt.btn :['确认','取消'],
			yes : opt.okFn,
			no  : opt.cancelFn,
			cancel : opt.closeFn,
			shadeClose: opt.close == false ? opt.close : true
		});
	},
	bottomConfirm : function(opt){
		//从底部弹出
		return layer.open({
			content : opt.content,
			skin : 'footer',
			btn : opt.btn? opt.btn :['删除','取消'],
			yes : opt.okFn,
			no  : opt.cancelFn,
			cancel : opt.closeFn
		});
	},
	bottomTips : function(opt){
		//底部提示
		return layer.open({
			content : opt.content,
			skin : 'footer'
		});
	},
	opendiv : function(opt){
		//弹出框
		return layer.open({
			type : 1,
			content : opt.content,
			anim : opt.anim ? opt.anim : 0,
			style : opt.style ? opt.style : "position:fixed;bottom:0;width:100%;height:50%;padding:10px 0;border:none;display:block;",
			className : opt.className ? opt.className : "",
			shadeClose: opt.close == false ? opt.close : true,
			success: opt.suc
		});
	},
	prompt : function(opt){
		return layer.open({
			title : opt.title ? opt.title :"",
			content : opt.content,
			shade : opt.shade ? opt.shade : 'background-color: rgba(0,0,0,.7)',
			shadeClose: opt.close == false ? opt.close : true
		});
	},
	loading : function(times){
		return layer.open({
			/*type : 2,*/
			content: '<div class="t-loading-cmcc-lg">加载中...</div>',
			style :"background:rgba(255,255,255,1);color:#777;",
			shade: true,
			time : times ? times : ""
		})
	},
	close : function(index){
		layer.close(index);
	},
	closeAll : function (){
		layer.closeAll();
	}
};
Util.isLogin = {
	/**
	 * 获取登录
	 * @returns {boolean}
	 */
	login: function(){
		var flag = false;
		Util.ajax.postJsonAsync("front/sh/user!session?uid=u001","",function(json,status){
			if(!(json.bean && json.bean.userId)){
				window.sessionStorage.removeItem("userInfo");
				flag = false;
			}else{
				//存储用户信息,关闭浏览器即清除
				window.sessionStorage.setItem("userInfo",JSON.stringify(json.bean));
				flag = true;
			}
		});
		return flag;
	},
	/**
	 * 获取登录后的个人信息
	 */
	userInfo: function(){
		var user = window.sessionStorage.getItem('userInfo');
		var userInfo = JSON.parse(user);
		return userInfo;
	}
};
Util.time = {
	gTime : function(flag){
		var severtime;
		if(flag){
			var xmlHttp = new XMLHttpRequest();
			if(!xmlHttp){
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlHttp.open("HEAD",location.href,false);
			xmlHttp.send();
			severtime  = new Date(xmlHttp.getResponseHeader("Date"));
		}else{
			severtime = new Date();
		}
		return severtime;
	}
};
Util.page = {
	/**
	 * 页面状态显示无数据、无网络等
	 * @param param
	 * @param callback
	 */
	state: function(param,callback){
		var stateParam = {
			icon: 'icon-data-empty',   //@param : icon 图标
			el: '',     //@param : el 插入的DOM节点
			txt: '',    //@param : txt 插入的描述语句
			btn: false, //@param : btn 是否需要按钮
			btnCon:''  //@param : con 插入的内容
		};
		stateParam = $.extend(stateParam,param);
		var area = (typeof  stateParam.el == 'object') ? stateParam.el : $(stateParam.el),
			txt = stateParam.txt ? stateParam.txt : '这里什么也没有',
			htmlBox = '';
		htmlBox +='<div class="pageState">';
		htmlBox +='<i class="iconfont '+ (stateParam.icon ? stateParam.icon : 'icon-data-empty') +'"></i>';
		htmlBox +='<div class="txt">'+ txt +'</div>';
		if(stateParam.btn){
			htmlBox +='<a class="btn-primary stateBtn">'+ (stateParam.btnCon ? stateParam.btnCon : '立即去选购') +'</a>';
		}
		htmlBox +='</div>';
		area.html(htmlBox);
		$('.stateBtn').tap(function(){
			if(typeof callback == 'function'){
				callback();
			}
		})
	}
};
//页面统计
var _cmosq = _cmosq || [];
$(function(){
	var flag = Util.browser.getParameter('se');
	if(flag != '0'){
		_cmosq.push(['sysId', 'mamp']);
		(function() {var ma = document.createElement('script');ma.async = true;ma.src = ('https:' == document.location.protocol ? 'https://211.138.24.187:20000/':'http://211.138.24.187:20000/')+'cmosa/cmosa.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ma, s);})();
	}
});