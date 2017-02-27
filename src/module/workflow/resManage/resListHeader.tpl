 <div class="con-title">
    <p>
        资源列表
     	<a id="G-newRes" class="btn btn-blue fn-right mt-10">新建资源</a>
    </p>
</div>
<div class="wrap_right_con">
    <div class="z-container border-box">
        <!--查询条件-->
        <div class="jf-form columns-4 search_con">
            <form class="J_formSearch">
                <ul class="jf-form-item fn-clear">
                    <li>
                        <label title="资源类型">资源类型：</label>
                        <div>
                            <select name="rsTypeCd">
                            	<option value>全部</option>
                                <option value = "01">实物</option>
                                <option value = "03">虚拟商品</option>
                                <option value = "02">优惠券</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <label title="资源名称">资源名称：</label>
                        <div>
                            <input name="rsNm" type="text">
                        </div>
                    </li>
                    <li>
                        <label title="资源状态">资源状态：</label>
                        <div>
                            <select name="validStsCd">
                            	<option value>全部</option>
                                <option value = "1">已开启</option>
                                <option value = "0">已停用</option>                              
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
                        <th width="60">资源类型</th>
                        <th width="80">资源图片</th>
                        <th>资源名称</th>
                        <th width="120">创建时间</th>
                        <th width="60">数量</th>
                        <th width="60">剩余</th>                       
                        <th width="60">状态</th>
                        <th width="96">创建人</th>
                        <th width="70">操作</th>
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