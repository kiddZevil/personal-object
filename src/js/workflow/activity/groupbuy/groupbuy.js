define(['Util'
    ,"laydate"
    ,"js/workflow/activity/template"
    ,"js/workflow/activity/selTool"
    ,'text!module/workflow/activity/activity.tpl'
    ,'text!module/workflow/activity/stepOne.tpl'
    ,'text!module/workflow/activity/stepThree.tpl'
    ,'text!module/workflow/activity/groupbuy/groupbuyStepTwo.tpl'
    ,'text!module/workflow/activity/groupbuy/groupActTable.tpl'
    ,'text!module/workflow/activity/resources/resGoodsListBox.tpl'
    ,'text!module/workflow/activity/resources/resGoodsListCon.tpl'],
    function (Util,layerDate,tmpTpl,selTool,activityTpl,stepOneTpl,stepThreeTpl,groupbuyStepTwoTpl,actTableTpl,resGoodsListBoxTpl,resGoodsListConTpl) {
        //系统变量-定义该模块的根节点
        var $el
            /*,flag = false
            ,BTN_DIS = 'btn-disabled'*/
            ,STEP_CURRENT = 'step-current'
            ,STEP_DONE = 'step-done'
            ,_indexModule = null
            ,_param
            ,selRes = []
            ,nextIndex; //是否点击下一步
		initialize = function(indexModule, param){
            $el = $(activityTpl);
            nextIndex = 0;
            _indexModule = indexModule;
            _param = param;
            //清空页面DOM节点
            $('#G-activityEdit',$el).html('');
            //重构页面DOM节点
            $('#G-activityEdit',$el).html($(stepOneTpl)).append($(groupbuyStepTwoTpl)).append($(stepThreeTpl));
            //显示类型二级联动下拉
            selTool({
                pEl: $('#G-selActPatBox',$el), // 一级插入
                cEl: $('#G-selActChnBox',$el), // 二级插入
                pType: _param.param.activityType,
                disFlag: _param.param.newFlag
            });
            stepInt();
            if(_param.param.editFlag == '0'){
                //给页面title添加标题
                $('#G-activityTit',$el).html(_param.param.activityTit);
                $('#G-back-parent',$el).html(_param.param.backTit);
                loadEditActData();
            }else{
                //给页面title添加标题
                $('#G-activityTit',$el).html(_param.param.activityTit);
                $('#G-back-parent',$el).html(_param.param.backTit);
                //活动类型
                $('input[name="cmpgnTypeCd"]',$el).val(_param.param.activityType);
                //增加创建人信息
                $('input[name="founder"]',$el).val($('#userInfo_hid').val());
                tmpTpl({
                    el:$("#tempList90",$el),
                    type:$('input[name="cmpgnTypeCd"]',$el).val()
                });
            }
            //打开步骤二
            $el.on('click','#G-stepOneNext',goStepTwo);
            //返回上一步
            $el.on('click','#G-prevStepOne',prevStepOne);
            //活动开始时间
            $el.on('click','input[name="bgnValidTime"]',actBegTime);
            //活动结束时间
            $el.on('click','input[name="endValidTime"]',actEndTime);
            //商品活动开始时间选择
            $el.on('click','input[name="bgnTime"]',resBegTime);
            //商品活动结束时间结束
            $el.on('click','input[name="finishTime"]',resEndTime);
            //添加规则
            $el.on('click','#G-addGroupRule',addGroupRule);
            //删除资源
            $el.on('click','.oper-delRes',operationRes);
            //保存
            $el.on('click','#G-act-save',saveGroup);
            //发布
            $el.on('click','#G-act-issue',issueAct);
            //步骤三返回列表
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
            /*$('#G-selAct',$el).val(_param.param.activityType);
             if(_param.param.newFlag != '1'){
             $('#G-selAct',$el).attr('disabled','disabled');
             }*/

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
            var selType = $('.sel-ptool',$el).val();
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
                                // cType : 子类型
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
                    var url = $('.sel-ptool',$el).find('option:selected').data('skip'); //跳转的页面
                    _indexModule.main.createTab({
                        title: '新建营销活动',
                        url: url,
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
                nextIndex ++;
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
        //字符长度计算
        var getStrLen = function(str){
            var realLen = 0;
            for (var i = 0; i < str.length; i++)
            {
                var charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128)
                    realLen += 1;
                else
                    realLen += 2;
            }
            return realLen;
        };
        //活动时间
        var actBegTime = function(){
            laydate({
                min:laydate.now(),
                max:$('input[name="endValidTime"]',$el).val(),
                istime: true,
                istoday: false,
                format:'YYYY-MM-DD hh:mm:ss'
            });
        };
        var actEndTime = function(){
            laydate({
                min: $('input[name="bgnValidTime"]',$el).val() != '' ? $('input[name="bgnValidTime"]',$el).val() : laydate.now(),
                istime: true,
                istoday: false,
                format:'YYYY-MM-DD hh:mm:ss'
            })
        };
        //商品活动时间
        var resBegTime = function(){
            laydate({
                start:$('input[name="bgnValidTime"]',$el).val(),
                min:$('input[name="bgnValidTime"]',$el).val(),
                max:$('input[name="endValidTime"]',$el).val(),
                istime: true,
                format:'YYYY-MM-DD hh:mm:ss'
            })
        };
        var resEndTime = function(){
            laydate({
                start:$(this).parent().prev().find('input[name="bgnTime"]').val(),
                min:$(this).parent().prev().find('input[name="bgnTime"]').val(),
                max:$('input[name="endValidTime"]',$el).val(),
                istime: true,
                format:'YYYY-MM-DD hh:mm:ss'
            })
        };
        //选择团购资源
        var addGroupRule = function(){
            var $resGoodsListBox = $(resGoodsListBoxTpl)
                ,$resGoodsListConTpl = resGoodsListConTpl;
            $('#G-resGoodsList',$resGoodsListBox).html('');
            //获取资源列表
            Util.dialog.openDiv({
                id : 'addGroupRule',
                title:'添加活动资源',   //弹出窗标题
                modal:1,
                content:$resGoodsListBox,  //要加载的模块
                width:700,  //对话框宽度
                height:400  //对话框高度
            });
            loadRes();
            function loadRes (rsNm){
                if(!rsNm ){
                    rsNm = ''
                }
                var G_params = {
                    url : 'front/sh/resources!index?uid=sm001&rsNm='+ encodeURI(rsNm) +'&_='+new Date().getTime(),
                    items_per_page : 6 ,                       // 每页数     @param : limit
                    page_index : 0 ,                            //当前页  @param : start
                    pagination : $('.pagination'),         //分页id
                    pageCallback:function(){
                        var $resBox = $('input[name="resGoods"]');
                        $resBox.click(function(e){
                            e.stopPropagation();
                            $('input[name="selectAll"]',$resGoodsListBox).prop('checked',$resBox.length == $('input[name="resGoods"]:checked').length ? true : false);
                        });
                        //点击TR选中单选
                        $resGoodsListBox.on('click','#G-resGoodsList tr',function(){
                            var checkbox = $(this).find('input[name="resGoods"]');
                            checkbox.is(':checked') ? checkbox.prop("checked", false) : checkbox.prop("checked", true);
                        });
                    },
                    tabletpl :Util.hdb.compile($resGoodsListConTpl), //表格模板
                    tablewrap : $('#G-resGoodsList',$resGoodsListBox)//表格容器
                };
                Util.ajax.pagination(G_params.page_index , true , G_params);
            }
            //筛选
            $resGoodsListBox.on('click','#G-searchBox',function(){
                var rsNm = $('.search-input',$resGoodsListBox).val();
                loadRes(rsNm);
            });
            //重置
            $resGoodsListBox.on('click','#G-resetBox',function(){
                $('.search-input',$resGoodsListBox).val('');
                loadRes();
            });
            //全选
            $resGoodsListBox.on('click','input[name="selectAll"]',function(){
                $('input[name="resGoods"]').prop('checked',this.checked);
            });
            //确认添加
            $resGoodsListBox.on('click','#G-addResGoods',function(){
                selRes = [];
                $('input[name="resGoods"]',$resGoodsListBox).each(function(){
                    var $this = $(this);
                    var parentTr = $this.closest('tr');
                    if($this.is(":checked")){
                        selRes.push({
                            "mcdsId": parentTr.data('id'), //商品ID
                            "rsNm":parentTr.find('.res-goods-name').text(),
                            "prodUprc":parentTr.find('.res-goods-prc').text(),
                            "rsPicPath":parentTr.data('img'),
                            "rsAmount":parentTr.data('am'),
                            "crtTime":parentTr.find('.res-goods-time').text()
                        })
                    }
                });
                var bgnValidTime = $('input[name="bgnValidTime"]',$el).val()
                    ,endValidTime = $('input[name="endValidTime"]',$el).val();
                Util.ajax.loadTemp($('#G-actTable'),actTableTpl,{"beans":selRes,"bTime":bgnValidTime,"eTime":endValidTime},true);
                if($('#G-actTable',$el).html() != ''){
                    $('#G-resTip',$el).hide();
                }
                Util.dialog.get('addGroupRule').remove();
                $('.c-activity-list').remove();
            });
            //取消
            $resGoodsListBox.on('click','#G-close',function(){
                Util.dialog.get('addGroupRule').remove();
                $('.c-activity-list').remove();
            });

        };
        //删除资源
        var operationRes = function(){
            var $this = $(this)
                ,parentTr = $this.closest('tr')
                ,parentsTbody = $this.closest('tbody')
                ,trLen = $('tr',parentsTbody).length;
            parentTr.remove();
            if(trLen == 1){
                $('#G-resTip',$el).show();
            }
        };
        //保存团购营销
        var saveGroup = function(){
            var flag = false
                ,type = $(this).data('type')
                ,url;
            if($('#G-actTable tr',$el).length == 0){
                Util.dialog.tips('请添加活动资源');
                return;
            }
            $('#G-actTable').find('input[type="text"]').each(function(){
                var $this = $(this);
                var regPrice = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if($this.val() == ''){ //验证输入框不能为空
                    flag = true;
                    $this.addClass('c-input-err');
                    var cl = $this.data('cl');
                    if(cl == 'time'){
                        Util.dialog.tips('请把活动时间信息补充完整');
                    }else{
                        Util.dialog.tips('请把价格信息补充完整');
                    }
                    return false;
                }else{
                    if($this.data('cl') == 'price'){  //验证价格规则
                        if(!regPrice.test($this.val())){
                            flag = true;
                            Util.dialog.tips('请输入正确的价格格式');
                            return false;
                        }
                        if($this.attr('name') == 'pmtUprc'){
                            var pmtUprcVal = $this.val(); //团购价格
                            var origUprcVal = $this.closest('td').prev().find('input[name="origUprc"]').val(); //原价
                            if(pmtUprcVal - 0 > origUprcVal - 0){
                                Util.dialog.tips('团购价不能大于原价');
                                flag = true;
                                return false;
                            }
                        }
                    }

                }
            });
            if(flag){
                return;
            }
            //验证活动规则
            if($('textarea[name="cmpgnRuleCntt"]',$el).val() == '' || $('textarea[name="cmpgnDesc"]',$el).val().length > 2000){
                Util.dialog.tips('请输入正确的活动规则');
                return;
            }
            /*console.log($('#G-activityEdit').serializeArray());
            console.log($('#G-activityEdit').serialize());*/
            if(_param.param.editFlag == '0'){
                url = "front/sh/groupbuy!index?uid=005"; // 更新
            }else{
                url = "front/sh/groupbuy!index?uid=003"; //新增
            }
            $('input[name="cmpgnStsCd"]',$el).val('01'); //保存：状态为草稿
            Util.ajax.postJsonAsync(url, $('#G-activityEdit').serialize(), function(json,status){
                if(status){
                    //保存返回的活动ID
                    $('input[name="cmpgnId"]',$el).val(json.bean.cmpgnId);
                    var qcUrl = '/mamp/front/sh/common!getQrCodeNoDes?uid=c001'  //二维码接口地址
                        ,el = $('.codeImgDiv',$el);             //二维码插入DOM节点
                    var content = json.bean.tmpltPath;   //获得返回的活动url地址
                    var urlParams = '{"se":"0"}';
                    el.attr('src',qcUrl + '&content=' + content + '&urlParams=' + urlParams);  //把活动地址渲染到页面上
                    goStepThree();
                    Util.dialog.tips('活动保存成功');
                }else{
                    Util.dialog.tips(json.returnMessage);
                }
            });
        };
        var issueAct = function(){
            var url = 'front/sh/groupbuy!index?uid=002' ;            //发布接口
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

        };
        var openActList = function(){
            _indexModule.main.createTab({
                title:'返回到活动列表',
                url:'js/workflow/homepage/homepage'
            });
        };
        var loadEditActData = function(){
            var param = {
                "cmpgnId":_param.param.actId
            };
            Util.ajax.postJson("front/sh/groupbuy!index?uid=004", param, function(json,status){
                if(status){
                    var bean = json.bean
                        ,beans = json.beans;
                    //步骤一数据
                    $('input[name="cmpgnId"]',$el).val(bean.cmpgnId);                   //活动ID
                    $('input[name="cmpgnTypeCd"]',$el).val(bean.cmpgnTypeCd);           //活动类型
                    $('input[name="cmpgnNm"]',$el).val(bean.cmpgnNm);                   //活动名称
                    $('textarea[name="cmpgnDesc"]',$el).val(bean.cmpgnDesc);            //活动描述
                    $('input[name="bgnValidTime"]',$el).val(bean.bgnValidTime);         //开始时间
                    $('input[name="endValidTime"]',$el).val(bean.endValidTime);         //结束时间
                    $('input[name="founder"]',$el).val(bean.userNm);
                    //步骤二数据
                    $('input[name="cmpgnStsCd"]',$el).val(bean.cmpgnStsCd);             //活动状态
                    $('textarea[name="cmpgnRuleCntt"]',$el).val(bean.cmpgnRuleCntt);   //活动规则
                    $('input[name="tmpltId"]',$el).val(bean.tmpltId);                   //模版ID
                    //活动资源
                    Util.ajax.loadTemp($('#G-actTable'),actTableTpl,{"flag":"true","beans":beans,"imgUrl":bean.ftpUrl});
                    //获取模版列表
                    tmpTpl({
                        el:$("#tempList90",$el),
                        type:$('input[name="cmpgnTypeCd"]',$el).val(),
                        id:bean.tmpltId,
                        ftp: bean.ftpUrl,
                        img: bean.actvBannerPicAddr
                    });
                    if($('#G-actTable',$el).html() != ''){
                        $('#G-resTip',$el).hide();
                    }
                }else{
                    Util.dialog.tips(json.returnMessage);
                }
            });
        };
        return initialize;
    });