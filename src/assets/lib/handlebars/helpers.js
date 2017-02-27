
define(['hdb'],function(Handlebars){
    Handlebars.registerHelper('if_object', function(context, options) {
        if (typeof(context) == options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });
    Handlebars.registerHelper('if_checkbox', function(context, options) {
        if (context == options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });
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

    
    //{{#expression a '==' b '&&' c '>' 0}}
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
    		express = express.replace(/'>'/g,'>');
    		express = express.replace(/'<'/g,'<');
    		express = express.replace(/'&&'/g,'&&');
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
    /*
     * 判断两个字符串是否相当
     * */
    Handlebars.registerHelper('compare', function(left, operator, right, options) {
        if (arguments.length < 3) {
            throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }
        var operators = {
            '==':     function(l, r) {return l == r; },
            '===':    function(l, r) {return l === r; },
            '!=':     function(l, r) {return l != r; },
            '!==':    function(l, r) {return l !== r; },
            '<':      function(l, r) {return l < r; },
            '>':      function(l, r) {return l > r; },
            '<=':     function(l, r) {return l <= r; },
            '>=':     function(l, r) {return l >= r; },
            'typeof': function(l, r) {return typeof l == r; }
        };
        if (!operators[operator]) {
            throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }
        var result = operators[operator](left, right);
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    /*
    * 返回当前索引
    */
    Handlebars.registerHelper("addIndex",function(index,options){
        return parseInt(index)+1;
    });
    /*
    * 根据开始结束时间判断当前活动状态
    * */
    Handlebars.registerHelper("appraisalState",function(bgnValidTime,endValidTime,options){
        var thisTime = Math.round(new Date().getTime()/1000)
            ,bgnTime = (new Date(bgnValidTime)).getTime()/1000
            ,endTime = (new Date(endValidTime)).getTime()/1000;
        if(bgnTime < thisTime && thisTime > endTime){
            return '<span class="t-tag">已结束</span>';
        }else if(thisTime > bgnTime && thisTime < endTime){
            return '<span class="t-tag-todo">已开展</span>';
        }else if(thisTime < bgnTime){
            return '<span class="t-tag-done">未开展</span>';
        }
    });
    /*
    * Object转String
    * */
    Handlebars.registerHelper("toString",function(object,options){
        return  JSON.stringify(object);
    });
    Handlebars.registerHelper("tdShow",function(index,options){
        return (index > 0) ? "fn-hide" : "";
    });
    Handlebars.registerHelper("dis",function(index,options){
        return (index > 0) ? 'disabled="disabled"' : "";
    });
    Handlebars.registerHelper("parent",function(val,index,options){
        return (index == 0) ? val : "";
    });
    Handlebars.registerHelper("active",function(index,options){
        return (index > 0) ? "" : "active";
    });
    Handlebars.registerHelper("selected",function(index,options){
        return (index > 0) ? "" : "selected";
    });
    Handlebars.registerHelper("prizeTit",function(index,options){
        var arr = ['一等奖','二等奖','三等奖','四等奖','五等奖','六等奖','七等奖','八等奖','输入名称'];
        if(index < 8){
            return arr[index];
        }else{
            return arr[arr.length - 1];
        }
    });
    Handlebars.registerHelper("prizeNav",function(index,options){
        var arr = ['奖项一','奖项二','奖项三','奖项四','奖项五','奖项六','奖项七','奖项八','输入名称'];
        if(index < 8){
            return arr[index];
        }else{
            return arr[arr.length - 1];
        }
    });
    /*判断是否为完整路径*/        
	Handlebars.registerHelper('complete', function(src,src2, options) {  
        var result = src2.substring(0,4);
        if (result == 'http') {
            return src2;
        } else {
            return src+src2;
        }
    });
    //活动统计分析处理表格合并显示
    Handlebars.registerHelper('stats', function(index, options) {

    });
});
