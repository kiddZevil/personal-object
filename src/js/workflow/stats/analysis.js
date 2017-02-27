define(['Util',
        'echarts',
        'date',
        'js/workflow/stats/time',
        'text!module/workflow/stats/analysis/statsIndex.tpl',
        'text!module/workflow/stats/analysis/typeSelectOption.tpl',
        'text!module/workflow/stats/analysis/statsJoinList.tpl'],
    function (Util,echarts,Date,times,statsIndex,typeTpl,statsJoinList) {
        //系统变量-定义该模块的根节点
        var $el
            ,_indexModule = null
            ,_param;

        initialize = function(indexModule, param){
            $el = $(statsIndex);
            _indexModule = indexModule;
            _param = param;
            //获取活动类型
            getActType();
            $("#G-lineChart",$el).width($(document).width()-340);


            $el.on("click","#G-search-entirety",loadData);
            $el.on("click",".export-f",exportF);
            $el.on("click","#G-search-join", loadDataJoin);
            $el.on("click",".export-s",exportS);
            $el.on("click","#G-search-res",loadDataRes);
            $el.on("click",".export-t",exportT);

            //三个日期选择器
            $el.on("click","#start", function () {
                laydate(timeBg);
            });
            $el.on("click","#end", function () {
                laydate(timeEn);
            });
            $el.on("click","#start2", function () {
                laydate(timeBg2);
            });
            $el.on("click","#end2", function () {
                laydate(timeEn2);
            });
            $el.on("click","#start3", function () {
                laydate(timeBg3);
            });
            $el.on("click","#end3", function () {
                laydate(timeEn3);
            });
            /*dateTime("#G-date-join","beginDate","endDate");
            dateTime("#G-date-res","beginDate","endDate");*/
            dateNw();
            loadData();
            loadDataJoin();
            loadDataRes();
            //查看资源明细
            $el.on('click','.open-details', function(e){
                operationActivity($(this));
            });

            //将根节点赋值给接口
            this.content = $el;
        };
        //获取活动类型
        var getActType = function(){
            var $typeListDom = $('#G-actType',$el);
            Util.ajax.postJson("src/assets/data/cmpgnTypeCd.json",'', function(json,status){
                if(status){
                    var data = json.object;
                    Util.ajax.loadTemp($typeListDom,typeTpl,{'cmpgnType':data});
                }
            });
        };

        //加载时间控件
        var dateNw = function () {
            var bgDate = laydate.now(-7).substring(0,10);
            var enDate = laydate.now(-1).substring(0,10);
            $('#start',$el).val(bgDate);
            $('#end',$el).val(enDate);
            $('#start2',$el).val(bgDate);
            $('#end2',$el).val(enDate);
            $('#start3',$el).val(bgDate);
            $('#end3',$el).val(enDate);
        };
        var timeBg = {
            elem: '#start',
            name:'bgnValidTime',   //开始日期文本框name
            min: laydate.now(-9999),   //最小日期
            max: laydate.now(-1), //最大日期
            start:laydate.now(-7).substring(0,10),
            format: 'YYYY-MM-DD',   //日期格式
            choose: function(datas){ //选择日期完毕的回调
                timeEn.min = times.getBeforeDate(datas,1);     //设置结束日期的最小限制
                timeEn.start = datas;     //设置结束日期的开始值
            }
        };
        var timeEn = {
            elem: '#end',
            name:'endValidTime',   //开始日期文本框name
            isclear:false,
            min: laydate.now(-7),   //最小日期
            format: 'YYYY-MM-DD',   //日期格式
            choose: function(datas){ //选择日期完毕的回调
                timeBg.max = datas;     //设置开始日期的最大日期
            }
        };
        var timeBg2 = {
            elem: '#start2',
            format: 'YYYY-MM-DD',   //日期格式
            max: laydate.now(-1), //最大日期
            choose: function(datas) { //选择日期完毕的回调
                var endVal = $('#end2', $el);
                var dates = times.getDayArr(datas, endVal.val());
                var dates2 = times.getDayArr(endVal.val(), datas);
                if (dates.length == 0) {
                    endVal.val(times.getBeforeDate(datas, 6).substring(0, 10));
                } else if (dates.length >= 7 || dates2.length > 1) {
                    Util.dialog.openDiv({
                        id: "t1",
                        content: "由于您搜索的时间间隔大于7天，需要进行导出Excel查看，是否导出",
                        modal: 1,
                        okVal: "确定",
                        width: 300,
                        okCallback: function () {
                            exportS();
                            endVal.val(times.getBeforeDate(datas, 6).substring(0, 10));
                        },
                        cancelVal: "取消",
                        cancelCallback: function () {
                            debugger
                            endVal.val(times.getBeforeDate(datas, 6).substring(0, 10));
                        }
                    });
                }
            }
        };
        var timeEn2 = {
            elem: '#end2',
            format: 'YYYY-MM-DD',   //日期格式
            max: laydate.now(-1), //最大日期
            choose: function(datas){ //选择日期完毕的回调
                var endVal = $('#start2',$el);
                var dates = times.getDayArr(endVal.val(),datas);
                var dates2 = times.getDayArr(datas,endVal.val());
                if (dates.length == 0) {
                    endVal.val(times.getBeforeDate(datas,-6).substring(0,10))
                } else if (dates.length >= 7 || dates2.length > 1) {
                    Util.dialog.openDiv({
                        id: "t1",
                        content: "由于您搜索的时间间隔大于7天，需要进行导出Excel查看，是否导出",
                        modal: 1,
                        okVal: "确定",
                        width: 300,
                        okCallback: function () {
                            exportS();
                            endVal.val(times.getBeforeDate(datas,-6).substring(0,10))
                        },
                        cancelVal: "取消",
                        cancelCallback: function () {
                            endVal.val(times.getBeforeDate(datas,-6).substring(0,10))
                        }
                    });
                }
            }
        };
        var timeBg3 = {
            elem: '#start3',
            format: 'YYYY-MM-DD',   //日期格式
            max: laydate.now(-1), //最大日期
            choose: function(datas){ //选择日期完毕的回调
                var endVal = $('#end3',$el);
                var dates = times.getDayArr(datas,endVal.val());
                var dates2 = times.getDayArr(endVal.val(),datas);
                if (dates.length == 0) {
                    endVal.val(times.getBeforeDate(datas, 6).substring(0, 10));
                } else if (dates.length >= 7 || dates2.length > 1) {
                    Util.dialog.openDiv({
                        id: "t1",
                        content: "由于您搜索的时间间隔大于7天，需要进行导出Excel查看，是否导出",
                        modal: 1,
                        okVal: "确定",
                        width: 300,
                        okCallback: function () {
                            exportS();
                            endVal.val(times.getBeforeDate(datas, 6).substring(0, 10));
                        },
                        cancelVal: "取消",
                        cancelCallback: function () {
                            endVal.val(times.getBeforeDate(datas, 6).substring(0, 10));
                        }
                    });
                }
            }
        };
        var timeEn3 = {
            elem: '#end3',
            format: 'YYYY-MM-DD',   //日期格式
            max: laydate.now(-1), //最大日期
            choose: function(datas){ //选择日期完毕的回调
                var endVal = $('#start3',$el);
                var dates = times.getDayArr(endVal.val(),datas);
                var dates2 = times.getDayArr(datas,endVal.val());
                if (dates.length == 0) {
                    endVal.val(times.getBeforeDate(datas,-6).substring(0,10))
                } else if (dates.length >= 7 || dates2.length > 1) {
                    Util.dialog.openDiv({
                        id: "t1",
                        content: "由于您搜索的时间间隔大于7天，需要进行导出Excel查看，是否导出",
                        modal: 1,
                        okVal: "确定",
                        width: 300,
                        okCallback: function () {
                            exportS();
                            endVal.val(times.getBeforeDate(datas,-6).substring(0,10))
                        },
                        cancelVal: "取消",
                        cancelCallback: function () {
                            endVal.val(times.getBeforeDate(datas,-6).substring(0,10))
                        }
                    });
                }
            }
        };
        //活动数量统计接口
        var loadData = function(){
            //判断是否是刚打开页面的默认搜索条件
            var paramStr = $('#G-form-entirety',$el).serialize(); //把form序列化
            var $dom = $("#G-list-1",$el);
            var dataTip = '<tr><td colspan="2"><img src="src/assets/img/no-data.png" style="margin-right:0px;"><h1>暂无数据</h1></td></tr>';
            Util.ajax.getJson("front/sh/campaign!execute?uid=os002",paramStr,function(json,status){
                if (status) {
                    $dom.html('');
                    var beans = json.beans,
                        beansLength = json.beans.length,
                    //饼状图说明分类
                        dataNm=[],
                    //饼状图数据
                        dataCount = [];
                    //如果无数据显示暂无数据
                    if(beansLength == 0){
                        $dom.html(dataTip);
                        dataNm.push('暂无数据');
                        dataCount.push('0');
                    }
                    //添加表格数据及饼状图数据
                    for(var i = 0;i < beansLength; i++){
                        dataNm.push(beans[i].cmpgnStsCdNm);
                        dataCount.push({value:beans[i].cmpgnCount,name:beans[i].cmpgnStsCdNm});
                        $dom.append(
                            '<tr><td>'+
                            beans[i].cmpgnStsCdNm
                            +'</td><td>'+
                            beans[i].cmpgnCount
                            +'</td></tr>');
                    }
                    //建立饼状图
                    var myChart  = echarts.init($('#G-circle',$el).get(0)),
                        option = {
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'horizontal',
                                bottom: '10',
                                data: dataNm
                            },
                            series : [
                                {
                                    name: '活动统计',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '40%'],
                                    data:dataCount,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        };
                    myChart.setOption(option);
                }
            });
        };
        //导出活动数量统计接口
        var exportF = function(){
            var paramStr = $('#G-form-entirety',$el).serialize();
            Util.ajax.postJsonAsync('front/sh/campaign!exportCmpgnStsStat?uid=os002',paramStr,function(json,status) {
                if (status) {
                    window.location.href = json.bean.url;
                }else{
                    Util.dialog.tips('导出失败');
                }
            });
        };
        //导出活动参与信息统计
        var exportS = function(){
            var paramStr = $('#G-form-join',$el).serialize();
            Util.ajax.postJsonAsync('front/sh/campaign!exportCmpgnStsPartStat?uid=m002',paramStr,function(json,status) {
                if (status) {
                    window.location.href = json.bean.url;
                }else{
                    Util.dialog.tips('导出失败');
                }
            });
        };
        //活动参与信息统计
        var loadDataJoin = function(){
            var endDate = $('#end2',$el).val();
            var bgDate = $('#start2',$el).val();
            //获取查询天数的数组
            var dateNum = times.getDayArr(bgDate,endDate),
                dateNumLength = dateNum.length;

            var paramStr = $('#G-form-join',$el).serialize();//把form序列化

            //建立折线图所需数组
            var dataNm = ['浏览人数','浏览次数','参与人数','参与次数'],
                pv = [],
                uv = [],
                orderUserNum = [],
                orderNum = [],
                participateUserNum = [],
                participateNum = [];
            //获取并判断活动类型，是否应该显示下单，typeFlag=0不显示。
            var typeFlag = "0",
                typeCd = $('#G-actType',$el).val();
            if(typeCd=='01' || typeCd=='02' || typeCd=='' || !typeCd){
                typeFlag = "1";
                dataNm = ['浏览人数','浏览次数','参与人数','参与次数','下单人数','下单笔数'];
            }

            Util.ajax.getJson("front/sh/campaign!stat?uid=m002",paramStr,function(json,status){
                if (status) {
                    var beans = json.beans,
                        beansLength = json.beans.length;
                    var mybeans = [];
                    //添加折线图数据
                    for(var j = 0;j < dateNumLength; j++){
                        for(var r = 0;r < beansLength; r++){
                            if(dateNum[j] == beans[r].statDate){
                                pv[j] = beans[r].pv;
                                uv[j] = beans[r].uv;
                                orderUserNum[j] = beans[r].orderUserNum;
                                orderNum[j] = beans[r].orderNum;
                                participateUserNum[j] = beans[r].participateUserNum;
                                participateNum[j] = beans[r].participateNum;
                                break;
                            }else {
                                pv[j] = 0;
                                uv[j] = 0;
                                orderUserNum[j] = 0;
                                orderNum[j] = 0;
                                participateUserNum[j] = 0;
                                participateNum[j] = 0;
                            }
                        }
                        mybeans.push({
                            "avgPtNum": "0",
                            "cmRsPvStatVal": "0",
                            "cmRsUvStatVal": "0",
                            "orderNum": "0",
                            "orderUserNum": "0",
                            "participateNum": "0",
                            "participateUserNum": "0",
                            "pv": "0",
                            "statDate": dateNum[j],
                            "uv": "0"
                        })
                    }

                    //格式化表格信息
                    for(var q = 0;q < mybeans.length; q++){
                        for(var w = 0;w < beansLength; w++){
                            if(mybeans[q].statDate == beans[w].statDate){
                                mybeans[q]={
                                    "avgPtNum": beans[w].avgPtNum,
                                    "cmRsPvStatVal": beans[w].cmRsPvStatVal,
                                    "cmRsUvStatVal": beans[w].cmRsUvStatVal,
                                    "orderNum": beans[w].orderNum,
                                    "orderUserNum": beans[w].orderUserNum,
                                    "participateNum": beans[w].participateNum,
                                    "participateUserNum": beans[w].participateUserNum,
                                    "pv": beans[w].pv,
                                    "statDate": beans[w].statDate,
                                    "uv": beans[w].uv
                                };
                                break;
                            }
                        }
                    }
                    Util.ajax.loadTemp($('#G-list-join',$el),statsJoinList, {"beans":mybeans,"flag":typeFlag});


                    //建立折线图
                    var myChart  = echarts.init($('#G-lineChart',$el).get(0)),

                        option = {
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:dataNm
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: false
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data :dateNum
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value'
                                }
                            ],
                            series : [{
                                name:'浏览人数',
                                type:'line',
                                stack: '总量',
                                data:pv
                            },
                                {
                                    name:'浏览次数',
                                    type:'line',
                                    stack: '总量',
                                    data:uv
                                },
                                {
                                    name:'参与人数',
                                    type:'line',
                                    stack: '总量',
                                    data:participateUserNum
                                },
                                {
                                    name:'参与次数',
                                    type:'line',
                                    stack: '总量',
                                    data:participateNum
                                },{
                                    name:'下单人数',
                                    type:'line',
                                    stack: '总量',
                                    data:orderUserNum
                                },
                                {
                                    name:'下单笔数',
                                    type:'line',
                                    stack: '总量',
                                    data:orderNum
                                }]
                        };


                    myChart.setOption(option);
                }
            });
        };
        //导出营销资源信息统计
        var exportT = function(){
            var paramStr = $('#G-form-res',$el).serialize();
            Util.ajax.postJsonAsync('front/sh/resources!export?uid=001',paramStr,function(json,status) {
                if (status) {
                    window.location.href = json.bean.url;
                }else{
                    Util.dialog.tips('导出失败');
                }
            });
        };
        //营销资源信息统计
        var dateNm1;
        var loadDataRes = function(){
            var  paramStr = $('#G-form-res',$el).serialize();//把form序列化
            Util.ajax.getJson("front/sh/resources!state?uid=001",paramStr,function(json,status){
                if (status) {
                    /*$("#G-list-res").html('');*/
                    var beans = json.beans,
                        bean = json.bean,
                        beansLength = json.beans.length,
                        resId = $('#G-list-res',$el),
                        resNm = ['实物','优惠券','虚拟物品'],
                        dateNm = [],
                        giveQty1 = [],
                        giveQty2 = [],
                        giveQty3 = [],
                        giveQty1result = 0,
                        giveQty2result = 0,
                        giveQty3result = 0;

                    //添加表格数据
                    for(var i = 0;i < beansLength; i++){

                        giveQty1result+=parseInt(beans[i].giveQty01);
                        giveQty2result+=parseInt(beans[i].giveQty02);
                        giveQty3result+=parseInt(beans[i].giveQty03);

                        dateNm.push(beans[i].dateStr);
                        giveQty1.push(beans[i].giveQty01);
                        giveQty2.push(beans[i].giveQty02);
                        giveQty3.push(beans[i].giveQty03);
                    }
                    $('#G-qty-1',$el).text(giveQty1result);
                    $('#G-qty-2',$el).text(giveQty2result);
                    $('#G-qty-3',$el).text(giveQty3result);
                    $('#G-left-1',$el).text(bean.leftQty01);
                    $('#G-left-2',$el).text(bean.leftQty02);
                    $('#G-left-3',$el).text(bean.leftQty03);

                    //建立柱形图
                    var myChart  = echarts.init($('#G-lineChart-1',$el).get(0));
                    option = {
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        legend: {
                            data: resNm
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        yAxis:  {
                            type: 'value'
                        },
                        xAxis: {
                            type: 'category',
                            data: dateNm
                        },
                        series: [
                            {
                                name: '实物',
                                type: 'bar',
                                data: giveQty1
                            },
                            {
                                name: '优惠券',
                                type: 'bar',
                                data: giveQty2
                            },
                            {
                                name: '虚拟物品',
                                type: 'bar',
                                data: giveQty3
                            }
                        ]
                    };
                    myChart.setOption(option);
                    return dateNm1 = dateNm;
                }
            });
        };
        //查看资源明细
        var operationActivity = function(el){
            if(dateNm1 == null){
                return;
            }
            var $this = el
                ,num = dateNm1.length-1
                ,type = $this.closest('td').data('type')
                ,bTime = dateNm1[0]
                ,eTime = dateNm1[num]
                ,param;
            if(type == '01'){
                param = {type:type,bTime:bTime,eTime:eTime};
            }else if(type == '02'){
                param = {type:type,bTime:bTime,eTime:eTime};
            }else if(type == '03'){
                param = {type:type,bTime:bTime,eTime:eTime};
            }

            _indexModule.main.createTab({
                title:'活动数据分析',
                url: 'js/workflow/resManage/resDetail',
                param: param
            });
        };
        return initialize;
    });