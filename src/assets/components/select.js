/*
 * 组件-tab
 */
define(['Util',
        'text!module/components/select.tpl'
    ],
    function (Util,tpl) {
        var select=function(options){
        	 this._listeners={};
            this._initialize(options);
        };
        $.extend(select.prototype,{
            _initialize:function(options){
                this.options = $.extend({
                    el:"",
                    label:'',
                    name:''
                }, options);
                this.$el=$(this.options.el);
                this.$el.on("change","select", $.proxy(this._selectChange,this));
                this.template = Util.hdb.compile(this.options.tpl ? this.options.tpl : tpl);
                this.json=[];
                this._render();
                if (options.url && typeof (options.url) == 'string' && options.url.length > 0){
                    Util.ajax.postJsonAsync(options.url,{}, $.proxy(function(json,status){
                        if(status){
                            this._renderOption(json.beans);
                        }
                    },this));
                }else if(options.date){
                    this._renderOption(options.date);
                }
            },
            on: function(type, listener){
                if (typeof this._listeners[type] == "undefined"){
                    this._listeners[type] = [];
                }
                this._listeners[type].push(listener);
            },
            trigger: function(event, param1, param2){
                if (typeof event == "string"){
                    event = { type: event };
                }
                if (!event.target){
                    event.target = this;
                }
                if (!event.type){  //falsy
                    throw new Error("Event object missing 'type' property.");
                }

                if (this._listeners[event.type] instanceof Array){
                    var listeners = this._listeners[event.type];
                    for (var i=0, len=listeners.length; i < len; i++){
                        listeners[i].apply(this, [].slice.call(arguments, 1));
                    }
                }
            },
            _isSelected:function(defaultVal,k,v){
                var is_selected=false;
                if(typeof defaultVal=='number'){
                    is_selected=(k==defaultVal);
                }else if(typeof defaultVal=='string'){
                    //传值 字符 按value== defaultVal 设置
                    is_selected=(defaultVal==v.value);
                }else if( Object.prototype.toString.apply(defaultVal)=== "[object Array]"){
                    //传值 数组格式['id',1] 设置
                    is_selected=(defaultVal[1]==v[defaultVal[0]]);
                }else{
                    is_selected=(k==0);
                }
                return is_selected
            },
            setValue:function(value){
                this.$select.val(value);
            },
            _renderOption:function(json){
                this.json=(json&&json.length)?json:[];
                if(!this.options.value){
                    this.options.value='';
                    this.json.splice(0, 0, {value:"",name:this.options.topOption?this.options.topOption:"请选择"})
                }
                this.$select=this.$el.find("select");
                $.each(this.json, $.proxy(function(k,v){
                    this.$select.append('<option value="'+ v.value+'" '+(this._isSelected(this.options.value,k,v)?"selected":"")+'>'+ v.name+'</option>');
                },this));
            },
            _render: function () {
                this.$el.html(this.template(this.options));
                return this;
            },
            enable:function(e){
                this.$el.find("select").prop("disabled",false);
            },
            disabled:function(){
                this.$el.find("select").prop("disabled",true);
            },
            _selectChange:function(e){
                this.trigger("change",e,this.getSelected());
            },
            getSelected:function(name){
                var val=this.$select.val(),item;
                $.each(this.json, $.proxy(function(k,v){
                    if(this._isSelected(val,k,v)){
                        item=v;
                    }
                },this));
                return name?item.name:item;
            }
        });

        return select;
        /* return Util.extend({
         events:{
         'change select':'_selectChange'
         //,'change':'change'
         },
         _initialize:function(options){
         this.options = $.extend({
         el:"",
         label:'',
         name:''
         }, options);
         this.template = Util.hdb.compile(this.options.tpl ? this.options.tpl : tpl);
         this.json=[];
         this._render();
         if (options.url && typeof (options.url) == 'string' && options.url.length > 0){
         Util.ajax.postJson(options.url,{}, $.proxy(function(json,status){
         if(status){
         this._renderOption(json.beans);
         }
         },this));
         }else if(options.date){
         this._renderOption(options.date);
         }
         },
         _isSelected:function(defaultVal,k,v){
         var is_selected=false;
         if(typeof defaultVal=='number'){
         is_selected=(k==defaultVal);
         }else if(typeof defaultVal=='string'){
         //传值 字符 按value== defaultVal 设置
         is_selected=(defaultVal==v.value);
         }else if( Object.prototype.toString.apply(defaultVal)=== "[object Array]"){
         //传值 数组格式['id',1] 设置
         is_selected=(defaultVal[1]==v[defaultVal[0]]);
         }else{
         is_selected=(k==0);
         }
         return is_selected
         },
         setValue:function(value){
         this.$select.val(value);
         },
         _renderOption:function(json){
         this.json=(json&&json.length)?json:[];
         if(!this.options.value){
         this.options.value='';
         this.json.splice(0, 0, {value:"",name:this.options.topOption?this.options.topOption:"请选择"})
         }
         this.$select=this.$el.find("select");
         $.each(this.json, $.proxy(function(k,v){
         this.$select.append('<option value="'+ v.value+'" '+(this._isSelected(this.options.value,k,v)?"selected":"")+'>'+ v.name+'</option>');
         },this));
         },
         _render: function () {
         this.$el.html(this.template(this.options));
         return this;
         },
         enable:function(e){
         this.$el.find("select").prop("disabled",false);
         },
         disabled:function(){
         this.$el.find("select").prop("disabled",true);
         },
         _selectChange:function(e){
         this.trigger("change",e,this.getSelected());
         },
         getSelected:function(name){
         var val=this.$select.val(),item;
         $.each(this.json, $.proxy(function(k,v){
         if(this._isSelected(val,k,v)){
         item=v;
         }
         },this));
         return name?item.name:item;
         }
         });*/

    });


