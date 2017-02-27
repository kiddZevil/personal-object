/**
 *    @author: zhanglizhao
 *    @date: 2016-06-02
 *    一下url指的都是hash
 *    此文件为基础组件文件，不可随意改动
 */
define(['Util','assets/lib/base64/base64'],
    function (Util) {
        return Util.extend({
            _initialize:function(option){
                this.option = $.extend({
                    el:"",
                    homeUrl:'js/index/content',
                    errorUrl:'js/error/error'
                }, option);
                //this.$el=$(option.el);
                if(!this.$el.length){console.log("This element does not exist");return false}
            },
            goCurrentPage:function(url){
                if(url){
                    this.option.homeUrl=url;
                }
                this._handleUrl(window.location.hash.slice(1));
                $(window).bind('hashchange', $.proxy(function () {
                    this._handleUrl(window.location.hash.slice(1));
                }, this));
            },
            //解密url
            _decryption: function (url) {
                return Base64.decode(url);
            },
            //加密url
            _encryption:function(url){
                return Base64.encodeURI(url)
            },
            //处理hash
            _handleUrl: function (hash) {
                var url = this._parseUrl(hash);
                this.trigger("change",url);
                this._require(url)
            },
            //根据url require 一个模块页面显示到页面
            _require:function(url){
                var _this=this;
                if(url&&(/^(https|http):/.test(url.url))){
                    this._showIframe(url.url,url.param)
                }else{
                    require([url.url?url.url:_this.option.homeUrl], function (indexModel) {
                        if (indexModel) {
                            _this._requireModel(indexModel, url)
                        } else {
                            _this._requireError(url)
                        }
                    }, function () {
                        _this._requireError(url)
                    })
                }
            },
            //require 错误页面js
            _requireError: function (url) {
                var _this = this, errorItem = this.option.errorUrl;
                if (!errorItem) {
                    console.log("Please set the error page");
                    return false
                }
                require([this.option.errorUrl], function (indexModel) {
                    _this._requireModel(indexModel)
                })
            },
            //展示、渲染一个iframe
            _showIframe:function(url,param){
                var urlArr=url.split("#"),src=urlArr[0],hash=urlArr[1];
                if(hash){
                    var urlObj=this._parseUrl(hash);
                    if(param){
                        urlObj.param=$.extend(urlObj.param,param);
                    }
                    src+="#"+this._getUrl(urlObj.url,urlObj.param);
                }else{
                	src=url;
                	if(param){
                		src+="#"+this._getUrl(url,param);
                    }
                	
                }
                this.$el.empty();
                $('<iframe src="'+src+'" frameborder="0" tabindex="-1"  width="100%"></iframe>').appendTo(this.$el).height($(window).height());
            },
            //实例化  require的模块
            _requireModel: function (indexModel, hashItem) {
                if(Util.type.isFunction(indexModel)){
                    var result = new indexModel($.extend({},this.option.param,{main:{createTab:$.proxy(this.createTab,this)}}), hashItem);
                    if (typeof(result) === 'object') {
                        if (result.hasOwnProperty('content')) {
                            this.$el.empty().append(result.content);
                        } else {
                            this.$el.empty().append(result);
                        }
                    } else {
                        this.$el.html(result);
                    }
                    result.renderCallback && result.renderCallback()
                }else{
                    console.log("indexModel is not a function")
                }
            },
            //解析url，返回解析后url参数
            _parseUrl: function (url) {
                var obj={};
                url=this._decryption(url);
                if(url.indexOf("?")>-1){obj.url=url.replace("url=","");return obj }
                $.each(url.split("&"),function(key,val){
                    var arr=val.split("=");
                    if((arr[0]=='url')&&arr[1]){
                        obj[arr[0]]=arr[1]
                    }else{
                        arr[1]&&(obj.param||(obj.param={}),obj.param[arr[0]]=arr[1]);
                    }
                });
                return obj;
            },
            /*  // 根据url 跳转到指定模块
            href:function(url,param){
                window.location.hash="#"+this._getUrl(url,param)
            },*/
            // 根据url 进入指定模块
            /**
             * 入参：
             * url: string  要打开的模块地址
             * param: object  要为打开模块传的参数
             * */
            createTab:function(option){            	
                window.location.hash="#"+this._getUrl(option.url,option.param)
            },
            //获取当前
            getCurrentTab:function(){
                var url=this._parseUrl(window.location.hash.slice(1));
                return url.url?url:{url:this.option.homeUrl};
            },
            // 根据url 得到加密后的 hash
            _getUrl:function(url,param){
                var hash="url="+url;
                if(Util.type.isObject(param)){
                    for(var i in param){
                        hash+="&"+i+"="+param[i];
                    }
                }
                return this._encryption(hash)
            }
        })
    });