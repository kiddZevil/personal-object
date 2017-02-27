/**
 * Created by lizhao on 2016/6/5.
 */
define(["Util", 'text!module/components/date.tpl','laydate'],function(Util,tpl){
  return  Util.extend({
        events:{
            'focus input':'_focusInput'
        },
        //template:Util.hdb.compile(tpl),
        _initialize:function(options){
            //this.options
            if (!options){
                console.log('please config params for date');
                return this;
            }
            this.options = options;
            this.template=Util.hdb.compile(options.tpl?options.tpl:tpl);
            this._render();
        },
        _render:function(){
            this.$el.addClass("timegroup").html(this.template(this.options));
            return this;
        },
        _focusInput:function(event){
            var config={};

            if(!this.options.double){
                $.extend(config,this.options);
                config.choose= $.proxy(function(datas){
                    this.choose&&this.choose.call(this,datas)
                },this.options);
            }else{
                var name=$(event.target||event.currentTarget).attr("name");
                if(this.options.double.start&&this.options.double.start.name==name){
                    $.extend(config,this.options.double.start);
                    config.choose= $.proxy(function(datas){
                        this.start.choose&&this.start.choose.call(this,datas)
                    },this.options.double);
                }else if(this.options.double.end&&this.options.double.end.name==name){
                    $.extend(config,this.options.double.end);
                    config.choose= $.proxy(function(datas){
                        this.end.choose&&this.end.choose.call(this,datas)
                    },this.options.double);
                }
            }
            //规避lay的elem和event配置
            config.elem&&delete(config.elem);
            config.event&&delete(config.event);
            laydate(config);
        }
    });
});