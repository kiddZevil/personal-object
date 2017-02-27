/**
 * Created by yuanyan on 2016/11/9.
 */
define(['Util'
    ,'laydate'
    ,"js/workflow/activity/selTool"
    ,'js/workflow/activity/template'
    ,'text!module/workflow/activity/activity.tpl'
    ,'text!module/workflow/activity/stepOne.tpl'
    ,'text!module/workflow/activity/stepThree.tpl'
    ,'text!module/workflow/activity/propagate/propagateTwo.tpl'
],
    function (Util,layDate,selTool,tmp,activityTpl,stepOneTpl,stepThreeTpl,propagateTwoTpl) {
        //系统变量，定义该模块的根节点
        var $el,
            STEP_CURRENT = 'step-current',
            STEP_DONE ='step-done',
            _indexModule = null,
            _param,
            nextIndex; //是否点击下一步
        initialize = function (indexModule,param) {
            $el = $(activityTpl);
            nextIndex = 0;
            _indexModule = indexModule;
            _param = param;
            //清空页面表单内容
            $('#G-activityEdit',$el).html('');
            //重构表单页面DOM节点
            $('#G-activityEdit',$el).html($(stepOneTpl)).append($(propagateTwoTpl)).append($(stepThreeTpl));
            selTool({
                pEl: $('#G-selActPatBox',$el), // 一级插入
                cEl: $('#G-selActChnBox',$el), // 二级插入
                pType: _param.param.activityType,
                disFlag: _param.param.newFlag
            });
            //初始化新建活动页面
            stepInt();
            if(_param.param.editFlag == '0'){    //进入编辑活动页面
                //给页面title添加标题
                $('#G-activityTit',$el).html(_param.param.activityTit);
                $('#G-back-parent',$el).html(_param.param.backTit);
                loadEditActData();   //加载宣传活动编辑信息
            }else{
                //给页面title添加标题
                $('#G-activityTit',$el).html(_param.param.activityTit);
                $('#G-back-parent',$el).html(_param.param.backTit);
                //活动类型
                $('input[name="cmpgnTypeCd"]',$el).val(_param.param.activityType);
                // 从cookies中读取创建人信息
                $('input[name="founder"]',$el).val($('#userInfo_hid').val());
                // console.log(Util.cookie.get('JSESSIONID'));
                // //模板列表初始化
                tmp({
                    el:$("#tempList90",$el),
                    type:_param.param.activityType
                });
            }
            //点击下一步按钮，打开步骤二
            $el.on('click','#G-stepOneNext',goStepTwo);
            //返回上一步
            $el.on('click','#G-prevStepOne',prevStepOne);
            //绑定输入框活动开始时间
            $el.on('click','input[name="bgnValidTime"]',actBegTime);
            //绑定输入框活动结束时间
            $el.on('click','input[name="endValidTime"]',actEndTime);
            //保存宣传营销活动
            $el.on('click','#G-act-save',savePropa);
            //发布宣传营销活动
            $el.on('click','#G-act-issue',issueAct);
            //步骤三返回列表页
            $el.on('click','#G-openActList',openActList);
            $('input[name="cmpgnNm"]',$el).keyup(function(){
                var len = $(this).val().length;
                if(len > 32){
                    $(this).val($(this).val().substring(0,32))
                }
            });
            wordCount($('textarea[name="cmpgnDesc"]',$el),250); //活动描述
            wordCount($('textarea[name="cmpgnRuleCntt"]',$el),2000); //活动规则
            this.content = $el;
            //加载活动编辑信息
            function loadEditActData() {
            var param = {
                "cmpgnId":_param.param.actId
            };
                Util.ajax.postJson("front/sh/campaign!execute?uid=004",param,function (json,status) {
                    if(status){
                        var bean = json.bean;
                        //步骤一的数据
                        $('input[name="cmpgnId"]',$el).val(bean.cmpgnId);                   //活动ID
                        $('input[name="founder"]',$el).val(bean.userNm);
                        $('input[name="cmpgnTypeCd"]',$el).val(bean.cmpgnTypeCd);           //活动类型
                        $('input[name="cmpgnNm"]',$el).val(bean.cmpgnNm);                   //活动名称
                        $('textarea[name="cmpgnDesc"]',$el).val(bean.cmpgnDesc);            //活动描述
                        $('input[name="bgnValidTime"]',$el).val(bean.bgnValidTime);         //开始时间
                        $('input[name="endValidTime"]',$el).val(bean.endValidTime);         //结束时间

                             //创建人
                        //步骤二的数据
                        $('input[name="cmpgnStsCd"]',$el).val(bean.cmpgnStsCd);             //活动状态
                        $('textarea[name="cmpgnRuleCntt"]',$el).val(bean.cmpgnRuleCntt);    //活动规则
                        var tempArray = $('input[name="templateId"]');    //选中的模板加上对应的样式
                        //获取模板列表
                        tmp({
                            el:$("#tempList90",$el),
                            type:_param.param.activityType,
                            id:bean.tmpltId,
                            ftp: bean.ftpUrl,
                            img: bean.actvBannerPicAddr
                        });
                    }else{
                        Util.dialog.tips(json.returnMessage);
                    }
                });
            }
            function wordCount (el,sum){
                el.on('input propertychange',function(){
                    var len = $(this).val().length;
                    if(len > sum){
                        el.next().html('<i class="red-big">'+ len +'</i>/'+ sum)
                    }else{
                        el.next().text(len +'/'+ sum)
                    }
                });
            }
          //   进入下一步之前的验证操作
             function goStepTwo(){
                 // 验证表单信息必填
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
                                     title: '新建营销活动',
                                     url: url,
                                     // 参数释义:
                                     // editFlag 0：编辑活动 1：新建活动
                                     // newFlag 0：不可选活动类型 1：可选类型
                                     // activityType 活动类型
                                     // activityTit 活动名称
                                     // stepOneDete 第一步骤数据
                                     // stepTwo 0：直接显示第二步 1：显示第一步
                                     param: {
                                         editFlag:'1',
                                         newFlag:'1',
                                         backTit:'活动管理',
                                         activityTit:'新建营销活动',
                                         activityType:selType,
                                         stepOneData:encodeURIComponent(JSON.stringify(stepOneData)),
                                         stepTwo:'0',
                                         cType: $('.sel-ctool').val()
                                     }
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
                             title: '新建宣传营销活动',
                             url: url,
                             // 参数释义:
                             // editFlag 0：编辑活动 1：新建活动
                             // newFlag 0：不可选活动类型 1：可选类型
                             // activityType 活动类型
                             // activityTit 活动名称
                             // stepOneDete 第一步骤数据
                             // stepTwo 0：直接显示第二步 1：显示第一步
                             param: {
                                 editFlag:'1',
                                 newFlag:'1',
                                 backTit:'活动管理',
                                 activityTit:'新建营销活动',
                                 activityType:selType,
                                 stepOneData:encodeURIComponent(JSON.stringify(stepOneData)),
                                 stepTwo:'0',
                                 cType: $('.sel-ctool').val()
                             }
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

            }
            function prevStepOne() {
                $('#G-stepFirst',$el).removeClass(STEP_DONE).addClass(STEP_CURRENT);
                $('#G-stepSecond',$el).removeClass(STEP_CURRENT);
                $('#G-stepOne',$el).show();
                $('#G-stepTwo',$el).hide();
                $('#G-stepThree',$el).hide();
            }
            //进入第三步保存成功页面
            function goStepThree() {
                $('#G-stepFirst',$el).removeClass(STEP_CURRENT).addClass(STEP_DONE);
                $('#G-stepSecond',$el).removeClass(STEP_CURRENT).addClass(STEP_DONE);
                $('#G-stepThird',$el).addClass(STEP_CURRENT);
                $('#G-stepTwo',$el).hide();
                $('#G-stepOne',$el).hide();
                $('#G-stepThree',$el).show();
            }
            //时间比较
            function compareTime(beg,end){
                var flag = false;
                var begDate = new Date(beg);
                var endDate = new Date(end);
                if(begDate > endDate){
                    flag = true;
                }
                return flag;
            };
            //营销活动列表打开
            function openActList() {
                _indexModule.main.createTab({
                    title:"返回活动列表",
                    url:"js/workflow/homepage/homepage"
                });
            }
            //初始化新建活动
            function stepInt() {
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
            }
            //保存宣传营销活动
            function savePropa() {
                var type = $(this).data('type')
                    ,url;
                if(_param.param.editFlag == '0'){
                    url = "front/sh/campaign!execute?uid=005"; // 更新
                }else{
                    url = "front/sh/campaign!execute?uid=003"; //新增
                }
                //验证活动规则
                if($('textarea[name="cmpgnRuleCntt"]',$el).val() == '' || $('textarea[name="cmpgnDesc"]',$el).val().length > 2000){
                    Util.dialog.tips('请输入正确的活动规则');
                    return;
                }
                $('input[name = "cmpgnStsCd"]',$el).val('01');
                Util.ajax.postJsonAsync(url,$('#G-activityEdit',$el).serialize(),
                function (json,status) {
                    if(status){
                        $('input[name="cmpgnId"]',$el).val(json.bean.cmpgnId);
                        var qcUrl = '/mamp/front/sh/common!getQrCodeNoDes?uid=c001'  //二维码接口地址
                            ,el = $('.codeImgDiv',$el);             //二维码插入DOM节点
                        var content = json.bean.tmpltPath;   //获得返回的活动url地址
                        var urlParams = '{"se":"0"}';
                        el.attr('src',qcUrl + '&content=' + content + '&urlParams=' + urlParams + "&urlHasParam=1");  //把活动地址渲染到页面上
                        goStepThree(); //进入第三步保存成功页面
                        Util.dialog.tips('活动保存成功');
                    }else{
                        Util.dialog.tips(json.returnMessage || "系统错误，请稍后再试！");
                    }
                });
            }
            //发布活动
            function issueAct(){
                var url = 'front/sh/campaign!execute?uid=007';            //发布接口
                var param = {
                    "cmpgnId":$('input[name="cmpgnId"]',$el).val(), //活动ID
                    "cmpgnStsCd":"03"                               //活动状态
                };
                Util.ajax.postJsonAsync(url,param, function(json,status){
                    if(status){
                        Util.dialog.tips('活动发布成功');
                        openActList();
                    }else{
                        Util.dialog.tips(json.returnMessage);
                    }
                });
            }
        };
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

        //判断字符长度
        function strlen(str){
            var len = 0;
            for (var i=0; i<str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                    len++;
                }
                else {
                    len+=2;
                }
            }
            return len;
        }
        return initialize;
    });