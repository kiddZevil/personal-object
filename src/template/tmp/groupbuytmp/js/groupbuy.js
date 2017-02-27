//模板列表渲染需要向该函数传递列表所在的dom容器以及营销活动的类型
define(['Util'
        ,"text!module/workflow/activity/templateList.tpl"],
    function (Util,tmpTpl) {
        TEMPLATE_TPL = Util.hdb.compile(tmpTpl);
    var initialize = function (option) {
        this.option = $.extend({
            el:""
        },option);
        this.$el = this.option.el;
        this.type= option.type;    //获取活动类型
        this.id = option.id;
        this.change = option.change;
        this.selFn = option.selFn;
        this.loadData();
        this.even();
    };
    $.extend(initialize.prototype,{
        even : function(){
            var _this = this;
            _this.$el.on('click', ".templateList li",function(e) {
                var $this = $(this);
                if(_this.change){
                    Util.dialog.openDiv({
                        id: "t1",
                        content: "更换模版将清空已填写的奖品,慎重操作",
                        okVal: "确定",
                        width: 300,
                        okCallback: function () {
                            if($this.data('prz') == ($('.t-tabs-items li').length - 1)){
                                _this.selTpl(e, $this);
                            }else{
                                _this.selTpl(e, $this);
                                (_this.selFn && typeof(_this.selFn) === "function") && _this.selFn();

                            }
                        },
                        cancelVal: "取消",
                        cancelCallback: function () {
                        }
                    })
                }else{
                    _this.selTpl(e, $(this));
                    (_this.selFn && typeof(_this.selFn) === "function") && _this.selFn();
                }

            });
        },
        loadData : function(){
            var _this = this;
            Util.ajax.postJson('front/sh/campaign!execute?uid=m001',{'cmpgnTypeCd':this.type},function (json,status) {
                if(status){
                    if(json.returnCode == "0"){
                        _this.$el.html(TEMPLATE_TPL({beans:json.beans}));
                        if(_this.id){
                            $('.templateList li').each(function(){
                                if($(this).data('id') == _this.id){
                                    $(this).siblings().removeClass('selected-img');
                                    $(this).addClass('selected-img');
                                    var tempId =  $(this).data('id');
                                    var tmpltPath =$(this).data('path');
                                    $("input[name='tmpltId']").val(tempId);
                                    $("input[name='tmpltPath']").val(tmpltPath);
                                }
                            });
                        }else{
                            var firstLi = $('.templateList li:first');
                            firstLi.addClass('selected-img');
                            $("input[name='tmpltId']").val(firstLi.data('id'));
                            $("input[name='tmpltPath']").val(firstLi.data('path'));
                        }
                    }else{
                        Util.dialog.tips("获取模板列表失败！")
                    }
                }else{
                    Util.dialog.tips("获取模板列表失败！")
                }
            });
        },
        selTpl : function(e,el){
            var _this = this;
            el.siblings().removeClass('selected-img');
            el.addClass('selected-img');
            var tempId = el.data('id');
            $("input[name='tmpltId']").val(tempId);
        }
    });
    return function (opt) {
        new initialize(opt)
    };
    //初始化列表事件
});





