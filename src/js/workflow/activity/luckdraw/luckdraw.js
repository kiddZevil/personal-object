define(['Util'
    ,"laydate"
    ,"js/workflow/activity/selTool"
    ,"js/workflow/activity/luckdraw/luckdrawTab"
    ,"js/workflow/activity/template"
    ,'text!module/workflow/activity/activity.tpl'
    ,'text!module/workflow/activity/stepOne.tpl'
    ,'text!module/workflow/activity/luckdraw/luckdrawStepTwo.tpl'
    ,'text!module/workflow/activity/stepThree.tpl'
    ],
    function (Util,layDate,selTool,luckdrawTab,tmpTpl,activityTpl,stepOneTpl,luckStepTwoTpl,stepThreeTpl) {
        //系统变量-定义该模块的根节点
        var $el
            ,STEP_CURRENT = 'step-current'
            ,STEP_DONE = 'step-done'
            ,_indexModule = null
            ,_param
            ,selRes = []
            ,nextIndex //是否点击下一步
            ,disChildren; //是否显示子类型
		initialize = function(indexModule, param){
            $el = $(activityTpl);
            disChildren = false;
            nextIndex = 0;
            _indexModule = indexModule;
            _param = param;
            //清空页面DOM节点
            $('#G-activityEdit',$el).html('');
            //重构页面DOM节点
            $('#G-activityEdit',$el).html($(stepOneTpl)).append($(luckStepTwoTpl)).append($(stepThreeTpl));
            //打开步骤二
            $el.on('click','#G-stepOneNext',goStepTwo);
            //返回上一步
            $el.on('click','#G-prevStepOne',prevStepOne);
            stepInt();
            onceMore();
            if(_param.param.editFlag == '0'){
                if(!_param.param.cType){
                    disChildren = true
                }
                selTool({
                    pEl: $('#G-selActPatBox',$el), // 一级插入
                    cEl: $('#G-selActChnBox',$el), // 二级插入
                    pType: _param.param.activityType,
                    disFlag: _param.param.newFlag,
                    disChildren: disChildren, //是否显示活动子类型
                    cType: _param.param.cType
                });
                //给页面title添加标题
                $('#G-activityTit',$el).html(_param.param.activityTit);
                $('input[name="cmpgnTypeCd"]',$el).val(_param.param.activityType);
                $('#G-back-parent',$el).html(_param.param.backTit);
                loadEditActData();
            }else{
                if(!_param.param.cType){
                    disChildren = true
                }
                selTool({
                    pEl: $('#G-selActPatBox',$el), // 一级插入
                    cEl: $('#G-selActChnBox',$el), // 二级插入
                    pType: _param.param.activityType,
                    disFlag: _param.param.newFlag,
                    disChildren: disChildren, //是否显示活动子类型
                    cType: _param.param.cType
                });
                //给页面title添加标题
                $('#G-activityTit',$el).html(_param.param.activityTit);
                $('#G-back-parent',$el).html(_param.param.backTit);
                //活动类型
                $('input[name="cmpgnTypeCd"]',$el).val(_param.param.activityType);
                //增加创建人信息
                $('input[name="founder"]',$el).val($('#userInfo_hid').val());
            }
            //活动开始时间
            $el.on('click','input[name="bgnValidTime"]',actBegTime);
            //活动结束时间
            $el.on('click','input[name="endValidTime"]',actEndTime);
            //是否限购
            $el.on('change','input[name="rwdPrzdrwChancFlag"]',onceMore);
            //抽奖次数
            $el.on('change','input[name="przdrwTmsCntTypeCd"]',luckTime);
            //保存
            $el.on('click','#G-act-save',saveGroup);
            //发布
            $el.on('click','#G-act-issue',issueAct);
            //步骤三返回列表
            $el.on('click','#G-openActList',openActList);
            //活动名称
            $('input[name="cmpgnNm"]',$el).keyup(function(){
                var len = $(this).val().length;
                if(len > 32){
                    $(this).val($(this).val().substring(0,32))
                }
            });
            wordCount($('textarea[name="cmpgnDesc"]',$el),250); //活动描述
            wordCount($('textarea[name="cmpgnRuleCntt"]',$el),2000); //活动规则
            //抽奖次数限制
            $('input[name="przdrwTmsCnt"]',$el).keyup(function(){
                var len = $(this).val().length;
                if(len > 5){
                    $(this).val($(this).val().substring(0,5))
                }
            });
            this.content = $el;
        };
        var wordCount = function(el,sum){
            el.on('input propertychange',function(){
                var len = $(this).val().length;
                if(len > sum){
                    el.next().html('<i class="red-big">'+ len +'</i>/'+ sum)
                }else{
                    el.next().text(len +'/'+ sum)
                }
            });
        };
        var stepInt = function(){
            if(_param.param.newFlag == '1' && !!_param.param.stepOneData){    // 如果当前创建为可选活动类型并是否有第一步骤数据
                var oneData = JSON.parse(decodeURIComponent(_param.param.stepOneData));
                $('input[name="cmpgnNm"]',$el).val(oneData.cmpgnNm);                   //活动名称
                $('textarea[name="cmpgnDesc"]',$el).val(oneData.cmpgnDesc);            //活动描述
                $('input[name="bgnValidTime"]',$el).val(oneData.bgnValidTime);         //开始时间
                $('input[name="endValidTime"]',$el).val(oneData.endValidTime);         //结束时间
                goStepTwo();
            }else{
                if(_param.param.editFlag != '0'){
                    $('input[name="bgnValidTime"]',$el).val(laydate.now(0));
                    $('input[name="endValidTime"]',$el).val(laydate.now(2));
                }
                $('#G-stepFirst',$el).removeClass(STEP_DONE).addClass(STEP_CURRENT);
                $('#G-stepSecond',$el).removeClass(STEP_CURRENT);
                $('#G-stepOne',$el).show();
                $('#G-stepTwo',$el).hide();
                $('#G-stepThree',$el).hide();
            }
        };
        var goStepTwo = function(){
            if($('input[name="cmpgnNm"]',$el).val() == ''){
                Util.dialog.tips('活动名称不能为空');
                return;
            }
            if($('input[name="cmpgnNm"]',$el).val().indexOf(' ') >= '0' || $('input[name="cmpgnNm"]',$el).val().length < 5){
                Util.dialog.tips('请输入正确的活动名称');
                return;
            }
            if($('textarea[name="cmpgnDesc"]',$el).val() == '' || $('textarea[name="cmpgnDesc"]',$el).val().length > 250){
                Util.dialog.tips('请输入正确的活动简介');
                return;
            }
            if($('input[name="bgnValidTime"]',$el).val() == ''){
                Util.dialog.tips('活动开始时间不能为空');
                return;
            }
            if($('input[name="endValidTime"]',$el).val() == ''){
                Util.dialog.tips('活动结束时间不能为空');
                return;
            }
            if(compareTime($('input[name="bgnValidTime"]',$el).val(),$('input[name="endValidTime"]',$el).val())){
                Util.dialog.tips('活动结束时间必须大于开始时间');
                return;
            }
            //判断当前选择的活动类型是否是当前活动，如果不是提示将请清空第二部所填数据
            //newFalg 0:当前页面不可选择活动类型  1：当前页面可选活动类型
            var selType = $('.sel-ptool').val();
            if(_param.param.editFlag == '1'){   //新增活动的时候下一步在执行查找模版
                //获取模版列表
                if(!_param.param.cType){ //如果是从一级菜单打开
                    tmpTpl({
                        el:$("#tempList90",$el),
                        type:_param.param.activityType,
                        cType: $('.sel-ctool').val(),
                        change: true,
                        selFn: function(){
                            changeTmp();
                        }
                        ,loadFn: function(){
                            luckdrawTab({
                                el:$('#G-luckdraw',$el),
                                num: $('#tempList90',$el).find('.selected-img').data('prz')
                            });
                        }
                    });
                }else{ //选择子类创建
                    tmpTpl({
                        el:$("#tempList90",$el),
                        type:_param.param.activityType,
                        cType: $('.sel-ctool').val()
                        ,loadFn: function(){
                            luckdrawTab({
                                el:$('#G-luckdraw',$el),
                                num: $('#tempList90',$el).find('.selected-img').data('prz')
                            });
                        }
                    });

                }
            }
            if(selType != _param.param.activityType && _param.param.newFlag == '1'){
                if(nextIndex > 0){
                    Util.dialog.openDiv({
                        title:"修改活动类型",
                        content:'修改活动类型将清空步骤二所填数据，确认修改？',
                        modal:1,
                        width:320,
                        height:30,
                        okVal:"确定",  //确认按钮文本
                        okCallback:function(){ //确认打开所选活动类型页面并将当前步骤一数据传给所选活动，并执行打开第二步骤
                            var stepOneData = {
                                "cmpgnNm" : $('input[name="cmpgnNm"]',$el).val(),           //活动名称
                                "cmpgnDesc" : $('textarea[name="cmpgnDesc"]',$el).val(),    //活动描述
                                "bgnValidTime" : $('input[name="bgnValidTime"]',$el).val(),         //开始时间
                                "endValidTime" : $('input[name="endValidTime"]',$el).val()         //结束时间
                            };
                            var url = $('.sel-ptool').find('option:selected').data('skip'); //跳转的页面
                            _indexModule.main.createTab({
                                title: '新建秒杀营销活动',
                                url: url,
                                // 参数释义:
                                // editFlag 0：编辑活动 1：新建活动
                                // newFlag 0：不可选活动类型 1：可选类型
                                // activityType 活动类型
                                // activityTit 活动名称
                                // stepOneDete 第一步骤数据
                                // stepTwo 0：直接显示第二步 1：显示第一步
                                param: {editFlag:'1',newFlag:'1',backTit:'活动管理',activityTit:'新建营销活动',activityType:selType,stepOneData:encodeURIComponent(JSON.stringify(stepOneData)),stepTwo:'0'}
                            });
                        },
                        cancelVal: "取消",
                        cancelCallback: function () {
                        }
                    });
                }else{
                    var stepOneData = {
                        "cmpgnNm" : $('input[name="cmpgnNm"]',$el).val(),           //活动名称
                        "cmpgnDesc" : $('textarea[name="cmpgnDesc"]',$el).val(),    //活动描述
                        "bgnValidTime" : $('input[name="bgnValidTime"]',$el).val(),         //开始时间
                        "endValidTime" : $('input[name="endValidTime"]',$el).val()         //结束时间
                    };
                    var url = $('.sel-ptool').find('option:selected').data('skip'); //跳转的页面
                    _indexModule.main.createTab({
                        title: '新建营销活动',
                        url: url,
                        param: {editFlag:'1',newFlag:'1',backTit:'活动管理',activityTit:'新建营销活动',activityType:selType,stepOneData:encodeURIComponent(JSON.stringify(stepOneData)),stepTwo:'0'}
                    });
                }
            }else{
                nextIndex++;
                $('#G-stepFirst',$el).removeClass(STEP_CURRENT).addClass(STEP_DONE);
                $('#G-stepSecond',$el).addClass(STEP_CURRENT);
                $('#G-stepTwo',$el).show();
                $('#G-stepOne',$el).hide();
                $('#G-stepThree',$el).hide();
            }
        };
        var prevStepOne = function(){
            $('#G-stepFirst',$el).removeClass(STEP_DONE).addClass(STEP_CURRENT);
            $('#G-stepSecond',$el).removeClass(STEP_CURRENT);
            $('#G-stepOne',$el).show();
            $('#G-stepTwo',$el).hide();
            $('#G-stepThree',$el).hide();
        };
        var goStepThree = function(){
            $('#G-stepFirst',$el).removeClass(STEP_CURRENT).addClass(STEP_DONE);
            $('#G-stepSecond',$el).removeClass(STEP_CURRENT).addClass(STEP_DONE);
            $('#G-stepThird',$el).addClass(STEP_CURRENT);
            $('#G-stepTwo',$el).hide();
            $('#G-stepOne',$el).hide();
            $('#G-stepThree',$el).show();
        };
        //时间比较
        var compareTime =  function(beg,end){
            var flag = false;
            var begDate = new Date(beg);
            var endDate = new Date(end);
            if(begDate > endDate){
                flag = true;
            }
            return flag;
        };
        //活动时间
        var actBegTime = function(){
            laydate({
                start:laydate.now(),
                min:laydate.now(),
                max:$('input[name="endValidTime"]',$el).val(),
                istime: true,
                istoday: false,
                format:'YYYY-MM-DD hh:mm:ss'
            })
        };
        var actEndTime = function(){
            laydate({
                min:$('input[name="bgnValidTime"]',$el).val() != '' ? $('input[name="bgnValidTime"]',$el).val() : laydate.now(),
                istime: true,
                istoday: false,
                format:'YYYY-MM-DD hh:mm:ss'
            })
        };
        //是否开启再来一次
        var onceMore = function(){
            var selRaio = $('input[name="rwdPrzdrwChancFlag"]:checked');
            var navLen = $('.t-tabs-items li',$el).length - 1;
            var index = $('.t-tabs-items li.active',$el).index();
            if(selRaio.val() == '0'){
                $('.t-tabs-items li',$el).eq(navLen).show();
                $('.t-tabs-items li',$el).eq(navLen - 1).hide().removeClass('active');
                if(index == navLen - 1){
                    $('.t-tabs-items li',$el).eq(index + 1).addClass('active');
                    $('.t-tabs-wrap li',$el).eq(navLen).addClass('selected');
                    $('.t-tabs-wrap li',$el).eq(navLen - 1).removeClass('selected');
                }
            }else{
                $('.t-tabs-items li',$el).eq(navLen).hide().removeClass('active');
                $('.t-tabs-items li',$el).eq(navLen - 1).show();
                if(index == navLen){
                    $('.t-tabs-items li',$el).eq(index - 1).addClass('active');
                    $('.t-tabs-wrap li',$el).eq(navLen).removeClass('selected');
                    $('.t-tabs-wrap li',$el).eq(navLen - 1).addClass('selected');
                }
            }
        };
        //抽奖次数
        var luckTime = function(el){
            var $this = $(this);
            var selRaio = $('input[name="przdrwTmsCntTypeCd"]:checked');
            /*if(selRaio.val() == '01'){
                $('input[name="przdrwTmsCnt"]',$el).each(function(){
                    $(this).val('').prop('disabled',true)
                });
            }else */
            if(selRaio.val() == '02'){
                $this.closest('.c-radio').find('input[name="przdrwTmsCnt"]').prop('disabled',false);
                $this.closest('.c-radio').next().find('input[name="przdrwTmsCnt"]').val('').prop('disabled', true);
            }else{
                $this.closest('.c-radio').find('input[name="przdrwTmsCnt"]').prop('disabled',false);
                $this.closest('.c-radio').prev().find('input[name="przdrwTmsCnt"]').val('').prop('disabled',true);
            }

        };
        //保存团购营销
        var saveGroup = function(){
            var flag = false
                ,type = $(this).data('type')
                ,url;
            //验证规则配置
            var TypeCd = $('input[name="przdrwTmsCntTypeCd"]:checked',$el).val();
            if(TypeCd == '02'){
                if($('input[name="przdrwTmsCnt"]').eq(0).val() == ''){
                    flag = true;
                }
            }else if(TypeCd == '03'){
                if($('input[name="przdrwTmsCnt"]').eq(1).val() == ''){
                    flag = true;
                }
            }
            if(flag){
                Util.dialog.tips('抽奖次数不能为空');
                return;
            }

            //验证活动规则
            if($('textarea[name="cmpgnRuleCntt"]',$el).val() == '' || $('textarea[name="cmpgnDesc"]',$el).val().length > 2000){
                Util.dialog.tips('请输入正确的活动规则');
                return;
            }
            var selRaio = $('input[name="rwdPrzdrwChancFlag"]:checked');
            var itemLen = $('.t-tabs-wrap li',$el).length;
            //验证奖品是否填写完成
            $('.t-tabs-wrap li',$el).each(function(i){
                var $this = $(this);
                var prizeNm = $('.t-tabs-items li',$el).eq(i).find('input[name="lvlNm"]').val();
                if($('.t-tabs-items li',$el).eq(i).is(':visible')){
                    if($this.find('input[name="winprzRate"]',$el).val() =='' && !flag){
                        Util.dialog.tips(prizeNm + '中奖概率不能为空');
                        flag = true;
                        return false
                    }
                    if($('#G-act-save',$el).hasClass('dis')){
                        Util.dialog.tips('中奖概率之和不能大于100%');
                        flag = true;
                        return false
                    }
                    if(flag){
                        return
                    }
                    $this.find('.prize-img-img').each(function(){
                        if($(this).find('img').length == '0'){
                            Util.dialog.tips(prizeNm + '图片不能为空');
                            flag = true;
                            return false
                        }
                    });
                    if($this.find('input[name="prizeItemQty"]').val() == '' && !flag){
                        Util.dialog.tips(prizeNm + '奖品数量不能为空');
                        flag = true;
                        return false;
                    }
                    $this.find('input[name="prizePreprQty"]').each(function(){
                        var $this = $(this);
                        if($this.val() == ''){
                            Util.dialog.tips(prizeNm + '奖品数量不能为空');
                            flag = true;
                            return false
                        }else if($this.val() > $this.data('qty')){
                            Util.dialog.tips(prizeNm + '奖品数量不能大于资源数量');
                            flag = true;
                            return false
                        }
                    });
                    if($this.find('.luckPrize-group').text().replace(/(^\s+)|(\s+$)/g,"") == '' && !flag){
                        if(selRaio.val() == '0' && i == itemLen - 1){
                            flag = false;
                        }else{
                            flag = true;
                            Util.dialog.tips(prizeNm + '奖品不能为空');
                            return false;
                        }
                    }

                }

                /*if($this.find('.luckPrize-group').text().replace(/(^\s+)|(\s+$)/g,"") == '' && $('.t-tabs-items
                 li',$el).eq(i).is(':visible')){
                    if(selRaio.val() == '0' && i == itemLen - 1){
                        flag = false;
                    }else{
                        flag = true;
                        Util.dialog.tips(prizeNm + '奖品不能为空');
                        return false;
                    }
                }*/
            });
            if(flag){
                return
            }
            //保存或者发布的时候选中的是否为再来一次，如果是的话删除倒数第二个tab标签，否的话删除倒数第一个标签
            var navLen = $('.t-tabs-items li',$el).length - 1
                ,lineType = false
                ,object = []
                ,beans = []
                ,lvNm = null;
            if(selRaio.val() == '0'){
                $('.t-tabs-items li',$el).eq(navLen - 1).addClass('no');
                $('.t-tabs-wrap li',$el).eq(navLen - 1).addClass('no');
                $('.t-tabs-items li',$el).eq(navLen).removeClass('no');
                $('.t-tabs-wrap li',$el).eq(navLen).removeClass('no');
                lineType = true;
            }else{
                $('.t-tabs-items li',$el).eq(navLen - 1).removeClass('no');
                $('.t-tabs-wrap li',$el).eq(navLen - 1).removeClass('no');
                $('.t-tabs-items li',$el).eq(navLen).addClass('no');
                $('.t-tabs-wrap li',$el).eq(navLen).addClass('no');
            }
            $('.t-tabs-items li',$el).each(function(index){
                if(!$(this).hasClass('no')){
                    beans = [];
                    lvNm = null;
                    var tabWrap = $('.t-tabs-wrap li',$el).eq(index);
                    tabWrap.find('.luckPrize-group .prize-goods-box').each(function(){
                        beans.push({
                            "cmpgnRsId": $(this).find('input[name="cmpgnRsId"]').val(),         //"营销活动资ID",
                            "prizePreprQty": $(this).find('input[name="prizePreprQty"]').val(), //"奖品准备数量",
                            "prizePicUrlAddr": $(this).find('input[name="prizePicUrlAddr"]').val()  //"奖品图URL地址"
                        })
                    });
                    lvNm = $(this).find('input[name="lvlNm"]').val(); //登记名称
                    index = index + 1;
                    if(index < 10){
                        index = '0' + index;
                        if(lineType && index == $('.t-tabs-items li',$el).length){
                            object.push({
                                "bean":{
                                    "lvlCd":"00",                                                      //再来一次等级代码",
                                    "lvlNm": lvNm,
                                    "winprzRate":tabWrap.find('input[name="winprzRate"]').val(),      //"中奖率",
                                    "prizeItemQty": tabWrap.find('input[name="prizeItemQty"]').val(),   //等级奖品总量
                                    "przitmPicUrlAddr":tabWrap.find('input[name="przitmPicUrlAddr"]').val()   //"奖项图URL地址"
                                },
                                "beans": beans
                            })
                        }else{
                            object.push({
                                "bean":{
                                    "lvlCd":index,                                                      //再来一次等级代码",
                                    "lvlNm": lvNm,
                                    "winprzRate":tabWrap.find('input[name="winprzRate"]').val(),      //"中奖率",
                                    "prizeItemQty": tabWrap.find('input[name="prizeItemQty"]').val(),   //等级奖品总量
                                    "przitmPicUrlAddr":tabWrap.find('input[name="przitmPicUrlAddr"]').val()   //"奖项图URL地址"
                                },
                                "beans": beans
                            })
                        }
                    }
                }
            });
            var drawParam = {
                "params":{
                    "cmpgnId": $('input[name="cmpgnId"]',$el).val(),
                    "cmpgnNm": $('input[name="cmpgnNm"]',$el).val(),
                    "cmpgnDesc":$('textarea[name="cmpgnDesc"]',$el).val(),                          //"营销活动描述",
                    "crtUserId":"",//"创建用户ID",
                    "bgnValidTime": $('input[name="bgnValidTime"]',$el).val(),                      //"开始有效时间",
                    "endValidTime": $('input[name="endValidTime"]',$el).val(),                      //"终止有效时间",
                    "przdrwTmsCntTypeCd": $('input[name="przdrwTmsCntTypeCd"]:checked',$el).val(),  //"抽奖次数类型代码",
                    "przdrwTmsCnt": $('input[name="przdrwTmsCntTypeCd"]:checked',$el).parent().next().val(),                      //"抽奖次数",
                    "rwdPrzdrwChancFlag": $('input[name="rwdPrzdrwChancFlag"]:checked',$el).val(),  //"奖励抽奖机会标志",
                    "tmpltId": $('input[name="tmpltId"]',$el).val(),                                //"模板ID",
                    "cmpgnRuleCntt": $('textarea[name="cmpgnRuleCntt"]',$el).val()                  //"营销活动规则内容"
                }
                ,"object":object
            };
            if(_param.param.editFlag == '0'){
                url = "front/sh/luckdraw!execute?uid=lu002"; // 更新
            }else{
                url = "front/sh/luckdraw!execute?uid=lu001"; //新增
            }
            var param = {
                "drawStsCd":"01",
                "drawParam":JSON.stringify(drawParam),
                "tmpltPath":$('input[name="tmpltPath"]',$el).val(),
                "actvBannerPicAddr":$('input[name="actvBannerPicAddr"]',$el).val(),
                "cmpgnChildTypeCd": $('input[name="cmpgnChildTypeCd"]').val(),
            };
            Util.ajax.postJsonAsync(url, param, function(json,status){
                if(status){
                    if(json.bean.cmpgnId){
                        $('input[name="cmpgnId"]',$el).val(json.bean.cmpgnId);
                    }
                    var qcUrl = '/mamp/front/sh/common!getQrCodeNoDes?uid=c001'  //二维码接口地址
                        ,el = $('.codeImgDiv',$el);             //二维码插入DOM节点
                    var content = json.bean.cmpgnUrlAddr;   //获得返回的活动url地址
                    var urlParams = '{"se":"0"}';
                    el.attr('src',qcUrl + '&content=' + content + '&urlParams=' + urlParams + "&urlHasParam=1");  //把活动地址渲染到页面上
                    goStepThree();
                    Util.dialog.tips('活动保存成功');
                }else{
                    Util.dialog.tips(json.returnMessage);
                }
            });
        };
        var issueAct = function(){
            var url = 'front/sh/luckdraw!execute?uid=lu004';             //发布接口
            var param = {
                "cmpgnId":$('input[name="cmpgnId"]',$el).val(), //活动ID
                "drawStsCd":"03"                               //活动状态
            };
            Util.ajax.postJsonAsync(url,param, function(json,status){
                if(status){
                    Util.dialog.tips('活动发布成功');
                    openActList();
                }else{
                    Util.dialog.tips(json.returnMessage);
                }
            });
        };
        var openActList = function(){
            _indexModule.main.createTab({
                title:'返回到活动列表',
                url:'js/workflow/homepage/homepage'
            });
        };
        var changeTmp = function(){
            var chanceNum = $('.templateList').find('.selected-img').data('prz');
            $('input[name="rwdPrzdrwChancFlag"]',$el).eq(0).prop('checked',true);
            luckdrawTab({
                el:$('#G-luckdraw',$el),
                num: chanceNum
            });
        };
        //编辑抽奖活动
        var loadEditActData = function(){
            var param = {
                "cmpgnId":_param.param.actId
            };
            Util.ajax.postJson("front/sh/luckdraw!execute?uid=lu003", param, function(json,status){
                if(status){
                    var bean = json.bean
                        ,object = json.object;
                    //步骤一数据
                    $('input[name="cmpgnId"]',$el).val(bean.cmpgnId);                   //活动ID
                    $('input[name="cmpgnTypeCd"]',$el).val(bean.cmpgnTypeCd);           //活动类型
                    $('input[name="cmpgnNm"]',$el).val(bean.cmpgnNm);                   //活动名称
                    $('input[name="founder"]',$el).val(bean.userNm);                    //活动创建人
                    $('textarea[name="cmpgnDesc"]',$el).val(bean.cmpgnDesc);            //活动描述
                    $('input[name="bgnValidTime"]',$el).val(bean.bgnValidTime);         //开始时间
                    $('input[name="endValidTime"]',$el).val(bean.endValidTime);         //结束时间
                    //步骤二数据
                    $('input[name="cmpgnStsCd"]',$el).val(bean.cmpgnStsCd);             //活动状态
                    $('textarea[name="cmpgnRuleCntt"]',$el).val(bean.cmpgnRuleCntt);    //活动规则
                    $('input[name="tmpltId"]',$el).val(bean.tmpltId);                   //模版ID
                    //抽奖次数
                    $('input[name="przdrwTmsCntTypeCd"]',$el).each(function(){
                        if($(this).val() == bean.przdrwTmsCntTypeCd){
                            $(this).prop('checked',true);
                            $(this).closest('label').next().attr('disabled',false).val(bean.przdrwTmsCnt);
                        }
                    });
                    //抽奖机会
                    $('input[name="rwdPrzdrwChancFlag"]',$el).each(function(){
                        if($(this).val() == bean.rwdPrzdrwChancFlag){
                            $(this).prop('checked',true);
                        }
                    });
                    //获取模版列表
                    tmpTpl({
                        el:$("#tempList90",$el),
                        type:_param.param.activityType,
                        id:bean.tmpltId,
                        ftp: bean.ftpUrl,
                        img: bean.actvBannerPicAddr,
                        change: true,
                        cType: _param.param.cType, //根据子类型获取子模版
                        selFn: function(){
                            changeTmp();
                        },
                        loadFn: function(){
                            //秒杀抽奖模版渲染
                            luckdrawTab({
                                el:$('#G-luckdraw',$el),
                                num: $('#tempList90',$el).find('.selected-img').data('prz'),
                                onceMore: bean.rwdPrzdrwChancFlag,
                                object: object,
                                ftpUrl: bean.ftpUrl
                            });
                        }
                    });
                }else{
                    Util.dialog.tips(json.returnMessage);
                }
            });
        };
        return initialize;
    });