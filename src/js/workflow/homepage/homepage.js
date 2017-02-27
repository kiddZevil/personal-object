define([
    'Util'
    ,"date"
    ,'zeroClipboard'
    ,'text!module/workflow/homepage/homepage.tpl'
    ,'text!module/workflow/homepage/typeSelectOption.tpl'
    ,'text!module/workflow/homepage/activityList.tpl'],
    function (Util,Date,ZeroClipboard,homeTpl,typeTpl,activityListTpl) {
        //系统变量-定义该模块的根节点
        var $el
            ,ACTIVE = 'active'
            ,_indexModule = null
            ,_param;
		initialize = function(indexModule, param){
            $el = $(homeTpl);
            _indexModule = indexModule;
            _param = param;
            getActType();
            $el.on('click','#G-addActivity',openGruopbuy);  //默认打开创建团购活动
            $el.on('click','.search', getActivityList);
            $el.on('click','.nav-tab', changeTab);
            $el.on('click','.oper-activity', function(e){
                operationActivity($(this));
                e.stopPropagation();
            });
            getActivityList();
            dateTime();
            $el.on('click','.sn-list tr', function(e){
                var check = $(this).find('input[name="activity"]');
                check.is(':checked') ? check.prop("checked", false) : check.prop("checked", true);
            });
            /*$el.on('change','input[name="activity"]', function(e){
                $(this).is(':checked') ? $(this).prop("checked", false) : $(this).prop("checked", true);
                e.stopPropagation();
            });*/
            //全选
            /*$el.on('click','input[name="selectAll"]',function(){
                $('input[name="activity"]', $el).prop('checked',this.checked);
            });*/
            this.content = $el;
        };
        var getActType = function(){
            var $typeListDom = $('#G-select-list',$el);
            Util.ajax.postJson("src/assets/data/cmpgnTypeCd.json",'', function(json,status){
                if(status){
                    var data = json.object;
                    Util.ajax.loadTemp($typeListDom,typeTpl,{'cmpgnType':data});
                }
            });
        };
        var openGruopbuy = function(){
            _indexModule.main.createTab({
                title:'新建活动团购营销',
                url:'js/workflow/activity/groupbuy/groupbuy',
                // 参数解释:
                // editFlag 0：编辑活动 1：新建活动
                // newFlag 0：不可选活动类型 1：可选类型
                // activityTit 活动名称
                // stepOneDete 第一步骤数据
                // stepTwo 0：直接显示第二步 1：显示第一步
                param:{editFlag:'1',activityTit:'新建营销活动',activityType:'01',newFlag:'1',backTit:'活动管理'}
            });
        };
        //tab切换
        var changeTab = function(){
            $(this,$el).closest("ul").find('li').removeClass('active');
            $(this).closest("li").addClass('active');
            getActivityList();

        };
        //获取活动列表
        var getActivityList = function(){
            var type = '';
            $('.nav-tab',$el).each(function(){
                if($(this).hasClass(ACTIVE)){
                    type =  $(this).data('flag');
                }
            });
            var G_params = {
                url : 'front/sh/groupbuy!index?uid=001&cmpgnStsCd=' + type,
                items_per_page : 10 ,                       // 每页数     @param : limit
                page_index : 0 ,                            //当前页  @param : start
                pagination : $('.pagination',$el),         //分页id
                searchformId : $('.J_formSearch',$el),      //搜索表单的id
                pageCallback:function(){
                   /* var $actBox = $('input[name="activity"]');
                    $actBox.click(function(){
                        $('input[name="selectAll"]',$el).prop('checked',$actBox.length == $('input[name="activity"]:checked').length ? true : false);
                    });*/

                },
                tabletpl :Util.hdb.compile(activityListTpl), //表格模板
                tablewrap : $('.listContent',$el)//表格容器
            };
            var paramStr = $('.J_formSearch',$el).serialize(); //把form序列化
            Util.ajax.pagination(G_params.page_index , true , G_params, paramStr);
        };
        //获取时间
        var dateTime = function(){
            new Date( {
                el:$('.datetime',$el),
                label: '活动开始时间：',
                mid: '活动结束时间：',
                double:{    //支持一个字段里显示两个日期选择框
                    start:{
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        value:laydate.now(-14).substring(0,10) + " 00:00:00",
                        name:'bgnValidTime',   //开始日期文本框name
                        //min: laydate.now(),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istime: true,
                        istoday: false,
                        choose: function(datas){
                            this.end.min = datas;     //设置结束日期的最小限制
                            this.end.start = datas;     //设置结束日期的开始值
                        }
                    },
                    end:{
                        value:laydate.now(0).substring(0,10) + " 23:59:59",
                        name:'endValidTime',     //结束日期文本框name
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        //min: laydate.now(),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istime: true,
                        istoday: false,
                        choose: function(datas){
                            this.start.max = datas;     //设置开始日期的最大日期
                        }
                    }
                }
            });

        };
        var operationActivity = function(el){
            var $this = el
                ,operation = $this.data('operation')
                ,state = $this.parents('tr').data('state')
                ,type = $this.parents('tr').data('type')
                ,actId = $this.parents('tr').data('id')
                ,cType = $this.parents('tr').data('ctype');
            if(state == '01'){
                state = '02'
            }else{
                state = '01'
            }
            var param = {
                'cmpgnId':actId,
                'strtupStsCd': state
            };
            if(operation == 'begin-act' || operation == 'stop-act'){ //开始停止活动
                Util.ajax.postJson("front/sh/common!execute?uid=c001", param, function(json,status){
                    if(status){
                        if(state == '02'){
                            Util.dialog.tips("活动已停止");
                            $this.text('开始');
                            $this.parents('tr').data('state','02');
                            $this.parents('tr').find('.begin-or-stop .t-tag').show();
                            $this.parents('tr').find('.begin-or-stop .t-tag-todo').hide();
                            $(this).data('operation','begin-act');
                        }else{
                            Util.dialog.tips("活动已开始");
                            $this.text('停止');
                            $this.parents('tr').data('state','01');
                            $this.parents('tr').find('.begin-or-stop .t-tag').hide();
                            $this.parents('tr').find('.begin-or-stop .t-tag-todo').show();
                            $(this).data('operation','stop-act');
                        }
                    }else{
                        Util.dialog.tips(json.returnMessage);
                    }
                });
            }else if(operation == 'look-act'){ //查看活动详情
                var height = 400
                    ,width = 850;
                switch(type)
                {
                    case '01':
                        _indexModule.showDialog({
                            id : 'lookAct',
                            title:'营销团购活动详情',   //弹出窗标题
                            url:'js/workflow/activity/groupbuy/groupbuyDetails',
                            width:width,  //对话框宽度
                            height:height,  //
                            param:{actId:actId}
                        });
                        break;
                    case '02':
                        _indexModule.showDialog({
                            id : 'lookAct',
                            title:'营销秒杀活动详情',   //弹出窗标题
                            url:'js/workflow/activity/seckill/seckillDetails',
                            width:width,  //对话框宽度
                            height:height,  //
                            param:{actId:actId}
                        });
                        break;
                    case '03':
                        _indexModule.showDialog({
                            id : 'lookAct',
                            title : '营销抽奖活动详情',
                            url : 'js/workflow/activity/luckdraw/luckdrawDetail',
                            width:width,
                            height :height,
                            param :{actId:actId}
                        });
                        break;
                    case '04':
                        _indexModule.showDialog({
                            id : 'lookAct',
                            title:'营销签到活动详情',   //弹出窗标题
                            url:'js/workflow/activity/signIn/signInDetails',
                            width:width,  //对话框宽度
                            height:height,  //
                            param:{actId:actId}
                        });
                        break;
                    case '05':
                        _indexModule.showDialog({
                            id : 'lookAct',
                            title : '营销宣传活动详情',
                            url : 'js/workflow/activity/propagate/propagateDetails',
                            width:width,
                            height :height,
                            param :{actId:actId}
                        });
                        break;
                    case '06':
                        _indexModule.showDialog({
                            id : 'lookAct',
                            title : '营销互动活动详情',
                            url : 'js/workflow/activity/games/gamesDetail',
                            width:width,
                            height :height,
                            param :{actId:actId}
                        });
                        break;

                }
            }else if(operation == 'edit-act'){    //编辑活动
                switch (type)
                {
                    case '01':
                        _indexModule.main.createTab({
                            title:'编辑团购营销活动',
                            url:'js/workflow/activity/groupbuy/groupbuy',
                            param: {editFlag:'0',activityTit:'编辑团购营销活动',activityType:type,actId:actId,backTit:'活动管理'}
                        });
                        break;
                    case '02':
                        _indexModule.main.createTab({
                            title:'编辑秒杀营销活动',
                            url:'js/workflow/activity/seckill/seckill',
                            param: {editFlag:'0',activityTit:'编辑秒杀营销活动',activityType:type,actId:actId,backTit:'活动管理'}
                        });
                        break;
                    case '03':
                        _indexModule.main.createTab({
                            title: '编辑抽奖营销活动',
                            url: 'js/workflow/activity/luckdraw/luckdraw',
                            param: { editFlag:'0',activityTit:'编辑抽奖营销活动',activityType:type,actId:actId,backTit:'活动管理',cType:cType}
                        });
                        break;
                    case '04':
                        _indexModule.main.createTab({
                            title:'编辑签到营销活动',
                            url:'js/workflow/activity/signIn/signIn',
                            param: {editFlag:'0',activityTit:'编辑签到营销活动',activityType:type,actId:actId,backTit:'活动管理'}
                        });
                        break;
                    case '05':
                        _indexModule.main.createTab({
                            title: '编辑宣传营销活动',
                            url: 'js/workflow/activity/propagate/propagate',
                            param: { editFlag:'0',activityTit:'编辑宣传营销活动',activityType:type,actId:actId,backTit:'活动管理'}
                        });
                        break;
                    case '06':
                        _indexModule.main.createTab({
                            title: '编辑互动游戏营销活动',
                            url: 'js/workflow/activity/games/games',
                            param: { editFlag:'0',activityTit:'编辑互动游戏营销活动',activityType:type,actId:actId,backTit:'活动管理',cType:cType}
                        });
                        break;
                }
            }else if(operation == 'share-act'){  //弹出分享商品活动二维码
                var qcUrl = '/mamp/front/sh/common!getQrCodeNoDes?uid=c001' //二维码接口地址
                    ,cmpgnId = $this.parents('tr').data('id') //活动编号
                    ,src = $this.parents('tr').data('path')
                    ,temp = $this[0]
                    // , urlParams = '{"se":"0"}' '&urlParams=' + urlParams +
                    ,codesrc = qcUrl + '&content=' + src +  "&urlHasParam=0"; //把活动地址渲染到页面上
                var QCodeimg ="<div class='img-dialog'>"
                	+"<div style='overflow:hidden'>"
                	+"<input class='z_link_input' type='text' value='"+src+"'/>"                 
                	+"<input type='button' class='marketing_inputbtn marketingcopy clipBtn' value='复制'  data-url='"+src+"'/>"
                	+"</div>"
                	+"<img style='width:200px;height: 200px;' src=' " + codesrc + "'> </div>";//活动拼接到弹框的html内容                        
                dialog.get("showDialog")&&dialog.get("showDialog").close().remove();//展示二维码
                dialog({
                    id : "showDialog",
                    align : "left",
                    content :QCodeimg
                }).show(temp);
                clipInit();
         }else if(operation == 'issue-act'){     //发布该宣传活动
                var issueUrl;
                var params ={
                    "cmpgnId":actId,
                    "cmpgnStsCd":"03"
                };
                if( type == '01'){
                    issueUrl ='front/sh/groupbuy!index?uid=002';
                }else if(type == '02'){
                    issueUrl ='front/sh/seckill!execute?uid=009';
                }else if(type == '03'){
                    params ={
                        "cmpgnId":actId,
                        "drawStsCd":"03"
                    };
                    issueUrl = 'front/sh/luckdraw!execute?uid=lu004';
                }else if(type == '04'){
                    params ={
                        "cmpgnId":actId,
                        "signStsCd":"03"
                    };
                    issueUrl = 'front/sh/sign!execute?uid=si007';
                }else if(type == '05'){
                    issueUrl = 'front/sh/campaign!execute?uid=007';
                }else if(type == '06'){
                    params ={
                        "cmpgnId":actId,
                        "drawStsCd":"03"
                    };
                    issueUrl = 'front/sh/game!execute?uid=m005';
                }
                Util.ajax.postJsonAsync(issueUrl,params, function(json,status){
                    if(status){
                       if(json.returnCode = '0'){
                           var $btn = $this.parents('tr').find('.act-td').children('a');
                           $this.parents('tr').find('.tag-status span.t-tag-edit').html('未开展');
                           $this.parents('tr').find('.begin-or-stop .t-tag-todo').show();
                           $btn.eq(0).html('停止').data('operation','begin-act');
                           $btn.eq(2).html('分享').data('operation','share-act');
                           $btn.eq(1).html('查看').data('operation','look-act');
                           $btn.eq(3).hide();
                           $btn.eq(4).hide();
                           Util.dialog.tips('发布活动成功');

                       }else{
                           Util.dialog.tips(json.returnMessage);
                       }
                    }else{
                        Util.dialog.tips(json.returnMessage);
                    }
                });
            }else if(operation == 'del-act'){
                _indexModule.showDialog({
                    title:"删除活动",
                    content:'确认删除编号“' + actId + '”活动？',
                    width:320,
                    height:30,
                    okVal:"确定",  //确认按钮文本
                    okCallback:function(){
                        param = {
                            'cmpgnId':actId,
                            'strtupStsCd': "03"
                        };
                        Util.ajax.postJson("front/sh/groupbuy!index?uid=002", param, function(json,status){
                            if(status){
                                $this.parents('tr').remove();
                            }else{
                                Util.dialog.tips(json.returnMessage);
                            }
                        });
                    },
                    cancelVal:"取消",  //取消按钮文本
                    cancelCallback:function () {
                    }                 //点击取消按钮执行的函数
                });
            }else if( operation == 'preview-act' ){
                    qcUrl = '/mamp/front/sh/common!getQrCodeNoDes?uid=c001'; //二维码接口地址
                    src = $this.parents('tr').data('path');
                    temp = $this[0];
                 var urlParams = '{"se":"0"}';
                     codesrc = qcUrl + '&content='+ src + '&urlParams=' + urlParams  +  "&urlHasParam=1"; //把活动地址渲染到页面上
                     var QCodeimg ="<div class='img-dialog'>"
                     	+"<div style='overflow:hidden'>"
                     	+"<input class='z_link_input' type='text' value='"+src
                     	+"&se=0'/>"                      	
                     	+"<input type='button' class='marketing_inputbtn marketingcopy clipBtn' value='复制'  data-url='"+src+"&se=0'/>"
                     	+"</div>"                    	
                     	+"<img style='width:200px;height: 200px;' src=' " + codesrc + "'> </div>";//活动拼接到弹框的html内容                        
                dialog.get("showDialog")&&dialog.get("showDialog").close().remove();//展示二维码
                dialog({
                    id : "showDialog",
                    align : "left",
                    content :QCodeimg
                }).show(temp);
               clipInit();
            }
        };
        //点击二维码div其它地方关闭该div的弹框
        $("body").on("click",function(event){
            var $target = $(event.target || event.currentTarget);
            //如果点击的区域是二维码图像区域，则返回不关闭弹框
            if($target.closest('.img-dialog').length){
                return false;
            }
            dialog.get("showDialog")&&dialog.get("showDialog").close().remove();
        });
        //复制到剪贴板
        //复制文本到windows剪切板
        var clipInit = function () {
            ZeroClipboard.config({
                swfPath: "src/assets/lib/ueditor/third-party/zeroclipboard/ZeroClipboard.swf",
                forceHandCursor: true ,
                title: "点击复制"
            });
            var client = new ZeroClipboard( $('.clipBtn') );
            client.on('ready', function(event) {
              client.on('copy', function(event) {
                event.clipboardData.setData('text/plain', $(".clipBtn").attr("data-url"));
                dialog.get("showDialog")&&dialog.get("showDialog").close().remove();
                Util.dialog.tips("复制成功！");
              });
              client.on( 'aftercopy', function(event) {
              } );
            });
            client.on( 'error', function(event) {
                if(event.message == 'Flash is disabled or not installed'){
                    Util.dialog.tips("复制按钮不可用,请安装或更新Flash插件");
                }
                /*console.log( 'ZeroClipboard error of type "' + event.name + '": ' + event.message );*/
                ZeroClipboard.destroy();
            });
        }
        //TODO 删除活动后期再加 @YSG
        //TODO 导出活动
        return initialize;
    });