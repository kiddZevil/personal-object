

define(['Util'], function(Util){

    return function(options){
        this.options = options;
        var url=options.url,_this=this;
        options.url=null;
        var dialogConfig = $.extend({
            //title:options.title,
            content:'',
            // ok:function(){ },
            // okValue: '关闭',
            width:options.width,
            height:options.height,
            modal:options.modal?options.modal:1,
            onremove:$.proxy(function(){
                this.dialog = null;
            },this),
            onclose:$.proxy(function (e) {
                $(document).css({"overflow":"auto"});
                this.dialog.remove();
            },this)
        },options);
        $(document).css({"overflow":"hidden"});
        options.ok&&(dialogConfig.ok=function(){_this.okCallback&&_this.okCallback();options.ok&&options.ok()});
        this.dialog = Util.dialog.openDiv(dialogConfig);
        this.$el = $('.ui-dialog-content',this.dialog.node);
        require.undef(url);
        require([url], $.proxy(function(objClass){
            //这段逻辑支撑了所返回的各种模块定义
            //
            var self = this.$el;
            if (typeof(objClass) === 'function'){
                var result = new objClass(this.options.index || {}, this.options.param);
                if (typeof(result) === 'object'){
                    if (result.hasOwnProperty('content')){
                        self.empty().append(result.content);
                    }else{
                        self.empty().append(result);
                    }
                }else{
                    self.html(result);
                }
                result.okCallback&&(_this.okCallback=result.okCallback)
            }else{
                self.html(objClass.content);
            }
            //this.$el.append(module.$el);
        },this));

    };
});

