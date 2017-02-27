
/*模板id(M开头6位数字),模版名称、 模版类型、 营销类型、 模版banner设置： 、模版路径、模版缩略图*/
define([
    'Util'
    ,'upload'
    ,'text!module/workflow/tplManage/newTpl.tpl'
    ,'text!module/workflow/tplManage/cmpgnType.tpl'],
    function (Util,Upload,newResTpl,typeTpl) {
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
            //类型切换表单显示
            $el.on('change','input[name="cmpgnTypeCd"]',function(){
                var el = $(this);
                changeForm(el);
            });
            //执行输入计数
            onMyChange('G-tplDesc','G-msgDesc',255);
            //初始化子节点
            getCtype('01');
            /*onMyAmt('G-idInput','G-msgAmt');模板id判断*/
            //提交按钮
            $el.on("click","#G-submit",function(){
               /* var reg = /^M{1}\d{6}$/;
                //模板id判断
                if(!reg.test($('input[name="tmpltId"]').val())){
                    Util.dialog.tips('模版ID格式错误');
                    return;
                }*/

                if($('input[name="tmpltNm"]').val()==''){
                    Util.dialog.tips('请填写模板名称');
                    return;
                }
                if($('input[name="bannerPicHt"]').val()=='' && isNaN($('input[name="bannerPicHt"]').val())){
                    Util.dialog.tips('请填写正确的模板banner');
                    return;
                }
                if($('input[name="cmpgnTypeCd"]:checked').val()!= '03'){
                    if($('input[name="przitmCnt"]').val()=='' && isNaN($('input[name="przitmCnt"]').val())){
                        Util.dialog.tips('请填写正确的奖项数量');
                        return;
                    }
                }

                if($('#G-adrInput2').val()==''){
                    Util.dialog.tips('请填写模板路径');
                    return;
                }
                if( $('input[name="tmpltPicUrlAddr"]').val()==''){
                    Util.dialog.tips('请添加模板图片');
                    return;
                }
                if($('#G-tplDesc').val().length > 255){
                    Util.dialog.tips('模板描述超过字数限制');
                    return;
                }
                $('input[name="tmpltPath"]').val($('#G-adrInput').val()+$('#G-adrInput2').val());
                Util.ajax.postJson("front/sh/campaign!execute?uid=m003", $('#G-form',$el).serialize(), function(json,status){
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
                // 上传组件示例（由于没有封装、暂时引用后使用原生的写法）
                Upload.upload({
                    url:"front/sh/resources!uploadImg?uid=up001", //上传地址
                    name:"Filedata",
                    formData :"",        //上传传参
                    el:$('.prize-upload-img'),
                    add:function(){},
                    done:function(e,data,el){
                        var imgUrl = data.result.bean;
                        el.find('input[name="tmpltPicUrlAddr"]').val(imgUrl.nginxUrl);

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
        var clearForm = function(){
            //切换时清空表单
            $(".tip-span").html('');
            $('input[type="text"]').each(function(){
                if($(this).attr('id') != 'G-adrInput'){
                    $(this).val('');
                }
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
                url:'js/workflow/systemManage/tpl/tplList'
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

            };
            //firefox下检测状态改变只能用oninput,且需要用addEventListener来注册事件。
            if(/msie/i.test(navigator.userAgent))    //ie浏览器
            {
                $('#'+inputId,$el).on('input propertychange',handle);
            }
            else
            {//非ie浏览器
                $el.on("input",'#'+inputId,handle);
            }
        };
        //实时监听模板id变化
        /*var onMyAmt = function(inputId,spanId){
            //当状态改变的时候执行的函数
            var handle = function (){
                var $spanId = $('#'+spanId);
                var _num = document.getElementById(inputId).value.length;
                var _compare = /^M{1}\d{6}$/;
                if(!_compare.test($('#'+inputId).val())){
                    $spanId.html('<i style="color:#DE2929">当前格式输入有误</i>');
                    return;
                }else{
                    $spanId.html('');
                }
            };
            //firefox下检测状态改变只能用oninput,且需要用addEventListener来注册事件。
            if(/msie/i.test(navigator.userAgent))    //ie浏览器
            {
                $('#'+inputId,$el).on('input propertychange',handle);
            }
            else
            {//非ie浏览器
                $el.on("input",'#'+inputId,handle);
            }
        };*/
        /*
         *
         * 获得子模版并渲染
         * @param type 活动类型
         */
        var getCtype = function(type){
            var $ctypeDom = $('#G-tpl-ctype',$el);
            var selDom = $('#G-drawtype',$el);
            var typeList = $('#G-select',$el);
            var optionArr = [];
            Util.ajax.postJson("src/assets/data/cmpgnTypeCd.json",'', function(json,status){
                if(status){
                    var data = json.object;
                    typeList.html() == '' && Util.ajax.loadTemp(typeList,typeTpl,{'cmpgnType':data});
                    $.each(data,function(i){
                        if(data[i].cmpgnTypeCd == type){
                            if(data[i].cType){
                                $.each(data[i].cType,function(s){
                                    optionArr.push('<option value="'+data[i].cType[s].cmpgnChildTypeCd+'">'+data[i].cType[s].name+'</option>')
                                });
                                selDom.html(optionArr);
                                $ctypeDom.show();
                            }else{
                                $ctypeDom.hide();
                            }
                        }
                    });
                }
            });
        };
        //资源类型选择显示切换
        var changeForm = function (el) {
            clearForm();
            var val = el.val(),
                $quantity = $('#G-quantity',$el);
            val == '03' ? $quantity.show() : $quantity.hide();
            getCtype(val);
        };
        return initialize;
    });