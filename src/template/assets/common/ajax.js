/**
* @author:fanyu
* @date：2015-09-16
* @desc: 通过 HTTP 请求加载远程数据，底层依赖jQuery的AJAX实现。当前接口实现了对jQuery AJAX接口的进一步封装。
*/

window.Util || (window.Util = {});
window.ajaxRoot = "/mamp/";
window.Util.ajax =  {
	/**
	 * 请求状态码
	 * @type {Object}
	 */
	reqCode: {
		/**
		 * 成功返回码 0
		 * @type {Number} 1
		 * @property SUCC
		 */
		SUCC: 0
	},
	/**
	 * 请求的数据类型
	 * @type {Object}
	 * @class reqDataType
	 */
	dataType: {
		/**
		 * 返回html类型
		 * @type {String}
		 * @property HTML
		 */
		HTML: "html",
		/**
		 * 返回json类型
		 * @type {Object}
		 * @property JSON
		 */
		JSON: "json",
		/**
		 * 返回text字符串类型
		 * @type {String}
		 * @property TEXT
		 */
		TEXT: "text"
	},
	/**
	 * 超时,默认超时30000ms
	 * @type {Number} 10000ms
	 * @property TIME_OUT
	 */
	TIME_OUT: 30000,
	/**
	 * 显示请求成功信息
	 *
	 * @type {Boolean} false
	 * @property SHOW_SUCC_INFO
	 */
	SHOW_SUCC_INFO: false,
	/**
	 * 显示请求失败信息
	 *
	 * @type {Boolean} false
	 * @property SHOW_ERROR_INFO
	 */
	SHOW_ERROR_INFO: false,
	/**
	 * GetJson是对ajax的封装,为创建 "GET" 请求方式返回 "JSON"(text) 数据类型
	 * @param {String}
	 *            url HTTP(GET)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] GET请求成功回调函数
	 */
	getJson: function (url, cmd, callback) {
		if (arguments.length !== 3)
			callback = cmd, cmd = '';
		//dataType = this.dataType.JSON;
		this.ajaxBase(url, 'GET', cmd, this.dataType.JSON, callback);
	},
	/**
	 * GetJson是对ajax的封装,为创建 "GET" 请求方式返回 "JSON"(text) 数据类型
	 * 采用同步阻塞的get方式调用ajax
	 * @param {String}
	 *            url HTTP(GET)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] GET请求成功回调函数
	 */
	getJsonAsync: function (url, cmd, callback) {
		if (arguments.length !== 3)
			callback = cmd, cmd = '';
		//dataType = this.dataType.JSON;
		this.ajaxBase(url, 'GET', cmd, this.dataType.JSON, callback, true);
	},
	/**
	 * PostJsonAsync是对ajax的封装,为创建 "POST" 请求方式返回 "JSON"(text) 数据类型,
	 * 采用同步阻塞的post方式调用ajax
	 * @param {String}
	 *            url HTTP(POST)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] POST请求成功回调函数
	 */
	postJsonAsync: function (url, cmd, callback) {
		//dataType = this.dataType.JSON;
		this.ajaxBase(url, 'POST', cmd, this.dataType.JSON, callback, true);
	},
	/**
	 * PostJson是对ajax的封装,为创建 "POST" 请求方式返回 "JSON"(text) 数据类型
	 * @param {String}
	 *            url HTTP(POST)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] POST请求成功回调函数
	 */
	postJson: function (url, cmd, callback) {
		//dataType = this.dataType.JSON;
		this.ajaxBase(url, 'POST', cmd, this.dataType.JSON, callback, '');
	},
	getJsonp: function (url, cmd, callback, sync) {
		this.ajaxJsonp(url, 'GET', cmd, callback, sync);
	},
	/**
	 * 跨域请求json数据
	 *
	 * @method ajax
	 * @param {String}
	 *            url HTTP(POST/GET)请求地址
	 * @param {String}
	 *            type POST/GET
	 * @param {Object}
	 *            cmd json参数命令和数据
	 * @param {Function}
	 *            callback [optional,default=undefined] 请求成功回调函数,返回数据data和isSuc
	 */
	ajaxJsonp: function (url, type, cmd, callback, sync) {
		var param = "";
		//sync ? false : true
		var thiz = this;
		if (!url || url === '') {
			console.log('the url of param cann\'t equals null or empty of string');
			return false;
		}
		if (!callback || callback === '') {
			console.log('you missed callback, it must be a function');
			return false;
		}
		if (!cmd || cmd === '') {
			console.log('warn! your passed null or empty to cmd param, are you suer?');
		}
		$.ajax({
			url: url,
			type: type,
			data: cmd,
			jsonpCallback: 'jsonCallback',
			contentType: "application/json;charset=utf-8",
			dataType: 'jsonp',
			async: sync ? false : true,
			timeout: thiz.TIME_OUT,
			beforeSend: function (xhr) {
				xhr.overrideMimeType("text/plain; charset=utf-8");
			},
			success: function (data) {
				if (!data) {
					return;
				}
				try {
					//超时重定向至登陆页
					if (data.returnCode == 'BUSIOPER=RELOGIN') {
						//判断是否存在iframe
						window.location.href = '../../login.html';
						return;
					}
				} catch (e) {
					alert("JSON Format Error:" + e.toString());
				}
				var isSuc = thiz.printReqInfo(data);
				if (callback && data) {
					callback(data || {}, isSuc);
				}
			},
			error: function () {
				var retErr = {};
				retErr['returnCode'] = "404";
				retErr['returnMessage'] = "网络异常或超时，请稍候再试！";
				callback(retErr, false);
			},
			complete: function () {
			}
		});
	},
	ajax: function (options) {
		var config = $.extend({
			type: 'post',
			dataType: 'json',
			timeout: 30000,
			beforeSend: function (xhr) {
				xhr.overrideMimeType("text/plain; charset=utf-8");
			}
		}, options);
		$.ajax(config);
	},
	/**
	 * 基于jQuery ajax的封装，可配置化
	 *
	 * @method ajax
	 * @param {String}
	 *            url HTTP(POST/GET)请求地址
	 * @param {String}
	 *            type POST/GET
	 * @param {Object}
	 *            cmd json参数命令和数据
	 * @param {String}
	 *            dataType 返回的数据类型
	 * @param {Function}
	 *            callback [optional,default=undefined] 请求成功回调函数,返回数据data和isSuc
	 */
	ajaxBase: function (url, type, cmd, dataType, callback, sync) {
		var param = "";
		/*async = sync ? false : true;*/
		var thiz = this;
		var cache = (dataType == "html") ? true : false;
		$.ajax({
			url: window.ajaxRoot?(window.ajaxRoot+url):url,
			type: type,
			data: cmd,
			cache: cache,
			dataType: dataType,
			async: sync ? false : true,
			timeout: thiz.TIME_OUT,
			beforeSend: function (xhr) {
				xhr.overrideMimeType("text/plain; charset=utf-8");
			},
			success: function (data) {
				if (!data) {
					return;
				}
				if (dataType == "html") {
					callback(data, true);
					return;
				}
				try {
					//超时重定向至登陆页
					if (data.returnCode == 'BUSIOPER=RELOGIN') {
						//判断是否存在iframe
						window.location.href = '../../login.html';
						return;
					}
				} catch (e) {
					alert("JSON Format Error:" + e.toString());
				}
				var isSuc = thiz.printReqInfo(data);
				if (callback && data) {
					callback(data || {}, isSuc);
				}
			},
			error: function (e) {
				var retErr = {};
				retErr['returnCode'] = "404";
				retErr['returnMessage'] = "网络异常或超时，请稍候再试！";
				callback(retErr, false);
			},
			complete: function () {
				if(status == 'timeout'){
					var retErr = {};
					retErr['returnCode'] = "timeout";
					retErr['returnMessage'] = "请求超时，请重试";
					callback(retErr, false);
				}
			}
		});
	},
	/**
	 * 打开请求返回代码和信息
	 *
	 * @method printRegInfo
	 * @param {Object}
	 *            data 请求返回JSON数据
	 * @return {Boolean} true-成功; false-失败
	 */
	printReqInfo: function (data) {
		if (!data) {
			return false;
		}
		var code = data.returnCode,
			succ = this.reqCode.SUCC;
		return !!(code == succ);
	},
	/**
	 * html5端手机分页
	 * @method ajaxPaginationMobile
	 * @param {Object}
	 * 			data 请求返回JSON数据
	 */
	paginationMobile : function ( params, formStr, callback) {
		var paginationParams = {
				url : "",
				limit : 6, //每页数     @param : limit
				start     : 0, //当前页      @param : start
				pagination     : null, //分页容器,
				tableTpl       : "", //分页模板
				tableWrap      : "" //分页容器
		}
		paginationParams = $.extend( paginationParams, params );
		var cmd = 'start='+(paginationParams.start * paginationParams.limit)+'&limit='+ paginationParams.limit +'&'+formStr;
		this.postJson(paginationParams.url ,cmd ,function(json , status){
			if(status) {
				var template,$tableTpl,
					$tableWrap = typeof(paginationParams.tableWrap) == "object" ?  paginationParams.tableWrap : $(paginationParams.tableWrap),
					$pagination	= typeof(paginationParams.pagination) == "object" ?  paginationParams.pagination : $(paginationParams.pagination);
				
				if(typeof(paginationParams.tableTpl) == "object"){
					$tableTpl = paginationParams.tableTpl;
					if($tableTpl.html()){
						template = Handlebars.compile($tableTpl.html());
					}
				}else{
					$tableTpl = paginationParams.tableTpl ?  paginationParams.tableTpl : ""
					template = Handlebars.compile($tableTpl);
				}
				$tableWrap.append(template(json));
				//if(typeof(paginationParams.callback) == "function") paginationParams.callback.call($pagination , json);
				if (callback && json) {
					callback(json || {},paginationParams);
				}
			}else{
				
			}
		});
	}
};













