/**
 * Created by kidd on 2016/11/2.
 */
define(['Util',
        'text!module/workflow/resManage/dialogMcds.tpl',
        'text!module/workflow/resManage/mcdsList.tpl'
],
    function (Util,Tpl,listTpl) {
        var $el = $(Tpl),  //系统变量-定义该模块的根节点
            mcdsRes = [],
            _indexModule = null,  //系统变量-构造函数
            _param;
        initialize = function(indexModule, param){
            _indexModule = indexModule;
            _param = param;
            resList();
          //筛选
            $el.on('click','#G-searchBox',function(){
            	
                var data = {
                		mcdsId:	$('input[name="mcdsId"]',$el).val(),
                		mcdsNm:	$('input[name="mcdsNm"]',$el).val(),
                };                           
                resList(data);
            });
            //重置
            $el.on('click','#G-resetBox',function(){
                $('.search-input',$el).val('');
                resList();
            });    
            
            //商品选择按钮
            $el.on('click','#G-addResGoods', function () {
                mcdsRes = [];
                var $this = $(this),
                    parentTr = $this.closest('tr');
                $('input[name="addMcds"]').each(function(){
                    var $this = $(this);
                    var parentTr = $(this).closest('tr');
                    if($this.is(":checked")){                 
                        $('input[name="mcdsId"]').val(parentTr.find('.mcdsId').text());
                        $('input[name="prodUprc"]').val(parentTr.find('.prodUprc').text());
                        $('input[name="mrctId"]').val(parentTr.find('.mrctId').text());
                        $('input[name="shopNm"]').val(parentTr.find('.shopNm').text());
                        $('input[name="srcSysId"]').val(parentTr.data("id"));
                        $('input[name="mcdsNm"]').val(parentTr.find('.mcdsNm').text());
                        $('input[name="rsNm"]').val(parentTr.find('.mcdsNm').text());
                        $('input[name="preprQty"]').val(parentTr.find('.preprQty').text());
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
        var resList = function(data){
        	if(!data ){
        		var data = {
        				mcdsNm:'',
        				mcdsId:''
        		}
            }
            var G_params = {
                url : 'front/sh/resources!index?uid=r001&mcdsNm='+encodeURI(data.mcdsNm)+'&mcdsId='+data.mcdsId,
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