<div class="con-title">
    <p>
        资源发放明细
    </p>
</div>
<div class="wrap_right_con">
    <div class="z-container border-box">
        <!--查询条件-->
        <div class="search_con jf-form columns-4">
            <form class="J_formSearch">
                <ul class="jf-form-item fn-clear">
                    <li class="width-half datetime timegroup z-time-width">
                    </li>
                    <li>
                        <label title="活动名称">活动名称：</label>
                        <div>
                            <input type="text" name="cmpgnNm">
                        </div>
                    </li>
                    <li>
                        <label title="发放状态">发放状态：</label>
                        <div>
                            <select name="ntcStsCd">
                                <option value="">全部</option>
                                <option value="00">通知失败</option>
                                <option value="01">已通知</option>
                                <option value="02">已发放</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <label title="活动类型">活动类型：</label>
                        <div>
                            <select name="cmpgnTypeCd" id="G-select-list">
                               <!-- <option value="">全选</option>
                                <option value="01">团购</option>
                                <option value="02">秒杀</option>
                                <option value="03">抽奖</option>
                                <option value="04">签到</option>
                                <option value="05">宣传</option>-->
                            </select>
                        </div>
                    </li>
                    <li>
                        <label title="资源类型">资源类型：</label>
                        <div>
                            <select id="G-type" name="rsTypeCd">
                                <option value="">全部</option>
                                <option value="01">实物</option>
                                <option value="02">优惠券</option>
                                <option value="03">虚拟物品</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <label title="资源名称">资源名称：</label>
                        <div>
                            <div>
                                <input type="text" name="rsNm">
                            </div>
                        </div>
                    </li>
                    <li>
                        <label></label>
                        <div>
                            <a href="javascript:;" class="btn btn-blue search">搜索</a>
                        </div>
                    </li>
                </ul>
            </form>
        </div>
        <div class="sn-list fn-clear mt-15">
            <table>
                <thead>
                <tr>
                    <th width="150">活动编号</th>
                    <th>活动名称</th>
                    <th width="60">活动类型</th>
                    <th>资源名称</th>
                    <th width="60">资源类型</th>
                    <th>发放号码</th>
                    <th width="60">是否发放</th>
                    <th>发放时间</th>
                </tr>
                </thead>
                <tbody id="G-listCon">

                </tbody>
            </table>
            <div class="pagination">
            </div>
            <div class="results-num fn-right"></div>
        </div>

    </div>
</div>