<div class="c-article c-step-two" id="G-stepTwo">
    <div class="c-section">
        <input type="hidden" name="cmpgnStsCd">
        <div class="c-section-header">
            <span class="c-section-tit">规则配置</span>
            <a href="javascript:;" class="btn btn-green fn-right mt-5" id="G-addGroupRule">添加资源</a>
        </div>
        <div class="c-section-con sn-list mt-10 c-bg-white c-td-border c-res-table c-table-center">
            <table>
                <thead>
                    <tr>
                        <th width="13%">开始时间</th>
                        <th width="13%">结束时间</th>
                        <!--<th class="fn-hide" width="10%">是否限购</th>!-->
                        <th width="12%">商品</th>
                        <th width="10%">规格</th>
                        <!--<th width="10%">组件ID</th>!-->
                        <th width="5%">数量</th>
                        <th width="8%">原价</th>
                        <th width="8%">秒杀价</th>
                        <th width="6%">操作</th>
                    </tr>
                </thead>
                <tbody id="G-actTable" class="seckill-tbody"></tbody>
            </table>
            <div class="res-empty-tip" id="G-resTip">
                快来添加点活动资源吧~
            </div>
        </div>
    </div>

    <div class="c-section">
        <div class="c-section-header">
            <span class="c-section-tit">模版配置</span>
        </div>
        <div class="c-section-con">
            <div id="tempList90" class="c-section-con"></div>
        </div>
        <div class="c-section-con">
            <div class="c-form-group mt-15 c-textarea-rule">
                <label><b class="must-tip">*</b> 活动规则说明</label>
                <textarea class="c-form-control" name="cmpgnRuleCntt" maxlength="2000"  rows="3" placeholder="请输入活动规则"></textarea>
                <span class="c-form-tips"></span>
            </div>
        </div>
    </div>

    <div>
        <a href="javascript:;" class="btn" id="G-prevStepOne">上一步</a>
        <a href="javascript:;" data-type="01" class="btn btn-blue" id="G-act-save">下一步</a>
    </div>
</div>
