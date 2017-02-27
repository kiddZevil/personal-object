define(['Util'
    ,"laydate"
    ,"js/workflow/activity/selTool"
    ,"js/workflow/activity/template"
    ,'text!module/workflow/activity/activity.tpl'
    ,'text!module/workflow/activity/stepOne.tpl'
    ,'text!module/workflow/activity/stepThree.tpl'
    ,'text!module/workflow/activity/seckill/seckillStepTwo.tpl'
    ,'text!module/workflow/activity/seckill/seckillActTable.tpl'
    ,'text!module/workflow/activity/resources/resGoodsListBox.tpl'
    ,'text!module/workflow/activity/resources/resGoodsListCon.tpl'],
    function (Util,layDate,selTool,tmpTpl,activityTpl,stepOneTpl,stepThreeTpl,seckillStepTwoTpl,seckillTableTpl,resGoodsListBoxTpl,resGoodsListConTpl) {
        //系统变量-定义该模块的根节点
        var $el
            /*,flag = false
            ,BTN_DIS = 'btn-disabled'*/
            ,STEP_CURRENT = 'step-current'
            ,STEP_DONE = 'step-done'
            ,_indexModule = null
            ,_param
            ,selRes = []
            ,selmcdId = []
            ,PARENT = 'parent'
            ,nextIndex; //是否点击下一步
		initialize = function(indexModule, param){
            $el  = $(activityTpl);
            nextIndex = 0;
            _indexModule = indexModule;
            _param = param;
            //清空页面DOM节点
            $('#G-activityEdit',$el).html('');
            //重构页面DOM节点
            $('#G-activityEdit',$el).html($(stepOneTpl)).append($(seckillStepTwoTpl)).append($(stepThreeTpl));
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
            //添加资源
            $el.on('click','#G-addGroupRule',addGroupRule);
            //删除资源
            $el.on('click','.oper-delRes',operationRes);
            //修改限购
           /* $el.on('click','.lmt',function(){
                changeLine($(this));
            });*/
            //保存
            $el.on('click','#G-act-save',saveGroup);
            //发布
            $el.on('click','#G-act-issue',issueAct);
            //步骤三返回列表
            $el.on('click','#G-openActList',openActList);
            //是否限购
            /*$el.on('click','input[type="radio"]',checkRadio);*/
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
                                    stepOneData:JSON.stringify(stepOneData),
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
                        title: '新建秒杀营销活动',
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
        //商品活动时间
        var resBegTime = function(){
            var $this = $(this);
            laydate({
                start:$('input[name="bgnValidTime"]',$el).val(),
                min:$('input[name="bgnValidTime"]',$el).val(),
                max:$('input[name="endValidTime"]',$el).val(),
                istime: true,
                format:'YYYY-MM-DD hh:mm:ss',
                choose:function(dates){ //同步赋值隐藏时间input
                      //点击DOM节点
                    var parentTr = $this.closest('tr') // DOM节点父TR节点
                        ,parentsTbody = $this.closest('tbody') //DOM节点祖TABLE节点
                        ,changeResId = parentTr.data('id') //更改节点的ID
                        ,changeRes = parentsTbody.find('.date-' + changeResId +'-beg')
                        ,changeResLen = changeRes.length; //含有更改资源ID的长度
                    if(changeResLen > 0){
                        changeRes.each(function(index){
                            if(index > 0){
                                $(this).val(dates);
                            }
                        })
                    }
                }
            })
        };
        var resEndTime = function(){
            var $this = $(this);
            laydate({
                start:$(this).parent().prev().find('input[name="bgnTime"]').val(),
                min:$(this).parent().prev().find('input[name="bgnTime"]').val(),
                max:$('input[name="endValidTime"]',$el).val(),
                istime: true,
                format:'YYYY-MM-DD hh:mm:ss',
                choose:function(dates){ //同步赋值隐藏时间input
                    var parentTr = $this.closest('tr') // DOM节点父TR节点
                        ,parentsTbody = $this.closest('tbody') //DOM节点祖TABLE节点
                        ,changeResId = parentTr.data('id') //更改节点的ID
                        ,changeRes = parentsTbody.find('.date-' + changeResId +'-end')
                        ,changeResLen = changeRes.length; //含有更改资源ID的长度
                    if(changeResLen > 0){
                        changeRes.each(function(index){
                            if(index > 0){
                                $(this).val(dates)
                            }
                        })
                    }
                }
            })
        };
        /*
         单选radio
         * 0:不限购
         * 1:限购
         * */
        /*var changeLine = function(el){
            var id = el.data('i');
            var flag = el.data('check');
            var Tbody = el.closest('tbody');
            if(flag == 'no'){
                Tbody.find('tr').each(function(){
                    var $this = $(this);
                   if($this.data('id') == id){
                        $this.find('.no').prop('checked',true);
                        $this.find('input[name="lmtpchsFlag"]').val('0');
                        $this.find('input[name="lmtpchsQty"]').val('').attr('disabled','disabled');
                   }
                });
            }else{
                Tbody.find('tr').each(function(){
                    var $this = $(this);
                    if($this.data('id') == id){
                        $this.find('.sel').prop('checked',true);
                        $this.find('input[name="lmtpchsFlag"]').val('1');
                        $this.find('input[name="lmtpchsQty"]').removeAttr('disabled');
                    }
                });
                el.closest('.c-radio').find('input[name="lmtpchsQty"]').off('input propertychange').on('input propertychange',function(){
                    var num = $(this).val();
                    var inputDom = $('.'+id+'');
                    inputDom.each(function(i){
                        if(i > 0){
                            $(this).val(num);
                        }

                    })
                })
            }

        };*/
        //选择秒杀资源
        var addGroupRule = function(){
            var $resGoodsListBox = $(resGoodsListBoxTpl)
                ,$resGoodsListConTpl = resGoodsListConTpl;
            $('#G-resGoodsList',$resGoodsListBox).html('');
            //获取资源列表
            Util.dialog.openDiv({
                id : 'addGroupRuleid',
                title:'添加活动资源',   //弹出窗标题
                modal:1,
                content:$resGoodsListBox,    //要加载的模块
                width:700,  //对话框宽度
                height:400,  //对话框高度
                param:{list:true}
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
                selmcdId = [];
                var flag = false
                    ,len = 0;
                //获取已添加的资源
                $('#G-actTable tr',$el).each(function(){
                    if($(this).data('index') == '1'){
                        selmcdId.push($(this).data('id'))
                    }
                });
                //对比勾选的资源是否有重复添加
                $('input[name="resGoods"]',$resGoodsListBox).each(function(){
                    var $this = $(this);
                    if($this.is(":checked")){
                        len++;
                        var selId = $this.closest('tr').data('id');
                        if(selmcdId.length == '0'){
                            selRes.push(selId);
                        }else{
                            for(var i in selmcdId){
                                if(selmcdId[i] == selId){
                                    Util.dialog.tips('资源' + $this.closest('tr').data('nm') + '已存在，请勿重复添加');
                                    flag = true;
                                    return false;
                                }else{
                                    selRes.push(selId);
                                }
                            }
                        }
                    }
                });
                if(len == '0'){
                    Util.dialog.tips('请选择要添加的资源');
                    return
                }
                if(flag){
                    return
                }
                //查询选中资源包含的规格信息
                Util.ajax.postJsonAsync("front/sh/resources!index?uid=sa001&rsIds=" + selRes.join(","),'', function(json,status){
                    if(status){
                        var bgnValidTime = $('input[name="bgnValidTime"]',$el).val()
                            ,endValidTime = $('input[name="endValidTime"]',$el).val();
                        Util.ajax.loadTemp($('#G-actTable'),seckillTableTpl,{"object":json.object,"bTime":bgnValidTime,"eTime":endValidTime},true);
                    }else{
                        Util.dialog.tips(json.returnMessage);
                    }
                });
                if($('#G-actTable',$el).html() != ''){
                    $('#G-resTip',$el).hide();
                }
                Util.dialog.get('addGroupRuleid').remove();
                $('.c-activity-list').remove();
            });
            //取消
            $resGoodsListBox.on('click','#G-close',function(){
                Util.dialog.get('addGroupRuleid').remove();
                $('.c-activity-list').remove();
            });

        };
        //删除资源
        var operationRes = function(){
            var $this = $(this)  //点击DOM节点
                ,parentTr = $this.closest('tr') // DOM节点父TR节点
                ,parentsTbody = $this.closest('tbody') //DOM节点祖TABLE节点
                ,trLen = $('tr',parentsTbody).length //祖TABLE节点下TR节点长度
                ,trResIndex = parentTr.data('index') //多规格合并节点排列当前顺序
                ,rowspan = parentTr.data('rowspan') //含有规格个数
                ,delResId = parentTr.data('id') //删除节点的ID
                ,delRes = parentsTbody.find('.tr-' + delResId)
                ,delResLen = delRes.length; //含有删除资源ID的长度
            if(rowspan <= '1' && delResLen == "1"){  //资源只有一个规格信息
                parentTr.remove();
            }else{  //资源含有多个规格信息
                if(trResIndex == '1' && delResLen > '1'){
                    parentTr.next().addClass(PARENT);
                    parentTr.next().data('index','1');
                    parentTr.next().data('rowspan',rowspan-1);
                    parentTr.next().find('td').each(function(index){
                        $(this).removeClass('fn-hide');
                        $(this).attr('rowSpan',rowspan-1);
                        if(index == 3){
                            parentTr.remove();
                            return false;
                        }
                    });
                }else{
                    delRes.each(function(){
                        $(this).data('rowspan',rowspan - 1);
                        $(this).find('td').each(function(index){
                            $(this).attr('rowSpan',rowspan - 1);
                            if(index == 3){
                                parentTr.remove();
                                return false;
                            }
                        });
                    })

                }
            }
            if(trLen == 1){
                $('#G-resTip',$el).show();
            }
        };
        //保存秒杀营销
        var saveGroup = function(){
            var flag = false
                ,type = $(this).data('type')
                ,url;
            if($('#G-actTable',$el).html() == ''){
                Util.dialog.tips('请添加活动资源');
                return;
            }
            $('#G-actTable input[type="text"]',$el).each(function(){
                var $this = $(this);
                var regPrice = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/; //价格正则
                var regQty = /^[1-9]\d*$/; //限购正则
                var cl = $this.data('cl');
                if($this.val() == '' && !$this.attr('disabled')){ //验证输入框不能为空并排除掉禁用的input
                    flag = true;
                    /*$this.addClass('c-input-err');*/
                    if(cl == 'time'){
                        Util.dialog.tips('请把活动时间信息补充完整');
                        return false;
                    }else if(cl == 'price'){
                        Util.dialog.tips('请把价格信息补充完整');
                        return false;
                    }else if(cl == 'setup'){
                        Util.dialog.tips('请把秒杀数量补充完整');
                        return false;
                    }else{
                        if(!$this.attr('disabled')){
                            Util.dialog.tips('请输入限购数量');
                            return false;
                        }
                    }
                }else{ //验证价格规则
                    if(cl == 'price'){
                        if(!regPrice.test($this.val())){
                            Util.dialog.tips('请输入正确的价格格式');
                            flag = true;
                            return false;
                        }
                        if($this.attr('name') == 'pmtUprc'){
                            var pmtUprcVal = $this.val(); //秒杀价格
                            var origUprcVal = $this.closest('td').prev().find('input[name="origUprc"]').val(); //原价
                            if(pmtUprcVal - 0 > origUprcVal - 0){
                                Util.dialog.tips('秒杀价不能大于原价');
                                flag = true;
                                return false;
                            }
                        }
                    }else if(cl == 'qty'){
                        if(!regQty.test($this.val()) && !$this.attr('disabled')){
                            Util.dialog.tips('请输入不以0开始的正整数');
                            flag = true;
                            return false;
                        }
                    }else if(cl == 'setup'){
                        if(!regQty.test($this.val())){
                            Util.dialog.tips('请输入正确的秒杀数量');
                            flag = true;
                            return false;
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
            if(_param.param.editFlag == '0'){
                url = "front/sh/seckill!execute?uid=003"; // 更新
            }else{
                url = "front/sh/seckill!execute?uid=001"; //新增
            }
            /*console.log($('#G-activityEdit').serializeArray())*/
            $('input[name="cmpgnStsCd"]',$el).val('01'); //保存：状态为草稿
            Util.ajax.postJsonAsync(url, $('#G-activityEdit').serialize(), function(json,status){
                if(status){
                    $('input[name="cmpgnId"]',$el).val(json.bean.cmpgnId);
                    var qcUrl = '/mamp/front/sh/common!getQrCodeNoDes?uid=c001'  //二维码接口地址
                        ,el = $('.codeImgDiv',$el);             //二维码插入DOM节点
                    var content = json.bean.tmpltPath;   //获得返回的活动url地址
                    var urlParams = '{"se":"0"}';
                    el.attr('src',qcUrl + '&content=' + content + '&urlParams=' + urlParams  + "&urlHasParam=1");  //把活动地址渲染到页面上
                    goStepThree();
                    Util.dialog.tips('活动保存成功');
                }else{
                    Util.dialog.tips(json.returnMessage);
                }
            });
        };
        //发布活动
        var issueAct = function(){
            var url = 'front/sh/seckill!execute?uid=009';             //发布接口
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
        //编辑
        var loadEditActData = function(){
            var param = {
                "cmpgnId":_param.param.actId
            };
            Util.ajax.postJson("front/sh/seckill!execute?uid=002", param, function(json,status){
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
                    $('textarea[name="cmpgnRuleCntt"]',$el).val(bean.cmpgnRuleCntt);    //活动规则
                    $('input[name="tmpltId"]',$el).val(bean.tmpltId);                   //模版ID
                    //活动资源
                    //处理返回数据字段
                    Util.ajax.loadTemp($('#G-actTable'),seckillTableTpl,{"flag":"true","object":formatData(beans)});
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
        /*格式化服务器返回数据*/
        var formatData = function(date){
            var beans = date
                ,j = 0
                ,object = []
                ,cmpnList = []
                ,len = beans.length - 1;
            $.each(beans,function(index){
                var mcdsId = beans[j].mcdsId; //获取第一个资源的ID
                if(beans[index].mcdsId == mcdsId){
                    cmpnList.push({
                        "bgnTime": beans[index].bgnTime,
                        "finishTime": beans[index].finishTime,
                        "componNm": beans[index].mcdsUnitNm,
                        "setupQty": beans[index].preprQty,
                        "origUprc": beans[index].origUprc,
                        "pmtUprc": beans[index].pmtUprc,
                        "lmtpchsFlag": beans[index].lmtpchsFlag,
                        "lmtpchsQty": beans[index].lmtpchsQty,
                        "rsComponId": beans[index].mcdsUnitId
                    });
                }else{
                    j = index;
                    object.push({
                        "mcdsId": beans[index-1].mcdsId, //商品ID
                        "rsNm": beans[index-1].mcdsNm //商品名称
                        ,"cmpnTotal": cmpnList.length
                        ,"cmpnList": cmpnList
                    });
                    cmpnList = [];
                    cmpnList.push({
                        "bgnTime": beans[index].bgnTime,
                        "finishTime": beans[index].finishTime,
                        "componNm": beans[index].mcdsUnitNm,
                        "setupQty": beans[index].preprQty,
                        "origUprc": beans[index].origUprc,
                        "pmtUprc": beans[index].pmtUprc,
                        "lmtpchsFlag": beans[index].lmtpchsFlag,
                        "lmtpchsQty": beans[index].lmtpchsQty,
                        "rsComponId": beans[index].mcdsUnitId
                    });
                }
                if(index == len){
                    object.push({
                        "mcdsId": beans[index].mcdsId, //商品ID
                        "rsNm": beans[index].mcdsNm //商品名称
                        ,"cmpnTotal": cmpnList.length
                        ,"cmpnList": cmpnList
                    });
                }
            });
            return object;
        };
        return initialize;
    });