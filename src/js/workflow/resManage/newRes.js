define(['Util','date','upload','text!module/workflow/resManage/newRes.tpl',
        'text!module/workflow/resManage/dialogMcds.tpl',
        'text!module/workflow/resManage/mcdsList.tpl'
        ],
    function (Util,Date,Upload,newResTpl,dialogMcds,mcdsList) {
        //系统变量-定义该模块的根节点
        var $el ;
        //系统变量-构造函数
        var _indexModule = null,_param;
		initialize = function(indexModule, param){
			$el = $(newResTpl);
			_indexModule = indexModule;
            _param = param;
            $('#G-back-parent',$el).html(_param.param.backTit);
            $('#G-pageTit',$el).html(_param.param.pageTit);
            //执行输入计数
            onMyChange('G-nameInput','G-msgNm',32);
            onMyChange('G-rsDesc','G-msgDesc',255);
            onMyAmt('G-numInput','G-msgAmt');
            //资源类型切换表单显示
            $el.on('change','input[name="rsTypeCd"]',function(){
            	var el = $(this);
            	changeForm(el);
            });
            var yesNo = 1;
            //是否为商品
            var $isMcds = $('#G-isMcds',$el),
            $inputName = $('#G-nameInput',$el),
            $preprQty = $('input[name="preprQty"]',$el);
            $el.on('click','#G-no', function () {
            	if(yesNo == 1){            		
                    $inputName.val('');
                    $preprQty.val('');
                    $isMcds.hide();              
                    $inputName.attr("readonly",false);
                    $preprQty.attr("readonly",false);
                    $inputName.parent('.controls').removeClass('noEdit'); 
                    $preprQty.parent('.controls').removeClass('noEdit');                   
                    yesNo = 0;
            	}
                
            });
            $el.on('click','#G-yes', function () {
            	if(yesNo == 0){            		
				   $inputName.val('');
				   $preprQty.val('');
				   $isMcds.show();
				   $inputName.attr("readonly",true);
				   $preprQty.attr("readonly",true);
				   $inputName.parent('.controls').addClass('noEdit');
				   $preprQty.parent('.controls').addClass('noEdit');
				   $('#G-msgNm').html('');
				   yesNo = 1;
            	}
            	
            });
            //优惠券 文件导入
           /* $el.on("click",'#G-importFile',function(){
                $('#G-fileUpload',$el).click();             
                return false;
            });*/
            //图片选择
            /*$el.on("click","[name='hfFileImgModf']",function(){
                $('.picUpload',$el).click();                
                return false;
            });*/
            //时间控件
            dateTime();
            //商品选择
           /* $el.on('click','#G-choose',dialogMcdsChose);*/
       
            $el.on('click','#G-choose', function () {
                if($('#userInfo_chnlId').val() == '1111'){
                    Util.dialog.tips('该用户无法选择商品');
                    return
                }
                //获取资源列表
                    /*var _this = $(this).parents('.sign-rule-box'),
                        _thisId = _this.attr('id'),
                        _thisValue = _this.find('input[name="cmpgnRsId"]').val();*/
                    _indexModule.showDialog({
                        id:"G-mcdsDialog",
                        title:"选择商品",
                        url:"js/workflow/resManage/dialogMcds",
                        width:700,
                        height:410
                       /* param:{thisId:_thisId,thisValue:_thisValue}*/
                    });

            });
            
            //提交按钮
            $el.on("click","#G-submit",function(){
            		var rsSrcTypeCd ,
            			reg = /\S+/,
            			$rsNm = $('input[name="rsNm"]'),
            			$numInput = $('input[name="coupnFcvalAmt"]'),
            			$rsDesc = $('#G-rsDesc'),
                        selVal = $('input[name="rsTypeCd"]:checked').val();
            	if(selVal == '01' && $('#G-yes')[0].checked == true){
            		rsSrcTypeCd = '02';
            		
            	}else{
            		rsSrcTypeCd = '01';
            	}
            	if(selVal != '02'){
            		$('input[name="bgnValidTime"]').val('');
            		$('input[name="endValidTime"]').val('');
                    if($('input[name="preprQty"]').val() == ''){
                        Util.dialog.tips('数量不能为空');
                        return;
                    }
            	}
            	if($rsNm.val().length > 32){
            		$rsNm.val($rsNm.val().substring(0,31));
            	}
            	if($rsDesc.val().length > 255){
            		 Util.dialog.tips('资源描述超过字数限制'); 
            		/*$rsDesc.val($rsDesc.val().substring(0,254));*/
            		 return;
            	}
            	if($numInput.val() == "" && selVal =='02'){
                    Util.dialog.tips('请添加优惠券面额');                   
                    return;
                }
            	if($numInput.val().length > 5 || isNaN($numInput.val())){
                    Util.dialog.tips('优惠券面额请填写5位以内的数字');                   
                    return;
                }
            	if(!reg.test($rsNm.val())){
                    Util.dialog.tips('资源名称(商品名称/优惠券名称)不能为空');
                    return;
                }
            	if( $('input[name="rsPicPath"]').val()==''){
                    Util.dialog.tips('请添加资源图片');                   
                    return;
                }           	
                Util.ajax.postJson("front/sh/resources!add?uid=a001&rsSrcTypeCd="+rsSrcTypeCd, $('#G-form',$el).serialize(), function(json,status){           	               	
                	if(status){ 
                        Util.dialog.tips("新建成功！"); 
                        openList();
                    }else{                    	
                		$("#G-upLoadTip").html('');
                		$('input[name="preprQty"]').val('');                  
                    	Util.dialog.tips(json.returnMessage); 
                    }
                });
            });
            //页面加载完成后执行方法
            this.renderCallback=function(){
            	Upload.upload({
                    url:'front/sh/resources!addSkuNo?uid=up001', //上传地址
                    name:"couponFile",
                    formData :"",        //上传传参
                    el:$('.fuckIn'),
                    accept:'accept="*"',
                    add:function (e,data) {
                        data.submit();
                        Util.dialog.openDiv({
                        	id:'G-loading',
                        	modal: 1,
                        	content:'<span class="ui-dialog-loading fn-left">Loading..</span><span class="fn-left" style="margin-left:4px;margin-top: -8px;">导入中...</span>'
                        	});
                        $("#G-upLoadTip").html('正在导入……');
                    },
                    done:function(e,data) {                   	
                    	var $reault = $("#G-upLoadTip")
                        if (data.result.returnCode == '0') {                  
                        	$('input[name="preprQty"]').val(data.result.bean.preprQty);
                           $reault.css('color','green');
                           $reault.html('校验成功！');
                        }else{
                        	$reault.css('color','red');
                        	$reault.html(data.result.bean.returnMsg);
                        }
                    	Util.dialog.get('G-loading').remove();
                    },
                    fail:function(){
                        Util.dialog.tips("文件上传失败");
                    }
                });
                // 上传组件示例（由于没有封装、暂时引用后使用原生的写法）
            	Upload.upload({
                    url:"front/sh/resources!uploadImg?uid=up001", //上传地址
                    name:"Filedata",
                    formData :"",        //上传传参
                    el:$('.prize-upload-img'),
                    add:function(){},
                    done:function(e,data,el){
                        var imgUrl = data.result.bean;
                        el.find('input[name="rsPicPath"]').val(imgUrl.nginxUrl);
                        
                        el.find('.prize-img-img').html('<img src="'+imgUrl.url+'" />');
                    },
                    fail:function(){
                        Util.dialog.tips("文件上传失败")
                    }
                });
            };


            //将根节点赋值给接口
            this.content = $el;
        };

        //资源类型选择显示切换
        var changeForm = function (el) { 
        	clearForm();
        	var val = el.val(),
                $typeCoupon = $('#G-typeCoupon',$el),
                $typeWerc = $('#G-typeMerc',$el),
                $isMcds = $('#G-isMcds',$el),
                $name = $('#G-name',$el),
        		$qty = $('#G-qty',$el),
        		$inputName = $('#G-nameInput',$el),
        		$inputQty = $('input[name="preprQty"]',$el);
            if (val=='01'){
                $typeCoupon.hide();
                $typeWerc.show();
                $isMcds.show();
                $name.html('<b>*</b>商品名称：');
                $qty.html('<b>*</b>数量：');
                $inputName.attr("readonly",true);
                $inputQty.attr("readonly",true);
                $inputName.parent('.controls').addClass('noEdit');
                $inputQty.parent('.controls').addClass('noEdit');
                $('#G-yes').click();
            }else if(val=='02'){
                $typeCoupon.show();
                $typeWerc.hide();
                $isMcds.hide();
                $name.html('<b>*</b>优惠券名称：');
                $qty.html('<b>*</b>导入总数：');
                $inputName.attr("readonly",false);
                $inputQty.attr("readonly",true);
                $inputName.parent('.controls').removeClass('noEdit');
                $inputQty.parent('.controls').addClass('noEdit');
                $('#G-yes').attr('checked',false);
            }else {
                $typeCoupon.hide();
                $typeWerc.hide();
                $isMcds.hide();
                $name.html('<b>*</b>资源名称：');
                $qty.html('<b>*</b>数量：');
                $inputName.attr("readonly",false);
                $inputQty.attr("readonly",false);
                $inputName.parent('.controls').removeClass('noEdit');
                $inputQty.parent('.controls').removeClass('noEdit');
                $('#G-yes').attr('checked',false);
            }
        };

       /* //商品选择列表弹窗
        var dialogMcdsChose = function(){
            _indexModule.showDialog({
                id:"G-mcdsDialog",
                title:"选择商品",
                url:"js/workflow/resManage/dialogMcds",
                width:800,
                height:"auto"
                param:{tpl:dialogMcds}
            });
        };*/
       
        //加载时间控件
        var dateTime = function(){
            new Date( {
                el:$('.datetime',$el),
                label:'<b style="color:red">*</b>有效期：',     //label内容
                double:{    //支持一个字段里显示两个日期选择框
                    start:{
                        /*value:laydate.now(-6)+" 00:00:00",*/
                        name:'bgnValidTime',   //开始日期文本框name
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        min: laydate.now(-9999),   //最小日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istime: true,
                        istoday: false,
                        choose: function(datas){
                            this.end.min = datas;     //设置结束日期的最小限制
                            this.end.start = datas;     //设置结束日期的开始值
                        }
                    },
                    end:{
                       /* value:laydate.now()+" 23:59:59",*/
                        name:'endValidTime',     //结束日期文本框name
                        format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
                        min: laydate.now(-1),   //最小日期
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
        var clearForm = function(){
        	//切换时清空表单
        	$(".tip-span").html('');
        	$('input[type="text"]').each(function(){
        		$(this).val('')        		
        	});
        	$('input[type="file"]').each(function(){
        		$(this).val('')        		
        	});
        	$('.prize-img-img').each(function(){
        		$(this).html('<div class="prize-add-imgbg">+</div>')        		
        	});
        	$('textarea').each(function(){
        		$(this).val('')        		
        	});
        	$("#G-upLoadTip").html('');
        	};
        	
        //返回到活动列表
        var openList = function(){
            _indexModule.main.createTab({
                title:'返回到资源列表',
                url:'js/workflow/resManage/resList'
            });
        };
      //实时监听文本框内容变化
        var onMyChange = function(inputId,spanId,num){       	
        	//当状态改变的时候执行的函数        	
        	var handle = function (){
        		var $spanId = $('#'+spanId);
        		var _num = document.getElementById(inputId).value.length;       		 
        		if(_num>num){
        			$spanId.html('<i class="red-big">'+_num+'</i>'+'/'+num);
        		}else{
        			$spanId.html(_num+'/'+num);
        		}
        		
        	} 
        	//firefox下检测状态改变只能用oninput,且需要用addEventListener来注册事件。 
        	if(/msie/i.test(navigator.userAgent))    //ie浏览器 
        	{    		
        		$('#'+inputId,$el).on('input propertychange',handle);        		
        	} 
        	else 
        	{//非ie浏览器
        		$el.on("input",'#'+inputId,handle);
        	}        	
        }
		  //实时监听优惠券金额内容变化
		var onMyAmt = function(inputId,spanId){       	
			//当状态改变的时候执行的函数        	
			var handle = function (){
				var $spanId = $('#'+spanId);
				var _num = document.getElementById(inputId).value.length;       		 
				if(_num > 5 || isNaN($('#'+inputId).val())){				
					$spanId.html('<i style="color:#DE2929">请输入5位以内的数字</i>');
					return;
				}else{
					$spanId.html('');
				}
			} 
			//firefox下检测状态改变只能用oninput,且需要用addEventListener来注册事件。 
			if(/msie/i.test(navigator.userAgent))    //ie浏览器 
			{    		
				$('#'+inputId,$el).on('input propertychange',handle);        		
			} 
			else 
			{//非ie浏览器
				$el.on("input",'#'+inputId,handle);
			}        	
		}
        return initialize;
    });