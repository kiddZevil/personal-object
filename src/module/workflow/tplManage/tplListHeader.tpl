 <div class="con-title">
    <p>
        模板列表
     	<a id="G-newRes" class="btn btn-blue fn-right mt-10">新建模板</a>
    </p>
</div>
<div class="wrap_right_con">
    <div class="z-container border-box">
        <!--查询条件-->
        <div class="jf-form columns-4 search_con">
            <form class="J_formSearch">
                <ul class="jf-form-item fn-clear">
                    <li>
                        <label title="模板类型">模板类型：</label>
                        <div>
                            <select name="cmpgnTypeCd" id="G-select-list">
                            	<!--<option value>全部</option>
                                <option value = "01">团购</option>
                                <option value = "02">秒杀</option>
                                <option value = "03">抽奖</option>
                                <option value = "04">签到</option>
                                <option value = "05">宣传</option>
                                <option value = "06">互动</option>-->
                            </select>
                        </div>
                    </li>                   
                    <li>
                        <div style="min-width:120px;padding:6px 0;">
                            <a class="btn btn-blue search fn-right">搜索</a>
                        </div>
                    </li>
                </ul>
            </form>
        </div>
        <div class="sn-list fn-clear mt-15">
            <table>
                <thead>
                    <tr>
                        <th width="12%">营销类型</th>
                        <th width="120">模板图片</th>
                        <th>模板名称</th>
                        <th width="12%">模板类型</th>
                        <th width="10%">状态</th>
                        <th width="14%">操作</th>
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