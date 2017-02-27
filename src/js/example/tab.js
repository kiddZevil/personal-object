/**
 * Created by lizhao on 2016/6/14.
 */
define(['Util',"tab","js/example/example"],
    function (Util,Tab,example) {
        //系统变量-定义该模块的根节点
        var $el = $('<div ><div id="tabContainer">asdasd</div></div>');
        //系统变量-构造函数
        var indexModule = null,param,Tab0;
        var initialize = function(_indexModule, _param){
            indexModule = _indexModule;
            param=_param;

            var config = {
                el:$('#tabContainer',$el),  //要绑定的容器
                tabs:[  //选项卡内容设置
                    {
                        title:'tab0',
                        click:function(e, tabData){
                            if(!Tab0){
                                Tab0=new example(_indexModule);
                            }
                            tab.content(Tab0.content);
                        }
                    },
                    {
                        title:'tab1',
                        click:function(e, tabData){
                            tab.content('222');
                        }
                    },
                    {
                        title:'tab2',
                        click:function(e, tabData){
                            tab.content('333');
                        }
                    }
                ]
            };
            var tab = new Tab(config);
            //将根节点赋值给接口
            this.content = $el;
        };

        return initialize;
    });
