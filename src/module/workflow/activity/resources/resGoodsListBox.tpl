<div class="sn-list fn-clear c-activity-list" style="position: relative">
    <div class="res-pop-search">
        <div class="search-key mr-5">
            <lable>资源名称：</lable>
            <input type="text" class="search-input" name="" placeholder="请输入资源名称">
        </div>
        <a href="javascript:;" class="btn btn-blue mr-5" id="G-searchBox">搜索</a>
        <a href="javascript:;" class="btn btn-blue ml-5" id="G-resetBox">重置</a>
    </div>
    <div style="height: 310px;">
        <table style="margin-bottom: 20px;margin-top: 10px;">
            <thead>
            <tr>
                <th class="c-tb-checkbox"><input type="checkbox" name="selectAll" /></th>
                <th width="10%">资源类型</th>
                <th>资源名称</th>
                <th width="12%">资源价格</th>
                <th width="10%">资源数量</th>
                <th width="21%">创建时间</th>
            </tr>
            </thead>
            <tbody id="G-resGoodsList">

            </tbody>
        </table>
        <div class="pagination"></div>
        <div class="results-num fn-right"></div>
    </div>
    <div class="c-btn-box" style="bottom: -35px; position: absolute">
        <div>
            <a href="javascript:;" class="btn btn-blue" id="G-addResGoods">确认</a>
            <a href="javascript:;" class="btn" id="G-close">取消</a>
        </div>
    </div>
</div>