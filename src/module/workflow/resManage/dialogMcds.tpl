    
      
    <div class="sn-list fn-clear c-activity-list" style="position: relative">
    <form class="G-form">
        <div class="res-pop-search">
            <div class="search-key mr-5">
                <lable>商品编码：</lable>
                <input type="text" class="search-input" name="mcdsId" placeholder="请输入资源名称">
            </div>
            <div class="search-key mr-5">
                <lable>商品名称：</lable>
                <input type="text" class="search-input" name="mcdsNm" placeholder="请输入资源名称">
            </div>
            <a href="javascript:;" class="btn btn-blue mr-5" id="G-searchBox">搜索</a>
            <a href="javascript:;" class="btn btn-blue ml-5" id="G-resetBox">重置</a>
        </div>
    </form>
    <div style="height: 280px;margin-bottom:15px; overflow-y:auto">
	    <table>
	        <thead>
	        <tr>
	            <th width="40">选择</th>
	            <th>商品编码</th>
	            <th>商品名称</th>	         
	            <!-- <th class="fn-text-center">类型</th> -->
	            <th width="100">类目</th>
	            <th width="100">价格</th>
	            <th width="120">渠道/店铺</th>
	        </tr>
	        </thead>
	        <tbody id="G-listCon">
	        </tbody>
	    </table>
	 </div>
	    <div class="pagination"></div>
	    <div class="results-num fn-right"></div>
  <div class="fn-clear"></div>
    <div class="c-btn-box">
        <div>
            <a href="javascript:;" class="btn btn-blue" id="G-addResGoods">确定</a>
            <a href="javascript:;" class="btn" id="G-close">取消</a>
        </div>
    </div>
</div>