/**
 *	@author: zhanglizhao
 *	@date: 2016-06-02
 *  这是一个 业务代码编写实例（可复制后 编写业务代码）
 */
define(['Util','select','text!module/example/select.tpl'],
    function (Util,Select,Tpl) {
        //系统变量-定义该模块的根节点
        var $el;
        //系统变量-构造函数
        var indexModule = null,param;
        var initialize = function(_indexModule, _param){
            indexModule = _indexModule;
            param=_param;
            $el = $(Tpl);
            var select=new Select({
                el:$('#select',$el),       //要绑定的容器
                label:'用户',     //下拉框单元左侧label文本
                name:'userName',    //下拉框单元右侧下拉框名称
                //disabled:true,      //组件将被禁用
                topOption:"所有", //设置最顶部option的text属性
                value:'',//初始选中项设置 默认是按value，如果你想按id设置 也可以 value:["id",1],这样设置
                url:'../src/assets/data/select.json'   //数据源
            });
            //将根节点赋值给接口
            this.content = $el;
        };

        return initialize;
    });
