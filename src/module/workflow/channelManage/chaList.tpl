<!--title begin-->
<div class="con-title">
    <a href="javascript:;" class="btn btn-blue fn-right mt-10" id="newChaBtn" style="width:130px;">新建渠道</a>
    <p>
        <!--<a href="javascript:;">系统管理</a>
        <b>></b>
        <span>渠道管理</span>!-->
        渠道管理
    </p>


</div>
<!--title end-->
<!--右侧主体内容begin-->
<div class="wrap_right_con">
    <div class="all_order channel-manage">
    <form class="J_formSearch" onsubmit="return false">
        <div class="search-box search_con clear mb-15">
           <div class="key-type mr-15">
               渠道编码：
               <input type="text" class="search-input" name="mktgChnlId">
           </div>
            <div class="search-key mr-15">
                渠道名称：
                <input type="text" class="search-input" name="mktgChnlNm">
            </div>
            <a href="javascript:;" class="btn btn-blue mr-5" id="G-searchBox">搜索</a>



        </div>
        </form>
             <!--查询结果表格-->
        <div class="search-result sn-list  mt-20"> </div>
          <!--分页-->
          <div class="pagination mt-10"></div>
          <div class="results-num fn-right mt-10"></div>
    </div>
</div>