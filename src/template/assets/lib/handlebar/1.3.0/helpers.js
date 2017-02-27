Handlebars.registerHelper('divide100', function(value) {
	return value / 100;
});
Handlebars.registerHelper('add', function(value, addition) {
	return value + addition;
});
Handlebars.registerHelper('i2c', function i2c(j) {
	var re = /^[1-9]+[0-9]*]*$/;
	if (re.test(j)) {
		var m = "";
		var y = parseInt(j) - 26;
		if (y <= 0) {
			m += String.fromCharCode(64 + parseInt(j))
			return m;
		} else {
			m += "Z" + i2c(y);
			return m;
		}
	} else {
		return "";
	}
});

Handlebars.registerHelper('subtract', function(value, substraction) {
	return value - substraction;
});
Handlebars.registerHelper('divide', function(value, divisor) {
	return value / divisor
});
/**
 * 求百分比 add by wangxy
 */
Handlebars.registerHelper('percentage', function(value, divisor) {
	return value * 100 / divisor
});
Handlebars.registerHelper('multiply', function(value, multiplier) {
	return value * multiplier
});
Handlebars.registerHelper('floor', function(value) {
	return Math.floor(value);
});
Handlebars.registerHelper('ceil', function(value) {
	return Math.ceil(value);
});
Handlebars.registerHelper('round', function(value) {
	return Math.round(value);
});
/**
 * If Equals if_eq this compare=that
 */
Handlebars.registerHelper('if_eq', function(context, options) {
	if (context == options.hash.compare)
		return options.fn(this);
	return options.inverse(this);
});

/**
 * 判断题目是不是判断题和单选题
 */
Handlebars.registerHelper('if_eqRouter', function(context, options) {
	if (context == '判断题' || context == '单选题')
		return options.fn(this);
	return options.inverse(this);
});

/**
 * 数字转化为字母
 */
Handlebars.registerHelper('i2c', function(context, options1, options2) {
	if (context == '判断题') {
		return options2 == "是" ? "Y" : "N"
	} else {
		if (options1 >= 0 && options1 <= 25) {
			return String.fromCharCode(65 + parseInt(options1))
		} else {
			return "";
		}
	}
});

/**
 * Unless Equals unless_eq this compare=that
 */
Handlebars.registerHelper('unless_eq', function(context, options) {
	if (context == options.hash.compare)
		return options.inverse(this);
	return options.fn(this);
});

/**
 * If Greater Than if_gt this compare=that
 */
Handlebars.registerHelper('if_gt', function(context, options) {
	if (context > options.hash.compare)
		return options.fn(this);
	return options.inverse(this);
});

/**
 * Unless Greater Than unless_gt this compare=that
 */
Handlebars.registerHelper('unless_gt', function(context, options) {
	if (context > options.hash.compare)
		return options.inverse(this);
	return options.fn(this);
});

/**
 * If Less Than if_lt this compare=that
 */
Handlebars.registerHelper('if_lt', function(context, options) {
	if (context < options.hash.compare)
		return options.fn(this);
	return options.inverse(this);
});

/**
 * Unless Less Than unless_lt this compare=that
 */
Handlebars.registerHelper('unless_lt', function(context, options) {
	if (context < options.hash.compare)
		return options.inverse(this);
	return options.fn(this);
});

/**
 * If Greater Than or Equal To if_gteq this compare=that
 */
Handlebars.registerHelper('if_gteq', function(context, options) {
	if (context >= options.hash.compare)
		return options.fn(this);
	return options.inverse(this);
});

/**
 * Unless Greater Than or Equal To unless_gteq this compare=that
 */
Handlebars.registerHelper('unless_gteq', function(context, options) {
	if (context >= options.hash.compare)
		return options.inverse(this);
	return options.fn(this);
});

/**
 * If Less Than or Equal To if_lteq this compare=that
 */
Handlebars.registerHelper('if_lteq', function(context, options) {
	if (context <= options.hash.compare)
		return options.fn(this);
	return options.inverse(this);
});

/**
 * Unless Less Than or Equal To unless_lteq this compare=that
 */
Handlebars.registerHelper('unless_lteq', function(context, options) {
	if (context <= options.hash.compare)
		return options.inverse(this);
	return options.fn(this);
});

/**
 * 裁剪内容,对于过长的string,使用...来替代 参数：内容,保留长度
 */
Handlebars.registerHelper("shrink", function(content, length) {
	content = content ? content : '';
	if (content.length > length) {
		content = content.slice(0, length);
		content += '..';
	}
	return new Handlebars.SafeString(content);
});

Handlebars.registerHelper("subStr", function(content, start, length) {
	content = content ? content : '';
	if (content.length > length && content.length > start) {
		content = content.slice(start, length);
	}
	return new Handlebars.SafeString(content);
});

Handlebars.registerHelper("ternary", function(content, value) {
	content = content ? content : value;
	return new Handlebars.SafeString(content);
});

/**
 * SafeString
 */
Handlebars.registerHelper('safeString', function(text, options) {
	text = text ? text : '';
	return new Handlebars.SafeString(text);
});

/**
 * 定义表格隔行变色
 */
Handlebars.registerHelper("splitClass", function(txt, fn) {
	var buffer = "split";
	if (txt % 2 == 0) {
		buffer = "";
	}
	return buffer;
});

/**
 * 判断数组中是否有多个数组项目
 * 
 */
Handlebars.registerHelper("if_array_multi", function(array, options) {
	array = array ? array : [ '' ];
	if (array.length && array.length > 1) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

/**
 * 索引值从1开始
 * 
 */
Handlebars.registerHelper("index", function(str, fn) {
	str += 1;
	return str;
});

/*
 * 截取日期字符串中的年月日，不显示时分秒
 */
Handlebars.registerHelper("tblDateFmt", function(date) {
	return date.substr(0, 10);
});
/**
 * 对比
 * 例：{{#expression bean.odrSts '==' "1000" "||" bean.odrSts '==' "1042"}} {{/expression}}
 */
Handlebars.registerHelper('expression', function() {
	var exps = [];
	try{
		//最后一个参数作为展示内容，也就是平时的options。不作为逻辑表达式部分
		var arg_len = arguments.length;
		var len = arg_len-1;
		for(var j = 0;j<len;j++){
			arguments[j] = "'"+arguments[j]+"'";
			exps.push(arguments[j]);
		}
		var express =  exps.join(' ').replace(/'&amp;&amp;'/g,'&&').replace(/'&lt;'/g,'<').replace(/'&gt;'/g,'>').replace(/'!='/g,'!=').replace(/'=='/g,'==');
		express = express.replace(/'\|\|'/g,'||');
		var result = eval(express);
		if (result) {
			return arguments[len].fn(this);
		} else {
			return arguments[len].inverse(this);
		}
	}catch(e){
		throw new Error('Handlerbars Helper "expression" can not deal with wrong expression:'+exps.join(' ')+".");
	}
});
/**
 * 截取字符串
 * 例如：{{substring "abcdefg" 2 5}}
 */
Handlebars.registerHelper("substring",function(str, start, end) {
	if(str==null || str=="") {
		return str;
	}
	return str.substring(start,end);
});
/**
 * 截取格式化金额金额 12.00 -->  12  12.01 --> 12.01
 * 例如：{{substring "12.00"}}
 */
Handlebars.registerHelper("formatMoney",function(str) {
	if(str == null || str == "") {
		return str;
	}
	return parseFloat(str);
});