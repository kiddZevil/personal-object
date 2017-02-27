/**
 * Created by kidd on 2016/11/2.
 */
define(['Util',
        'text!module/workflow/activity/signIn/dialogMcds.tpl',
        'text!module/workflow/activity/signIn/mcdsList.tpl'
],
    function (Util,Tpl,listTpl) {
        var $el = $(Tpl),  //系统变量-定义该模块的根节点
            _indexModule = null,  //系统变量-构造函数
            selRes = [],
            _param;
        initialize = function(indexModule, param){
            _indexModule = indexModule;
            _param = param;
            resList();
          //筛选
            $el.on('click','#G-searchBox',function(){
                var rsNm = $('.search-input',$el).val();
                resList(rsNm);
            });
            //重置
            $el.on('click','#G-resetBox',function(){
                $('.search-input',$el).val('');
                resList();
            });          
            //商品选择按钮
            $el.on('click','#G-addResGoods', function () {
                var $thisId = $('#'+_param.thisId),
                    rsPicPath = $thisId.find('.rsPicPath'),
                    inputId = $thisId.find('input[name="cmpgnRsId"]'),
                    inputNm = $thisId.find('input[name="rsNm"]'),
                    inputQty = $thisId.find('input[name="leftQty"]'),
                    signGoods = $thisId.find('.sign-rule-goods');
                $('input[name="addMcds"]').each(function(){
                    var $this = $(this);
                    var parentTr = $(this).closest('tr');
                    if($this.is(":checked")){
                        signGoods.show();
                        inputId.val($this.data('id'));
                        inputNm.val(parentTr.find('.rsNm').text());
                        inputQty.val(parentTr.find('.leftQty').text());
                        if(parentTr.data('url')==''){                       	
                        	rsPicPath.attr('src','src/assets/img/noImg.png');
                        }else{
                        	rsPicPath.attr('src',parentTr.data('url'));
                        }
                        
                        Util.dialog.close('G-mcdsDialog');
                        return;
                    }
                    //TODO  如 何让其不显示
                    /*else{
                    	Util.dialog.tips("请选择商品");
                    }*/
                });
            });
            //弹窗取消按钮
            $el.on('click','#G-close', function () {
                Util.dialog.close('G-mcdsDialog');
            });
            //将根节点赋值给接口
            this.content = $el;
        };
        //获取列表
        var resList = function(rsNm){
        	if(!rsNm ){
                rsNm = ''
            }
            var G_params = {
                url : 'front/sh/resources!index?uid=sm001&rsTypeCd=03&rsNm='+encodeURI(rsNm),
                items_per_page : 6 ,                        //每页数  @param : limit
                page_index : 0 ,                            //当前页  @param : start
                pagination : $('.pagination',$el) ,         //分页id
                searchformId : $('.J_formSearch',$el),      //搜索表单的id
                tabletpl :Util.hdb.compile(listTpl), //表格模板
                tablewrap : $('#G-listCon',$el),//表格容器
                pageCallback:function(){             
                	$('#G-listCon tr').click(function(){
                        $(this).find('input[name="addMcds"]').prop("checked", true);
                    });
                    }
            };           
            Util.ajax.pagination(G_params.page_index , true , G_params);
        };
        return initialize;
    });