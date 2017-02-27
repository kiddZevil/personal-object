define(['Util'
        ,'upload'
        ,'text!module/workflow/activity/luckdraw/luckdrawTab/luckdrawTab.tpl'
        ,'text!module/workflow/activity/luckdraw/luckdrawTab/luckdrawPrize.tpl'
        ,'text!module/workflow/activity/luckdraw/luckdrawTab/resBoxRadio.tpl'
        ,'text!module/workflow/activity/luckdraw/luckdrawTab/resConRadio.tpl'],
    function (Util,Upload,ldTabTpl,ldPrizeTpl,resBoxTpl,resConTpl) {
        var nav = []
            ,objectLen
            ,objectLenAll
            ,LD_TAB_TPL = Util.hdb.compile(ldTabTpl)
            ,LD_PRIZE_TPL = Util.hdb.compile(ldPrizeTpl)
            ,NAV_ACTIVE = "active";
        var initialize = function(option,object){
            this.option = $.extend({
                el:""
            },option);
            this.$el = this.option.el;
            this.object = option.object;
            this.num = option.num; //限制最多奖项个数
            this.onceMore = option.onceMore;
            this.ftpUrl = option.ftpUrl;
            //编辑初始化tab页面
            if(option.object){
                var objectArr = option.object;
                if(option.onceMore == '0'){
                    objectArr.splice(objectArr.length - 1,0,'');
                    objectLen = objectArr.length - 2;
                    objectLenAll = objectArr.length - 1;
                }else{
                    objectArr.push('');
                    objectLen = objectArr.length - 1;
                    objectLenAll = objectArr.length - 1;
                }
                this.$el.html(LD_TAB_TPL({
                    editFlag:'编辑',
                    ftpUrl:option.ftpUrl,
                    onceMore:option.onceMore,
                    object:objectArr,
                    len:objectLen ,
                    allLen: objectLenAll
                }));
            }else{
                this.$el.html(LD_TAB_TPL({
                    beans:this._addBox(this.num + 1),
                    len:this.num
                }));
            }
            $('.t-tabs-wrap li',this.$el).each(function(){
                var $this = $(this);
                $this.find('.control-group.img').each(function(){
                    Upload.upload({
                        url:"front/sh/common!cmpgnImgUpload?uid=m002&width=60&height=60", //上传地址
                        name:"Filedata",
                        formData :"",        //上传传参
                        el:$(this).find('.prize-upload-img'),
                        add:function(){},
                        done:function(e,data,el){
                            var imgUrl = data.result.bean.ftpUrl + data.result.bean.nginxUrl;
                            el.find('input[name="przitmPicUrlAddr"]').val(data.result.bean.nginxUrl);
                            el.find('input[name="prizePicUrlAddr"]').val(data.result.bean.nginxUrl);
                            el.find('.prize-img-img').html('<img class="tempImg" src="'+imgUrl+'" alt="">');
                        },
                        fail:function(){
                            Util.dialog.tips("文件上传失败")
                        }
                    });
                });
            });
            this._tab(); //tab切换
            this._even(); //绑定事件
            this._verifyOdds(this.num); //计算中奖概率和；
            this._getPrizesSum(); //求奖项奖品总和
        };
        $.extend(initialize.prototype, {
            _even : function(){
                var _this = this;
                _this.$el.off('click').on('click', "#G-changeNavTit",function(e){
                    _this._changeTit(e,$(this));
                });
                _this.$el.on('click', ".add-PrizeAddRes",function(e){
                    _this._selRes(e);
                });
                _this.$el.on('click', ".del-PrizeAddRes",function(e){
                    _this._delPrizeRes(e,$(this));
                });
            }
            ,_addBox : function(len){
                nav = [];
                for(var i = 0; i < len; i++){
                    nav.push(i)
                }
                return nav;
            }
            ,_tab : function(){
                var $div_li = $('.t-tabs-items li');
                $div_li.click(function(){
                    var index =  $(this).index();
                    $(this).addClass(NAV_ACTIVE).siblings().removeClass(NAV_ACTIVE);
                    $('.t-tabs-wrap li').eq(index).addClass('selected').siblings().removeClass('selected');
                })
            }
            ,_changeTit : function(e,el){
                var _this = this
                    ,flag = el.data('flag')
                    ,type = false;
                if(flag == '0'){
                    el.text('保存奖项标题');
                    el.data('flag','1');
                    $('.t-tabs-items li',_this.$el).each(function(){
                        $(this).find('.c-form-control').show();
                        $(this).find('.prize-name').hide();
                        $(this).off('click');
                    });
                }else{
                    $('.t-tabs-items li',_this.$el).each(function(){
                        var tabVal = $(this).find('.c-form-control').val();
                        if(tabVal == ''){
                            Util.dialog.tips('请完善奖品项标题');
                            type = true;
                            return false;
                        }
                    });
                    if(type){
                        return
                    }
                    $('.t-tabs-items li',_this.$el).each(function(){
                        el.text('修改奖项标题');
                        el.data('flag','0');
                        var tabVal = $(this).find('.c-form-control').val();
                        $(this).find('.prize-name').html(tabVal).show();
                        $(this).find('.c-form-control').hide();
                    });
                    _this._tab();
                }
            }
            ,_selRes : function(e){
                var RES_BOX_TPL = $(resBoxTpl)
                    ,RES_CON_TPL = Util.hdb.compile(resConTpl)
                    ,_this = this
                    ,selmcdId = []
                    ,selRes = [];
                $('#G-resGoodsList',RES_BOX_TPL).html('');
                //获取资源列表
                Util.dialog.openDiv({
                    id : 'addGroupRule',
                    title:'添加活动资源',   //弹出窗标题
                    modal:1,
                    content:RES_BOX_TPL,  //要加载的模块
                    width:700,  //对话框宽度
                    height:400  //对话框高度
                });
                loadRes();
                function loadRes(rsNm){
                    if(!rsNm ){
                        rsNm = ''
                    }
                    var G_params = {
                        url : 'front/sh/resources!index?uid=sm001&excludeRsTypeCd=04&rsNm='+ encodeURI(rsNm) +'&_='+new Date().getTime(),
                        items_per_page : 6 ,                       // 每页数     @param : limit
                        page_index : 0 ,                            //当前页  @param : start
                        pagination : $('.pagination'),         //分页id
                        pageCallback:function(){
                            //点击TR选中单选
                            RES_BOX_TPL.on('click','#G-resGoodsList tr',function(){
                                $(this).find('input[name="resGoods"]').prop("checked", true);
                            });
                            //取消
                            RES_BOX_TPL.on('click','#G-close',function(){
                                Util.dialog.get('addGroupRule').remove();
                                $('.c-activity-list').remove();
                            });
                        },
                        tabletpl :RES_CON_TPL, //表格模板
                        tablewrap : $('#G-resGoodsList',RES_BOX_TPL)//表格容器
                    };
                    Util.ajax.pagination(G_params.page_index , true , G_params);
                }
                //筛选
                RES_BOX_TPL.on('click','#G-searchBox',function(){
                    var rsNm = $('.search-input',RES_BOX_TPL).val();
                    loadRes(rsNm);
                });
                //重置
                RES_BOX_TPL.on('click','#G-resetBox',function(){
                    $('.search-input',RES_BOX_TPL).val('');
                    loadRes();
                });
                //确认添加
                RES_BOX_TPL.on('click','#G-addResGoods',function(){
                    selRes = [];
                    selmcdId = [];
                    var flag = false;
                    //获取当前奖项下的资源
                    /*var showIndex = $('.t-tabs-items li.active').index();*/
                    $('.t-tabs-wrap li.selected').find('.prize-goods-box').each(function(){
                        selmcdId.push($(this).find('input[name="cmpgnRsId"]').val())
                    });
                    $('input[name="resGoods"]').each(function(){
                        var $this = $(this);
                        var parentTr = $this.closest('tr');
                        if($this.is(":checked")){
                            var selId = parentTr.data('id');
                            if(parentTr.data('qty') <= '0'){
                                Util.dialog.tips('资源“'+ parentTr.find('.res-goods-name').text() +'”数量不足，无法添加');
                                flag = true;
                                return false;
                            }
                            if(flag){
                                return
                            }
                            if(selmcdId.length == '0'){
                                selRes.push({
                                    "cmpgnRsId": parentTr.data('id'), //商品ID
                                    "rsNm":parentTr.find('.res-goods-name').text(),
                                    "prodUprc":parentTr.find('.res-goods-prc').text(),
                                    "rsPicPath":parentTr.data('img'),
                                    "crtTime":parentTr.find('.res-goods-time').text(),
                                    "leftQty":parentTr.data('qty')
                                });
                                selmcdId.push(selId);
                            }else{
                                for(var i in selmcdId){
                                    if(selmcdId[i] == selId){
                                        Util.dialog.tips('资源' + parentTr.find('.res-goods-name').text() + '已存在，请勿重复添加');
                                        flag = true;
                                        return false;
                                    }else{
                                        selRes.push({
                                            "cmpgnRsId": parentTr.data('id'), //商品ID
                                            "rsNm":parentTr.find('.res-goods-name').text(),
                                            "prodUprc":parentTr.find('.res-goods-prc').text(),
                                            "rsPicPath":parentTr.data('img'),
                                            "crtTime":parentTr.find('.res-goods-time').text(),
                                            "leftQty":parentTr.data('qty')
                                        });
                                    }
                                }
                            }
                        }
                    });
                    if(flag){
                        return
                    }
                    //获取当前显示的tab页面
                    Util.ajax.loadTemp($('li.selected .luckPrize-group'),ldPrizeTpl,{"bean":selRes},true);
                    Upload.upload({
                        url:"front/sh/common!cmpgnImgUpload?uid=m002&width=60&height=60", //上传地址
                        name:"Filedata",
                        formData :"",        //上传传参
                        el:$('li.selected .luckPrize-group').children('.prize-goods-box:last-child').find('.prize-upload-img'),
                        add:function(){},
                        done:function(e,data,el){
                            var imgUrl = data.result.bean.ftpUrl+data.result.bean.nginxUrl;
                            el.find('input[name="prizePicUrlAddr"]').val(data.result.bean.nginxUrl);
                            el.find('.prize-img-img').html('<img class="tempImg" src="'+imgUrl+'" alt="">');
                        },
                        fail:function(){
                            Util.dialog.tips("文件上传失败")
                        }
                    });
                    _this._getPrizesSum(); //求奖项奖品总和
                    Util.dialog.get('addGroupRule').remove();
                    $('.c-activity-list').remove();
                });
            }
            //删除奖品
            ,_delPrizeRes : function(e,el){
                var delVal = el.closest('.form-horizontal').find('input[name="prizePreprQty"]').val();
                var parentLi = el.closest('li')
                    ,prizeSum = parentLi.find('input[name="prizeItemQty"]');
                prizeSum.val(prizeSum.val() - delVal);
                el.closest('.prize-goods-box').remove();
            }
            ,_verifyOdds : function(len){
                $('input[name="winprzRate"]').on('input propertychange',function(){
                    var flag = $('input[name="rwdPrzdrwChancFlag"]:checked').val();
                    var sum = 0;
                    $('input[name="winprzRate"]').each(function(i){
                        var tsNum = $(this).val();
                        if(flag == '0' && i == len - 1){
                            tsNum = 0;
                        }else if(flag == '1' && i == len){
                            tsNum = 0;
                        }
                        sum += (tsNum - 0);
                    });
                    if(sum > 100){
                        $('#G-act-save').addClass('dis');
                        Util.dialog.tips('中奖概率之和不能大于100%');
                    }else{
                        $('#G-act-save').removeClass('dis');
                    }
                })
            }
            ,_getPrizesSum : function(){
                $('input[name="prizePreprQty"]').on('input propertychange',function(){
                    var parentLi = $(this).closest('li')
                        ,prizeSum = parentLi.find('input[name="prizeItemQty"]')
                        ,sum = 0;
                    $('input[name="prizePreprQty"]',parentLi).each(function(){
                        sum += ($(this).val() - 0);
                    });
                    prizeSum.val(sum);
                })
            }
        });

        return function (opt, object) {
            new initialize(opt, object)
        };
    });