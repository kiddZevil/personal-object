//创建活动下拉选择活动类型
define(['Util'
        ,"text!module/workflow/activity/selTool.tpl"],
    function (Util,toolTpl) {
        TOOL_TPL = Util.hdb.compile(toolTpl);
    var initialize = function (option) {
        this.option = $.extend({
            el:""
            ,url:"src/assets/data/cmpgnTypeCd.json" //活动类型接口
        },option);
        this.$pEl = this.option.pEl; // 一级插入
        this.$cEl = this.option.cEl; // 二级插入
        this.disFlag = this.option.disFlag; //是否禁止切换
        this.pType = this.option.pType; // 活动类型
        this.cType = this.option.cType; // 子活动类型
        this.url = this.option.url; // 工具配置
        this.edit = this.option.edit; //是否编辑
        this.disChildren = this.option.disChildren; //是否显活动示子类型
        this.cFn = this.option.cFn;
        this.init();
    };
    $.extend(initialize.prototype,{
        init : function(){
            var _this = this;
            _this.load();
        }
        //加载默认数据
        ,load : function(){
            var _this = this;
            Util.ajax.postJson(_this.url,'',function (json,status) {
                if(status){
                    var object = json.object;
                    _this.$pEl.html(TOOL_TPL({object:object})).find('select').val(_this.pType); //渲染一级列表
                    if (_this.edit || _this.disFlag != '1') {
                        _this.$pEl.find('select').attr('disabled', 'disabled');
                    }
                    _this.selOpt(object, _this.pType, _this.cType);
                    _this.changeEven(object);
                }
            })
        }
        /*
        * 更换父节点值
        * object: 配置数据
        * pType： 一级选中值
         */
        ,changeEven : function(object){
            var _this = this;
            _this.$pEl.on('change',function(){
               var selVal =  $(this).find('option:selected').val(); //选中option值
                if(selVal != _this.pType){
                    _this.pType = selVal;
                    _this.selOpt(object, selVal);
                }
            })
        }
        /*
         * 根据父节点显示子节点
         * object: 配置数据
         * pType: 一级选中值
         * cType: 二级选中值
         */
        ,selOpt : function(object, pType, cType){
            var _this = this;
            $.each(object,function(i){
                if(object[i].cmpgnTypeCd == pType){
                    if(!!object[i].cType && !_this.disChildren) {
                        _this.$cEl.closest('.c-form-group').show();
                        _this.$cEl.html(TOOL_TPL({beans: object[i].cType})).find('select').val(cType ? cType : object[i].cType[0].cmpgnChildTypeCd);
                        (_this.cFn && typeof(_this.cFn) === "function") && _this.cFn();
                        if (_this.edit || _this.disFlag != '1') {
                            _this.$cEl.find('select').attr('disabled', 'disabled');
                        }
                    }else{
                        _this.$cEl.closest('.c-form-group').hide();
                    }
                }
            });
        }
    });
    return function (opt) {
        new initialize(opt)
    };
});





