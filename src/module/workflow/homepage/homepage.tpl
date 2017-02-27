<div class="con-title">
    <a href="javascript:;" class="btn btn-blue fn-right mt-10" id="G-addActivity" style="width:130px;">新建营销活动</a>
    <p>
        活动管理
    </p>
</div>
<div class="header-tab-nav" id="G-navTab">
    <ul class="fn-clear">
        <li class="nav-tab active" data-flag=""><a href="javascript:;">全部</a></li>
        <li class="nav-tab" data-flag="03"><a href="javascript:;">未开展</a></li>
        <li class="nav-tab" data-flag="04"><a href="javascript:;">已开展</a></li>
        <li class="nav-tab" data-flag="05"><a href="javascript:;">已结束</a></li>
        <li class="nav-tab" data-flag="01"><a href="javascript:;">草稿箱</a></li>
    </ul>
</div>

<div class="wrap_right_con">
    <div class="all_order">
        <!--查询条件-->
        <div class="search_con jf-form columns-3">
            <form class="J_formSearch">
                <ul class="jf-form-item fn-clear">
                    <li>
                        <label>
                            活动编号：
                        </label>
                        <div>
                            <input type="text" name="cmpgnId">

                        </div>
                    </li>
                    <li>
                        <label>活动名称：</label>
                        <div>
                            <input type="text" name="cmpgnNm">
                            <i class="iconfont icon-tree"></i>
                        </div>
                    </li>
                    <li>
                        <label>活动类型：</label>
                        <div>
                           <select name="cmpgnTypeCd" class="input" id="G-select-list"></select>
                        </div>
                    </li>
                    <li class="width-half datetime timegroup act-list-group">
                        <label>活动有效期：</label>
                        <div>
                            <div>
                                <input name="bgnValidTime" class="wid45" type="text" value="">
                            </div>
                            <div class="c-time-box c-time-right">
                                <input name="endValidTime" class="wid45" type="text" value="">
                            </div>

                        </div>
                    </li>
                    <!--<li id="G-startTime" class="timegroup">
                        <label>活动开始日期：</label>
                        <div>
                            <input type="text"  name="bgnValidTime">
                        </div>
                    </li>
                    <li id="G-endTime">
                        <label>活动结束日期：</label>
                        <div>
                            <input type="text" name="endValidTime">
                        </div>
                    </li>!-->
                    <li>
                        <label></label>
                        <div>
                            <a href="javascript:;" class="btn btn-blue search">搜索</a>
                        </div>
                    </li>
                </ul>
            </form>
        </div>

        <div class="listContent"></div>
        <div class="c-activity-footer fn-clear">
            <!--<div class="btn-group">-->
            	<!--<a href="javascript:;" class="btn">导出</a>-->
            	<!--<a href="javascript:;" class="btn">删除</a>-->
            <!--</div>-->
            <div class="pagination">
            </div>
            <div class="results-num fn-right"></div>
        </div>

    </div>
</div>