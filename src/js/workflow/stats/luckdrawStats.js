define([
    'Util',
    'date',
    'js/workflow/stats/time',
    'text!module/workflow/stats/actAnalysis/actStatsDetails.tpl',
    'text!module/workflow/stats/actAnalysis/actBasicInfo.tpl',
    'text!module/workflow/stats/actAnalysis/luckdrawStats/actStatsInfo.tpl',
    'text!module/workflow/stats/actAnalysis/luckdrawStats/actResStatsInfo.tpl'],
    function (Util,lDate,times,detailsTpl,basicTpl,statsTpl,resTpl) {
        //系统变量-定义该模块的根节点
        var $el
            ,_indexModule = null
            ,_param;
        initialize = function(indexModule, param){
            $el = $(detailsTpl);
            _indexModule = indexModule;
            _param = param;
            //添加标题
            $('#G-activityTit',$el).html(_param.param.activityTit);
            $('#G-back-parent',$el).html(_param.param.backTit);
            //初始化查询时间
            var getSecTime = times.queryTime(_param.param.bTime, _param.param.eTime);
            //时间插件
            dateTime(getSecTime[0],getSecTime[1]);
            //活动统计分析信息
            basicInfo(getSecTime[0],getSecTime[1]);
            //搜索事件
            $el.on('click','.search',function(){
                basicInfo($('input[name="beginDate"]').val(),$('input[name="endDate"]').val());
            });
            $el.on("click",".export",exportActInfo);
            this.content = $el;
        };
        //导出活动数据分析
        var exportActInfo = function(){
            var paramStr = $('.J_formSearch',$el).serialize();
            Util.ajax.postJsonAsync('front/sh/campaign!exportCampgnOverallStat?uid=tj008&cmpgnId=' +_param.param.actId +'&cmpgnTypeCd=' + _param.param.activityType,paramStr,function(json,status) {
                if (status) {
                    window.location.href = json.bean.url;
                }else{
                    Util.dialog.tips('导出失败');
                }
            });
        };
        var basicInfo = function(bTime,eTime){
            var param = {
                cmpgnId: _param.param.actId,
                cmpgnTypeCd: _param.param.activityType,
                beginDate: bTime,
                endDate: eTime
            };
            Util.ajax.postJson("front/sh/campaign!execute?uid=tj008", param, function(json,status){
                if(status){
                    var bean = json.bean
                        ,beans = json.beans;
                    Util.ajax.loadTemp($('#G-details-basicInfo',$el), basicTpl, {"bean":bean});
                    Util.ajax.loadTemp($('#G-details-statsInfo',$el), statsTpl,{"beans":beans,"time": times.getDayArr(bTime,eTime)});
                    //资源
                    resourcesInfo(bTime,eTime);
                }
            });
        };
        //时间插件
        var dateTime = function(bTime,eTime){
            new lDate( {
                el:$('.datetime',$el),
                label: '活动开始时间：',
                mid: '活动结束时间：',
                double:{    //支持一个字段里显示两个日期选择框
                    start:{
                        format: 'YYYY-MM-DD' + " 00:00:00",   //日期格式
                        value:bTime.substring(0,10) + " 00:00:00",
                        name:'beginDate',   //开始日期文本框name
                        min: bTime,   //最小日期
                        max: eTime, //最大日期
                        istoday: false,
                        choose: function(dates){
                            this.end.min = times.getBeforeDate(dates,1);     //设置结束日期的最小限制
                            this.end.start = dates;     //设置结束日期的开始值
                            this.end.max = times._dateFn(dates,eTime);
                        }
                    },
                    end:{
                        value:eTime.substring(0,10) + " 23:59:59",
                        name:'endDate',     //结束日期文本框name
                        format: 'YYYY-MM-DD' + " 23:59:59",   //日期格式
                        min: bTime,   //最小日期
                        max: eTime, //最大日期
                        istoday: false,
                        choose: function(dates){
                            this.start.max = dates;     //设置开始日期的最大日期
                        }
                    }
                }
            });

        };
        //资源使用分析
        var resourcesInfo = function(bTime,eTime){
            var param = {
                'cmpgnId': _param.param.actId,
                'beginDate': bTime,
                'endDate' : eTime
            };
            Util.ajax.postJson("front/sh/luckdraw!execute?uid=lu008", param, function(json,status){
                status = true;
                if(status){
                    var tdTit = ['中奖人数','中奖次数','奖品发放量'],
                        lineNm = [], //抽奖等级名称
                        resSum = 0, //奖品类别个数
                        lineResNum = [], //各等级奖品种类数
                        resNm = [], //各等级下奖品资源名称
                        object = json.object,
                        eq = 0,
                        winCnt = [], // 中奖次数
                        winPeople = [], // 中奖人数
                        prizeAmount = [], // 奖品发放量
                        resStateArr = []; // 资源分析整合数据
                    $.each(object, function(i,obj){
                        var nm = [];
                        lineNm.push(object[i].beans[0].lvlNm);
                        resSum += parseInt(object[i].beans.length);
                        $.each(object[i].beans ,function(s,obj){
                            eq++;
                            var lineShow
                                ,prizeNum;
                            lineShow = (s != '0') ? '' : '1';
                            prizeNum = object[i].beans.length;
                            nm.push({
                                "index": eq,
                                'lineShow': lineShow,
                                'prizeNum':prizeNum,
                                'nav':'',
                                'tit': object[i].beans[s].lvlNm,
                                'prize': object[i].beans[s].rsNm,
                                'rowspan':''
                            });
                            winCnt.push(object[i].beans[s].WinCnt);
                            winPeople.push(object[i].beans[s].winPeople);
                            prizeAmount.push(object[i].beans[s].WinCnt);
                        });
                        resNm.push(nm);
                        lineResNum.push(nm.length);
                    });
                    resStateArr.push(winPeople,winCnt,prizeAmount);
                    var nav;
                    var tdArr = [];
                    for(var l = 0; l < 3; l++){
                        var _tdArr = {};
                        var _rowspan;
                        var _tRowspan;
                        $.each(resNm, function(i,v){
                            $.each(resNm[i], function(k,vl){
                                resNm[i][k]["nav"] = tdTit[l];

                                if(resNm[i][k]['index'] == 1){
                                    _rowspan = parseInt(resSum);
                                    _tRowspan = parseInt(resNm[i][k]["prizeNum"]);
                                }
                                if(resNm[i][k]['index'] > 1 && resNm[i][k]['lineShow'] != ''){
                                    _rowspan = '';
                                    _tRowspan = parseInt(resNm[i][k]["prizeNum"]);
                                }

                                _tdArr = {
                                    "index": resNm[i][k]['index'],
                                    'lineShow': resNm[i][k]['lineShow'],
                                    'prizeNum': resNm[i][k]['prizeNum'],
                                    'nav': resNm[i][k]["nav"],
                                    'tit': resNm[i][k]['tit'],
                                    'prize': resNm[i][k]['prize'],
                                    'tRowspan': _tRowspan,
                                    'rowspan': _rowspan
                                };
                                tdArr.push(_tdArr);
                            });

                        });

                    }
                    Util.ajax.loadTemp($('#G-act-resStats',$el), resTpl, {"leftTbArr":tdArr,'time':times.getDayArr(bTime,eTime),"rightTbArr":resStateArr});
                }
            });
        };

        return initialize;
    });