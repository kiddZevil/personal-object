/**
 *	@author: zhanglizhao
 *	@date: 2016-06-02
 *  这是一个 业务代码编写实例（可复制后 编写业务代码）
 */
define(['Util','validator','text!module/example/validator.tpl'],
    function (Util,Validator,Tpl) {
        //系统变量-定义该模块的根节点
        var $el;
        //系统变量-构造函数
        var indexModule = null,param;
        var initialize = function(_indexModule, _param){
            indexModule = _indexModule;
            param=_param;
            $el = $(Tpl);
            var config = {
                el: $("form", $el),     //要验证的表单或表单容器
                submitBtn: $(".btnSearch", $el),    //触发验证的按钮，可不配置
                dialog:true,    //是否弹出验证结果对话框
                rules:{
                    email:'required|email',     //设置name=email 的元素为必填项，并且是邮箱格式
                    mobile:'required|mobile',   //设置name=mobile 的元素为必填项，并且是手机格式
                    brand:"required"           //设置name=brand 的元素为必填项
                },
                messages:{
                    startTime:{ //设置name=startTime 元素的消息
                        required:"",            //用户未填写该字段时提示
                        date:"开始日期格式不正确"    //日期格式验证失败时提示
                    },
                    content:{
                        min:"内容输入字数不能少于10"
                    }
                }
            };
            var form2 = new Validator(config);
            //将根节点赋值给接口
            this.content = $el;
        };

        return initialize;
    });
