//模板列表渲染需要向该函数传递列表所在的dom容器以及营销活动的类型
define(['Util'
        ,'upload'
        ,"text!module/workflow/activity/templateList.tpl"],
    function (Util,Upload,tmpTpl) {
        TEMPLATE_TPL = Util.hdb.compile(tmpTpl);
    var initialize = function (option) {
        this.option = $.extend({
            el:""
        },option);
        this.$el = this.option.el;
        this.type= option.type;    //获取活动类型
        this.id = option.id;
        this.cType = option.cType; //查询子类型模版
        this.img = option.img;
        this.ftp = option.ftp;
        this.change = option.change;
        this.selFn = option.selFn;
        this.loadFn = option.loadFn;
        this.loadData();
        this.even();
    };
    $.extend(initialize.prototype,{
        even : function(){
            var _this = this;
            _this.$el.on('click', ".templateList li",function(e) {
                var $this = $(this);
                if(!$this.hasClass('selected-img')){
                    if(_this.change){
                        Util.dialog.openDiv({
                            id: "t1",
                            content: "更换模版将清空已填写的奖品,慎重操作",
                            modal:1,
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
                }
            });
            _this.$el.on('click','.prize-change-img',function(){
                _this.$el.find('.prize-add-imgbg').show();
                _this.$el.find('.imgUrl').hide().attr('src','');
                _this.$el.find('input[name="actvBannerPicAddr"]').val('');
            })
        },
        loadData : function(){
            var _this = this;
            var param = !_this.cType ? {'cmpgnTypeCd':_this.type} : {'cmpgnChildTypeCd':_this.cType};
            Util.ajax.postJson('front/sh/campaign!execute?uid=m001',param,function (json,status) {
                if(status){
                    if(json.returnCode == "0"){
                        _this.$el.html(TEMPLATE_TPL({beans:json.beans,ftpUrl:json.bean.ftpUrl}));
                        if(_this.id){
                            $('.templateList li').each(function(){
                                if($(this).data('id') == _this.id){
                                    $(this).siblings().removeClass('selected-img');
                                    $(this).addClass('selected-img');
                                    var tempId =  $(this).data('id');
                                    var tmpltPath =$(this).data('path');
                                    var ctypecd = $(this).data('ctypecd');
                                    $("input[name='tmpltId']").val(tempId);
                                    $("input[name='cmpgnChildTypeCd']").val(ctypecd);
                                    $("input[name='tmpltPath']").val(tmpltPath);
                                    _this.$el.find('.prize-upload-img').css({
                                        "width": $(this).data('w') / 2,
                                        "height": $(this).data('h') / 2
                                    });
                                    _this.$el.find('.prize-add-imgbg').css({
                                        "height": $(this).data('h') / 2,
                                        "line-height" : $(this).data('h') / 2 + 'px'
                                    });
                                    if(!!_this.img){
                                        _this.$el.find('.prize-add-imgbg').hide();
                                        _this.$el.find('.imgUrl').show().attr('src',_this.ftp + _this.img);
                                        _this.$el.find('input[name="actvBannerPicAddr"]').val(_this.img);
                                    }
                                    _this.imgSizeTip($(this).data('w'),$(this).data('h'));
                                    /*_this.wh = $(this).data('w');
                                    _this.ht = $(this).data('h')*/
                                }
                            });
                        }else{
                            var firstLi = $('.templateList li:first');
                            firstLi.addClass('selected-img');
                            $("input[name='tmpltId']").val(firstLi.data('id'));
                            $("input[name='cmpgnChildTypeCd']").val(firstLi.data('ctypecd'));
                            $("input[name='tmpltPath']").val(firstLi.data('path'));
                            _this.$el.find('.prize-upload-img').css({
                                "width": firstLi.data('w') / 2,
                                "height": firstLi.data('h') / 2
                            });
                            _this.$el.find('.prize-add-imgbg').css({
                                "height": firstLi.data('h') / 2,
                                "line-height" : firstLi.data('h') / 2 + 'px'
                            });
                            _this.imgSizeTip(firstLi.data('w'),firstLi.data('h'));
                           /* _this.wh = firstLi.data('w');
                            _this.ht = firstLi.data('h')*/
                        }
                        Upload.upload({
                            url:"front/sh/common!cmpgnImgUpload?uid=m002", //上传地址
                            name:"Filedata",
                            formData :"",        //上传传参
                            el:_this.$el.find('.prize-upload-img'),
                            add:function(){},
                            done:function(e,data,el){
                                var imgUrl = data.result.bean.ftpUrl + data.result.bean.nginxUrl;
                                el.find('input[name="actvBannerPicAddr"]').val(data.result.bean.nginxUrl); //模版保存路径
                                el.find('.prize-add-imgbg').hide();
                                el.find('.imgUrl').show().attr('src',imgUrl); //模版预览
                            },
                            fail:function(){
                                Util.dialog.tips("文件上传失败")
                            }
                        });
                        (_this.loadFn && typeof(_this.loadFn) === "function") && _this.loadFn();
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
            var ctypecd = el.data('ctypecd');
            var tempPath = el.data('path');
            $("input[name='tmpltId']").val(tempId);
            $("input[name='cmpgnChildTypeCd']").val(ctypecd);
            $("input[name='tmpltPath']").val(tempPath);
            var sHt = el.data('h');
            var sWt = el.data('w');
            _this.$el.find('.prize-upload-img').css({
                "width": sWt / 2,
                "height": sHt / 2
            });
           /* _this.wh = el.data('w');
            _this.ht = el.data('h');*/
            _this.$el.find('.prize-add-imgbg').css({
                "height": sWt / 2,
                "line-height" : sHt / 2 + 'px'
            });
            _this.imgSizeTip(sWt,sHt);
            if(tempId == _this.id){
                _this.$el.find('.prize-add-imgbg').hide();
                _this.$el.find('.imgUrl').show().attr('src',_this.ftp + _this.img);
                _this.$el.find('input[name="actvBannerPicAddr"]').val(_this.img);
            }else{
                _this.$el.find('.prize-add-imgbg').show();
                _this.$el.find('.imgUrl').hide().attr('src','');
                _this.$el.find('input[name="actvBannerPicAddr"]').val('');
            }
        },
        imgSizeTip : function(w,h){
            /*var _this = this;
            var txt = '推荐尺寸：'+ w.substring(0,w.length - 3) + 'px * ' + h.substring(0,h.length - 3) +'px';
            $('#img-def-size',_this.$el).html(txt)*/
        }
    });
    return function (opt) {
        new initialize(opt)
    };
    //初始化列表事件
});





