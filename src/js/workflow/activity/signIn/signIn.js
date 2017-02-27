define(['Util'
        ,'upload'
        ,"laydate"
        ,"js/workflow/activity/selTool"
        ,"js/workflow/activity/template"
        ,'text!module/workflow/activity/activity.tpl'
        ,'text!module/workflow/activity/stepOne.tpl'
        ,'text!module/workflow/activity/stepThree.tpl'
        ,'text!module/workflow/activity/signIn/signInStepTwo.tpl'
        ,'text!module/workflow/activity/signIn/addsignIn.tpl'
        ,'text!module/workflow/activity/signIn/updataSignIn.tpl'
    ],
    function (Util,Upload,layDate,selTool,tmpTpl,activityTpl,stepOneTpl,stepThreeTpl,signStepTwoTpl,addsignIn,updateSignIn) {
        //系统变量-定义该模块的根节点
        var $el
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
            $('#G-activityEdit',$el).html($(stepOneTpl)).append($(signStepTwoTpl)).append($(stepThreeTpl));
            //打开步骤二
            $el.on('click','#G-stepOneNext',goStepTwo);
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
            //添加不同序号规则
            $el.on('click','#G-addRule', function () {
                var $addsignIn = $(addsignIn),
                    lengthId = $(".sign-rule-box").length;
                $('.sign-rule-list').append($addsignIn);
                $('.sign-rule-box:last').attr('id','G-rule'+lengthId);
                $('.sign-rule-box:last').find('input[type="radio"]').attr('name','N-radio'+lengthId);               
                $('.sign-rule-box:last').find('.rule-count').html(lengthId+1);                              
                
            });
            //添加商品
            $el.on('click','.z-addMcds', function () {
                //获取资源列表
                    var _this = $(this).parents('.sign-rule-box'),
                        _thisId = _this.attr('id'),
                        _thisValue = _this.find('input[name="cmpgnRsId"]').val();
                    _indexModule.showDialog({
                        id:"G-mcdsDialog",
                        title:"添加活动资源",
                        url:"js/workflow/activity/signIn/dialogSignIn",
                        width:650,
                        height:400,
                        param:{thisId:_thisId,thisValue:_thisValue}
                    });

            });
            //返回上一步
            $el.on('click','#G-prevStepOne',prevStepOne);
            //活动开始时间
            $el.on('click','input[name="bgnValidTime"]',actBegTime);
            //活动结束时间
            $el.on('click','input[name="endValidTime"]',actEndTime);
            //删除规则
            $el.on('click','.g-delete',deleteRule);
            //保存
            $el.on('click','#G-act-save',saveGroup);
            //发布
            $el.on('click','#G-act-issue',issueAct);
            //步骤三返回列表
            $el.on('click','#G-openActList',openActList);
            $('input[name="cmpgnNm"]',$el).keyup(function(){
                var len = $(this).val().length;
                if(len > 32){
                    $(this).val($(this).val().substring(0,250))
                }
            });
            $('textarea[name="cmpgnDesc"]',$el).keyup(function(){
                var len = $(this).val().length;
                if(len > 250){
                    $(this).val($(this).val().substring(0,250))
                }
            });
            $('textarea[name="cmpgnRuleCntt"]',$el).keyup(function(){
                var len = $(this).val().length;
                if(len > 2000){
                    $(this).val($(this).val().substring(0,2000))
                }
            });

            //规则选择
            $el.on('click','input[type="radio"]',checkRadio);
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
        //删除规则
        var deleteRule = function(){ 
            var $this = $(this)
                ,parentTr = $this.parents('.sign-rule-box');
            parentTr.remove();
        };
        //保存
        var saveGroup = function(){
            var flag = false
                ,type = $(this).data('type')
                ,url,
                daysGrup = [],
                nary;
            var reg = /^\+?[1-9]\d*$/;
          //验证活动规则是否添加
            if($('.sign-rule-info',$el).length == 0){
                Util.dialog.tips('请添加活动规则');
                return;
            }
        	$('.sign-rule-info',$el).each(function(){  
        		var starDate =  $('input[name="bgnValidTime"]',$el).val(),		//活动开始时间
        			sendDate =  $('input[name="endValidTime"]',$el).val(),		//活动结束时间
        			$this = $(this),											//箭头指向规则内	
        			d1=new Date(starDate),										//格式化活动开始时间
        			d2=new Date(sendDate),										//格式化活动结束时间
        			days=Math.abs(d1-d2)/ 1000 / 60 / 60 /24;					//将开始结束时间差换算成天,即活动天数
        		var leftQty = parseInt($this.find('input[name="leftQty"]').val()),		//奖品数量
        			signdDayCnt = parseInt($this.find('input[name="signdDayCnt"]').val()); //签到天数
        		
        		daysGrup.push(signdDayCnt);		
        		//连续签到天数验证
        		if($this.find('input[name="signdDayCnt"]').val() == ''){            	
            		flag = true;
        			Util.dialog.tips('请将规则补充完整');
                    return false;
                }
        		//领取条件验证
        		if($this.find('.input-day').attr('disabled') && $this.find('.input-all').val()== ""){       	
            		flag = true;
        			Util.dialog.tips('请将规则补充完整');
                    return false;
                }
        		if($this.find('.input-all').attr('disabled') && $this.find('.input-day').val()== ""){
        	
            		flag = true;
        			Util.dialog.tips('请将规则补充完整');
                    return false;
                }
        		//验证添加奖品
        		if($this.find('input[name="rsNm"]').val() == ''){            	
            		flag = true;
        			Util.dialog.tips('请将规则补充完整');
                    return false;
                }
        		
        		//验证签到天数是否正确
        		if(signdDayCnt-1 > days){            	
            		flag = true;
        			Util.dialog.tips('签到天数不能超过活动天数');
                    return false;
                }
        		//奖品量是否充足
        		if($this.find('.input-day').attr('disabled') && parseInt($this.find('.input-all').val()) > leftQty ){            	
            		flag = true;
        			Util.dialog.tips('奖品剩余数量不足');
                    return false;
                }
        		//奖品量是否充足
        		if($this.find('.input-all').attr('disabled') && parseInt($this.find('.input-day').val()) > leftQty/(Math.ceil(days)-signdDayCnt+1) ){
                    flag = true;
        			Util.dialog.tips('奖品剩余数量不足');
                    return false;
                }
            });

        	nary=daysGrup.sort(); 
        	console.log(nary);
        	for(var i=0;i<daysGrup.length;i++){        		
	        	if (nary[i]==nary[i+1]){ 
	        		Util.dialog.tips('每个规则签到天数不能重复');
	        		return;
	        	} 
        	} 
            if(flag == true){                
                return;
            }
            if($('textarea[name="cmpgnRuleCntt"]',$el).val() == ''){
                Util.dialog.tips('请添加活动规则信息');
                return;
            }
            //组织json
            var beans = [];
            $('.sign-rule-info',$el).each(function(){
            	var signType = $(this).find('.input-all').val();
            	if(signType == ""){
            		signType = $(this).find('.input-day').val();
            	}
                beans.push({
                    "signdTypeCd":"01",
                    "signdDayCnt": $(this).find('input[name="signdDayCnt"]').val(),
                    "cmpgnRsId": $(this).find('input[name="cmpgnRsId"]').val(),
                    "takeLmtTypeCd": $(this).find('input[name="takeLmtTypeCd"]').val(),
                    "takeLmtQty": signType
                });
                /*{
                     "signdTypeCd":"连续签到",
                     "signdDayCnt":"签到天数",
                     "cmpgnRsId":"营销活动资源ID(添加商品)",
                     "takeLmtTypeCd":"领取限制类型代码(每天/总共)",
                     "takeLmtQty":"领取限制数量"
                 },*/
            });
            var signParam = {
                "params":{
                	"cmpgnId": $('input[name="cmpgnId"]',$el).val(),
                	"cmpgnNm":$('input[name="cmpgnNm"]',$el).val(),
                    "cmpgnDesc":$('textarea[name="cmpgnDesc"]',$el).val(),                          //"营销活动描述",
                    "crtUserId":"",//"创建用户ID",
                    "bgnValidTime": $('input[name="bgnValidTime"]',$el).val(),                      //"开始有效时间",
                    "endValidTime": $('input[name="endValidTime"]',$el).val(),                      //"终止有效时间",
                    "tmpltId": $('input[name="tmpltId"]',$el).val(),                          		//"模板ID",
                    "cmpgnRuleCntt": $('textarea[name="cmpgnRuleCntt"]',$el).val()                  //"营销活动规则内容"
                }
                ,"beans":beans
                ,"object":null
            };
            /*"params":{
             "cmpgnNm":"营销活动名称",
                     "cmpgnDesc":"营销活动描述",
                     "crtUserId":"创建用户ID",
                     "bgnValidTime":"开始有效时间",
                     "endValidTime":"终止有效时间",
                     "tmpltId":"模板ID",
                     "cmpgnRuleCntt":"营销活动规则内容"
                 },*/
         
            if(_param.param.editFlag == '0'){
                url = "front/sh/sign!execute?uid=si002"; // 更新
            }else{
                url = "front/sh/sign!execute?uid=si001"; //新增
            }
           
            //$('input[name="cmpgnStsCd"]',$el).val('01'); //保存：状态为草稿
            Util.ajax.postJsonAsync(url, {"signStsCd":"01","signParam":JSON.stringify(signParam),"tmpltPath":$('input[name="tmpltPath"]',$el).val(),'actvBannerPicAddr':$('input[name="actvBannerPicAddr"]',$el).val()
}, function(json,status){
                if(status){
                	if(json.bean.cmpgnId){
                	 $('input[name="cmpgnId"]',$el).val(json.bean.cmpgnId);                                	                        
                	}
                	 var qcUrl = '/mamp/front/sh/common!getQrCodeNoDes?uid=c001'  //二维码接口地址
                         ,el = $('.codeImgDiv',$el);             //二维码插入DOM节点
                     var content = json.bean.cmpgnUrlAddr;   //获得返回的活动url地址
                     var urlParams = '{"se":"0"}';
                     el.attr('src',qcUrl + '&content=' + content + '&urlParams=' + urlParams + "&urlHasParam=1");               	 
                	 goStepThree();
                     Util.dialog.tips('活动保存成功');
                   // openActList();
                    goStepThree();
                }else{
                    Util.dialog.tips(json.returnMessage);
                }
            });
           
        };
        //发布
        var issueAct = function(){
        	var url = 'front/sh/sign!execute?uid=si007' ;        //发布接口
            var param = {
            		"signStsCd":"03",	
                "cmpgnId":$('input[name="cmpgnId"]').val(), //活动ID                          
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
        //返回到活动列表
        var openActList = function(){
            _indexModule.main.createTab({
                title:'返回到活动列表',
                url:'js/workflow/homepage/homepage'
            });
        };
        //radio标签格式
        var checkRadio =function(){
            var $this = $(this)
                ,check = $this.data('check')
                ,group = $this.closest('.sign-rule-info')
                ,flag = group.find('input[name="takeLmtTypeCd"]')
                ,qty = $this.parents('.sign-rule-row').find('input[type="text"]'),
                getInput = group.find('input[name="takeLmtQty"]');
            getInput.val("");
            getInput.attr('disabled','disabled');
            getInput.attr('name','');
            qty.removeAttr('disabled');
            qty.attr('name','takeLmtQty');
            if(check == 'all'){
                flag.val('02');
            }else{
                flag.val('01');
            }

        };
        
        //编辑签到活动
        var loadEditActData = function(){
        	
        	var param = {
                    "cmpgnId":_param.param.actId
                };	
            Util.ajax.postJson("front/sh/sign!execute?uid=si003",param, function(json,status){
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
                    $('input[name="founder"]',$el).val(bean.userNm);					//创建人信息
                    //步骤二数据
                    $('textarea[name="cmpgnRuleCntt"]',$el).val(bean.cmpgnRuleCntt);    //活动规则
                    $('input[name="tmpltId"]',$el).val(bean.tmpltId);            		//模板               
                    //活动资源
                    Util.ajax.loadTemp($('#G-ruleList'),updateSignIn,{"flag":"true","beans":beans,"bean":bean},false,function(){
                        var index = 0;
                        $('.sign-rule-box').each(function () {
                            $this = $(this);
                            $this.attr('id','G-rule'+index);
                            $this.find('input[type="radio"]').attr('name','N-radio'+index);
                            $this.find('.rsPicPath').prepend()
                            return index++;
                        });
                    });
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