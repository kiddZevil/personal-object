/**
 *    @author: zhanglizhao
 *    @date: 2016-06-02
 *    一下url指的都是hash
 *    此文件为基础组件文件，不可随意改动
 */

define(['Util','text!module/index/side.tpl','text!module/index/side_second.tpl','text!module/index/user.tpl','assets/lib/niceScroll/jquery.nicescroll'],function(Util,sideTpl,sideSecondTpl,userTpl,niceScroll) {

    return Util.extend({
        _initialize:function(option){
            this.option = $.extend({
                tpl: '',
                param:{},
                userUrl:'',
                el: ""
            }, option);
            if(!this.$el.length){console.log("This element does not exist");return false}
            //this._init();
        },
        events:{
            "click .J_click_item":"_rowClick",
            "click .J_click_seitem":"_rowSeClick"
        },
        sideShow:function(){
            var _this=this;
            Util.ajax.postJson(this.option.url?this.option.url:"src/assets/data/menu.json",'',function(json,status){
                if (status) {
                    _this.json=json.object;
                    if(_this.option.home){
                        _this.json.splice(0, 0, _this.option.home);
                    }
                    _this.$el.closest(".J_render_content").addClass("menu_show");
                    _this._render();
                    Util.ajax.postJson(_this.option.userUrl,'',function(json,status){
                        if (status) {
                            _this.$el.find(".J_hover_userInfoBox").html(Util.hdb.compile(userTpl)(json.bean));
                            _this.$el.find('.userInfo_name').html(json.bean.userAls);
                            _this.$el.find('#userInfo_hid').val(json.bean.userNm);
                            _this.$el.find('#userInfo_chnlId').val(json.bean.chnlId);
                        }
                    });
                    //侧边栏滚动条样式美化
                    $('.main_menu',_this.$el).niceScroll({
                        cursorcolor: "#ccc",//#CC0071 光标颜色
                        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
                        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
                        cursorwidth: "5px", //像素光标的宽度
                        cursorborder: "0", // 	游标边框css定义
                        cursorborderradius: "5px",//以像素为光标边界半径
                        autohidemode: true //是否隐藏滚动条
                    });
                }
            });
        },
        _rowSeClick:function(event){
            var $target = $(event.target||event.currentTarget), $item=$target.closest(".J_click_seitem"),url =$item.attr("data-url");
            this._addSecondClass($item);
            this.trigger("rowClick", this.$el.find(".J_click_seitem"), $item,url);
        },
        _rowClick: function (event) {
            var $target =$(event.target||event.currentTarget), $item=$target.closest(".J_click_item"),url =$item.attr("data-url");
            this._addOneClass($item);
            if (url) {
                this.$el.find(".J_render_item").html("");
                this.$el.closest(".J_render_content").removeClass("sub_menu_show");
                this.trigger("rowClick", this.$el.find(".J_click_item"), $item, url)
            }else{
                for(var i=0;i<this.json.length;i++){
                    if(this.json[i].id==$item.attr("data-id")){
                        this.$el.closest(".J_render_content").addClass("sub_menu_show");
                        this._renderSecondMenu({
                            name:this.json[i].name,
                            items:this.json[i].secondMenu
                        });

                    }
                }
            }
        },
        //为 菜单一 添加样式
        _addOneClass:function($item){
            this.$el.find(".J_click_item").removeClass("current");
            this.$el.closest(".J_render_content").removeClass("sub_menu_show");
            $item.addClass("current");
        },
        _addSecondClass:function($item){
            this.$el.find(".J_click_seitem").removeClass("current");
            $item.addClass("current");
        },
        _render: function () {
            var template = Util.hdb.compile(this.option.tpl?this.option.tpl:sideTpl);
            this.$el.html(template(this.json));
            if (this.option.param) {
                var url = this.option.param.getCurrentTab().url;
                for (var i = 0; i < this.json.length; i++) {
                    if (this.json[i].url == url) {
                        this._addOneClass(this.$el.find(".J_click_item").eq(i))
                    } else if (this.json[i].secondMenu) {
                        for (var y = 0; y < this.json[i].secondMenu.length; y++) {
                            if (this.json[i].secondMenu[y].url == url) {
                                this._addOneClass(this.$el.find(".J_click_item").eq(i));
                                this.$el.closest(".J_render_content").addClass("sub_menu_show");
                                this.$el.find(".J_render_item").html(Util.hdb.compile(this.option.tplSecond?this.option.tplSecond:sideSecondTpl)({
                                    name:this.json[i].name,
                                    items:this.json[i].secondMenu
                                }));
                                this._addSecondClass(this.$el.find(".J_click_seitem").eq(y))
                            }
                        }
                    }
                }
            }
            this._userHover();
            //this.trigger("success")
        },
        _userHover:function(){
            var outTimer,hoverTimer,$userInfo= this.$el.find(".J_hover_userInfo"),$userInfoBox=this.$el.find(".J_hover_userInfoBox");
            $userInfo.hover(function(){
                clearTimeout(outTimer);
                hoverTimer = setTimeout(function(){
                    $userInfoBox.show();
                },200);
            },function(event){
                clearTimeout(hoverTimer);
                outTimer = setTimeout(function(){
                    $userInfoBox.hide()
                }, 200);
            });
        },
        //根据url选中菜单对应项目
        selectUrl:function(url){
            if(!this.json) return false;
            for (var i = 0; i < this.json.length; i++) {
                if (this.json[i].url == url) {
                    this._addOneClass(this.$el.find(".J_click_item").eq(i))
                } else if (this.json[i].secondMenu) {
                    for (var y = 0; y < this.json[i].secondMenu.length; y++) {
                        if (this.json[i].secondMenu[y].url == url) {
                            this._addOneClass(this.$el.find(".J_click_item").eq(i));
                            this.$el.closest(".J_render_content").addClass("sub_menu_show");
                            this.$el.find(".J_render_item").html(Util.hdb.compile(this.option.tplSecond?this.option.tplSecond:sideSecondTpl)({
                                name:this.json[i].name,
                                items:this.json[i].secondMenu
                            }));
                            this._addSecondClass(this.$el.find(".J_click_seitem").eq(y))
                        }
                    }
                }
            }
        },
        _renderSecondMenu: function (json) {
            var template = Util.hdb.compile(this.option.tplSecond?this.option.tplSecond:sideSecondTpl);
            this.$el.find(".J_render_item").html(template(json)).find(".J_click_seitem").eq(0).trigger("click");
            //this.trigger("success")
        }
        /*update:function(){
         this._render();
         }*/
    });

});

