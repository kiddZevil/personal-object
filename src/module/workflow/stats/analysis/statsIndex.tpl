
<div class="con-title">
    <p>概览分析
    </p>
</div>
<div class="wrap_right_con">
    <div class="all_order fn-clear" id="G-toollist">
        <div class="c-section fn-clear">
            <div class="c-section-header c-bg-gary">
                <span class="c-section-tit c-ml15 c-nobd">平台整体信息</span>
            </div>
            <div class="search_con jf-form columns-4">
                <form id="G-form-entirety" class="J_formSearch">
                    <ul class="jf-form-item fn-clear">
                        <li>
                            <label>开始时间：</label>
                            <div>
                                <input name="bgnValidTime" id="start" readonly/>
                            </div>

                        </li>
                        <li>
                            <label>结束时间：</label>
                            <div>
                                <input name="endValidTime" id="end"  readonly/>
                            </div>
                        </li>
                        <li style="width: 40%">
                            <div class="c-more-btn">
                                <a href="javascript:;" id="G-search-entirety" class="btn btn-blue search">搜索</a>
                                <a href="javascript:;" class="btn btn-green export-f">导出</a>
                            </div>
                        </li>
                    </ul>
                </form>

            </div>
            <div class="c-section-con" style="position: relative">
                <div class="fn-left">
                    <div id="G-circle" style="width: 400px;height:280px;"></div>
                </div>
                <div class="fn-left" style="position: absolute;left:400px; min-width:460px">
                    <!--<div class="pb-15 pt-5 fn-right">
                        <input class="analysis-input mr-15"/><a href="#" class="btn btn-blue">搜索</a>
                    </div>-->
                    <table cellspacing="0" cellpadding="0" width="100%" class="m-table mt-20">
                        <thead class="analysis-tbody">
                        <tr class="col-name">
                            <th class="fn-txt-center">状态</th>
                            <th class="fn-txt-center">数量</th>
                        </tr>
                        </thead>

                        <tbody id="G-list-1" class="analysis-tbody">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="c-section">
            <div class="c-section-header c-bg-gary">
                <span class="c-section-tit c-ml15 c-nobd">营销活动参与信息</span>
            </div>
            <div class="search_con jf-form columns-4 fn-clear">
                <form class="J_formSearch" id="G-form-join">
                    <ul class="jf-form-item fn-clear">
                        <li>
                            <label>开始时间：</label>
                            <div>
                                <input name="beginDate" id="start2"  readonly/>
                            </div>

                        </li>
                        <li>
                            <label>结束时间：</label>
                            <div>
                                <input name="endDate" id="end2"  readonly />
                            </div>
                        </li>
                        <li>
                            <label title="资源类型">活动类型：</label>
                            <div>
                                <select id="G-actType" name="cmpgnTypeCd"></select>
                            </div>
                        </li>
                        <li>
                            <label title="资源类型">活动状态：</label>
                            <div>
                                <select id="G-join-type" name="cmpgnStsCd">
                                    <option value="">全选</option>
                                    <option value="01">草稿</option>
                                    <option value="02">待审核</option>
                                    <option value="03">未开展</option>
                                    <option value="04">已开展</option>
                                    <option value="05">已结束</option>
                                </select>
                            </div>
                        </li>

                    </ul>
                    <div class="fn-right">
                        <div class="c-more-btn" style="padding-left: 0">
                            <a id="G-search-join" href="javascript:;" class="btn btn-blue search">搜索</a>
                            <a href="javascript:;" class="btn btn-green export-s">导出</a>
                        </div>
                    </div>
                </form>
            </div>

            <div class="fn-clear mt-15">
                <table cellspacing="0" cellpadding="0" width="100%" class="m-table mt-10">
                    <thead class="analysis-tbody">
                    <tr class="col-name">
                        <th class="fn-txt-center">日期</th>
                        <th class="fn-txt-center">浏览人数</th>
                        <th >浏览次数</th>
                        <th>参与人数</th>
                        <th>参与次数</th>
                        <th>下单人数</th>
                        <th>下单笔数</th>
                        <th>人均参与次数</th>
                    </tr>
                    </thead>
                    <tbody id="G-list-join" class="analysis-tbody">

                    </tbody>
                </table>
            </div>
            <div style="width:1000px;height:400px;" class="mt-15 " id="G-lineChart"></div>
        </div>
        <div class="c-section">
            <div class="c-section-header c-bg-gary">
                <span class="c-section-tit c-ml15 c-nobd">营销资源信息</span>
            </div>
            <div class="search_con jf-form columns-4">
                <form id="G-form-res" class="J_formSearch">
                    <ul class="jf-form-item fn-clear">
                        <li>
                            <label>开始时间：</label>
                            <div>
                                <input name="beginDate" id="start3"  readonly />
                            </div>

                        </li>
                        <li>
                            <label>结束时间：</label>
                            <div>
                                <input name="endDate" id="end3"  readonly />
                            </div>
                        </li>
                        <li style="width: 40%">
                            <div class="c-more-btn">
                                <a id="G-search-res" href="javascript:;" class="btn btn-blue search">搜索</a>
                                <a href="javascript:;" class="btn btn-green export-t">导出</a>
                            </div>
                        </li>
                    </ul>
                </form>
            </div>
            <div class="fn-clear mt-15">
                <table cellspacing="0" cellpadding="0" width="100%" class="m-table mt-10">
                    <thead class="analysis-tbody">
                    <tr class="col-name">
                        <th>资源类型</th>
                        <th>发放数量</th>
                        <th>剩余数量</th>
                        <th>发放/使用明细</th>
                    </tr>
                    </thead>
                    <tbody id="G-list-res" class="analysis-tbody">
                    <tr>
                        <td>实物</td>
                        <td id="G-qty-1"></td>
                        <td id="G-left-1"></td>
                        <td data-type="01"><a class="open-details btn-link" href="javascript:;">查看</a></td>
                    </tr>
                    <tr>
                        <td>优惠券</td>
                        <td id="G-qty-2"></td>
                        <td id="G-left-2"></td>
                        <td data-type="02"><a class="open-details btn-link" href="javascript:;">查看</a></td>
                    </tr>
                    <tr>
                        <td>虚拟物品</td><td id="G-qty-3"></td>
                        <td id="G-left-3"></td>
                        <td data-type="03"><a class="open-details btn-link" href="javascript:;">查看</a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style="width:100%;height:400px;" class="mt-15 " id="G-lineChart-1"></div>
        </div>
    </div>
</div>