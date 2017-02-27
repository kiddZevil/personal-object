<div class="t-tabs mt-15">
    <a href="javascript:;" class="btn btn-green" data-flag="0" id="G-changeNavTit">修改奖项标题</a>
    <ul class="t-tabs-items">
        {{#if editFlag}}
            {{#if object}}
                {{#compare onceMore "==" '0'}}
                    {{#each object}}
                        {{#compare @index "==" ../len}}
                            <li class="prize-tab-name fn-hide">
                                <a href="javascript:;" class="prize-name">输入名称</a>
                                <input type="text" name="lvlNm" value="输入名称" class="fn-hide c-form-control">
                            </li>
                        {{else}}
                            <li class="{{active @index}} prize-tab-name">
                                <a href="javascript:;" class="prize-name">{{bean.lvlNm}}</a>
                                <input type="text" name="lvlNm" value="{{bean.lvlNm}}" class="fn-hide c-form-control">
                            </li>
                        {{/compare}}
                    {{/each}}
                {{else}}
                    {{#each object}}
                        {{#compare @index "!=" ../len}}
                            <li class="{{active @index}} prize-tab-name">
                                <a href="javascript:;" class="prize-name">{{bean.lvlNm}}</a>
                                <input type="text" name="lvlNm" value="{{bean.lvlNm}}" class="fn-hide c-form-control">
                            </li>
                        {{else}}
                            <li class="prize-tab-name fn-hide">
                                <a href="javascript:;" class="prize-name">再来一次</a>
                                <input type="text" name="lvlNm" value="再来一次" class="fn-hide c-form-control">
                            </li>
                        {{/compare}}
                    {{/each}}
                {{/compare}}
            {{/if}}
        {{else}}
            {{#if beans}}
                {{#each beans}}
                    {{#compare @index "!=" ../len}}
                        <li class="{{active @index}} prize-tab-name">
                            <a href="javascript:;" class="prize-name">{{prizeTit @index}}</a>
                            <input type="text" name="lvlNm" value="{{prizeTit @index}}" class="fn-hide c-form-control">
                        </li>
                    {{else}}
                        <li class="prize-tab-name fn-hide">
                            <a href="javascript:;" class="prize-name">再来一次</a>
                            <input type="text" name="lvlNm" value="再来一次" class="fn-hide c-form-control">
                        </li>
                    {{/compare}}
                {{/each}}
            {{/if}}
        {{/if}}
    </ul>
    <ul class="t-tabs-wrap">
        <!-- 当前内容 -->
        {{#if editFlag}}
            {{#if object}}
                {{#each object}}
                    <li class="{{selected @index}}">
                        <div class="form-horizontal form-prize mt-20">
                            <div class="control-group">
                                <label class="control-label"><b class="must-tip">*</b>中奖概率：</label>
                                <div class="controls">
                                    <input class="input" type="text" name="winprzRate" value="{{bean.winprzRate}}" onkeyup="this.value=(this.value.match(/\d+(\.\d{0,2})?/)||[''])[0]">
                                </div>
                                <span class="c-form-tips ml-10">%</span>
                            </div>
                            <div class="control-group">
                                <label class="control-label">奖品数量：</label>

                                    {{#compare @index "!=" ../allLen}}
                                        <div class="controls disabled">
                                            <input class="input" name="prizeItemQty" type="text" disabled value="{{bean.prizeItemQty}}">
                                        </div>
                                    {{else}}
                                        <div class="controls">
                                            <input class="input" name="prizeItemQty" type="text" value="{{bean.prizeItemQty}}" onkeyup="this.value=this.value.replace(/\D/g,'')">
                                        </div>
                                    {{/compare}}

                                <span class="c-form-tips ml-10">
                                    {{#compare @index "!=" ../allLen}}
                                        无需填写
                                    {{else}}
                                        <b style="color: #df3434">请输入奖品数量</b>
                                    {{/compare}}
                                </span>
                            </div>
                            <div class="control-group img">
                                <label class="control-label"><b class="must-tip">*</b>奖项图片：</label>
                                <div class="prize-upload-img">
                                    {{#compare ../onceMore "==" '1'}}
                                        {{#compare @index "!=" ../../allLen}}
                                                <input type="hidden" value="{{bean.przitmPicUrlAddr}}" name="przitmPicUrlAddr">
                                                <div class="prize-img-img">
                                                    <img src="{{../ftpUrl}}{{bean.przitmPicUrlAddr}}" alt="奖项">
                                                </div>
                                            {{else}}
                                                <input type="hidden" value="" name="przitmPicUrlAddr">
                                                <div class="prize-img-img">
                                                    <div class="prize-add-imgbg">+</div>
                                                </div>
                                        {{/compare}}
                                    {{else}}
                                        {{#compare @index "!=" ../../len}}
                                                <input type="hidden" value="{{bean.przitmPicUrlAddr}}" name="przitmPicUrlAddr">
                                                <div class="prize-img-img">
                                                    <img src="{{../ftpUrl}}{{bean.przitmPicUrlAddr}}" alt="奖项">
                                                </div>
                                            {{else}}
                                                <input type="hidden" value="" name="przitmPicUrlAddr">
                                                <div class="prize-img-img">
                                                    <div class="prize-add-imgbg">+</div>
                                                </div>
                                        {{/compare}}
                                    {{/compare}}
                                    <div class="prize-change-img">
                                        修改图片
                                    </div>
                                </div>
                            </div>
                        </div>
                        {{#compare @index "!=" ../allLen}}
                            <div class="prize-goods-list">
                                <a href="javascript:;" class="btn btn-link add-PrizeAddRes"
                                   data-flag="{{addIndex @index}}">添加奖品</a>
                                <div id="G-luckPrize-{{addIndex @index}}" class="luckPrize-group">
                                    {{#each beans}}
                                        <div class="prize-goods-box">
                                            <h3>奖品</h3>
                                            <div class="prize-goods-info">
                                                <div class="form-horizontal form-prize mt-20">
                                                    <input class="input" type="hidden" name="cmpgnRsId" value="{{cmpgnRsId}}">
                                                    <div class="control-group">
                                                        <label class="control-label">奖品名称：</label>
                                                        <div class="controls disabled">
                                                            <input class="input" disabled type="text" value="{{rsNm}}">
                                                        </div>
                                                        <a href="javascript:;" class="btn btn-link del-PrizeAddRes">删除</a>
                                                    </div>
                                                    <div class="control-group">
                                                        <label class="control-label">资源数量：</label>
                                                        <div class="controls disabled">
                                                            <input class="input" disabled type="text" value="{{leftQty}}">
                                                        </div>
                                                    </div>
                                                    <div class="control-group">
                                                        <label class="control-label"><b class="must-tip">*</b>奖品数量：</label>
                                                        <div class="controls">
                                                            <input class="input" type="text" data-qty="{{leftQty}}" name="prizePreprQty" value="{{prizePreprQty}}" onkeyup="this.value=this.value.replace(/\D/g,'')">
                                                        </div>
                                                    </div>
                                                    <div class="control-group img">
                                                        <label class="control-label"><b class="must-tip">*</b>奖品图片：</label>
                                                        <div class="prize-upload-img">
                                                            <input type="hidden" value="{{prizePicUrlAddr}}" name="prizePicUrlAddr">
                                                            <div class="prize-img-img">
                                                                <img src="{{../../ftpUrl}}{{prizePicUrlAddr}}" alt="{{rsNm}}">
                                                            </div>
                                                            <div class="prize-change-img">
                                                                修改图片
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    {{/each}}
                                </div>
                            </div>
                        {{/compare}}
                    </li>
                {{/each}}
            {{/if}}
        {{else}}
            {{#if beans}}
                {{#each beans}}
                    <li class="{{selected @index}}">
                        <div class="form-horizontal form-prize mt-20">
                            <div class="control-group">
                                <label class="control-label"><b class="must-tip">*</b>中奖概率：</label>
                                <div class="controls">
                                    <input class="input" type="text" name="winprzRate" onkeyup="this.value=(this.value.match(/\d+(\.\d{0,2})?/)||[''])[0]">
                                </div>
                                <span class="c-form-tips ml-10">%</span>
                            </div>
                            <div class="control-group">
                                <label class="control-label">奖品数量：</label>

                                    {{#compare @index "!=" ../len}}
                                        <div class="controls disabled">
                                            <input class="input" name="prizeItemQty" type="text" disabled value="{{bean.prizeItemQty}}">
                                        </div>
                                        {{else}}
                                        <div class="controls">
                                            <input class="input" name="prizeItemQty" type="text" value="{{bean.prizeItemQty}}" onkeyup="this.value=this.value.replace(/\D/g,'')">
                                        </div>
                                    {{/compare}}

                                <span class="c-form-tips ml-10">
                                    {{#compare @index "!=" ../len}}
                                        无需填写
                                    {{else}}
                                        <b style="color: #df3434">请输入奖品数量</b>
                                    {{/compare}}
                                </span>
                            </div>
                            <div class="control-group img">
                                <label class="control-label"><b class="must-tip">*</b>奖项图片：</label>
                                <div class="prize-upload-img">
                                    <input type="hidden" value="" name="przitmPicUrlAddr">
                                    <div class="prize-img-img">
                                        <div class="prize-add-imgbg">+</div>
                                    </div>
                                    <div class="prize-change-img">
                                        修改图片
                                    </div>
                                </div>
                            </div>
                        </div>
                        {{#compare @index "!=" ../len}}
                            <div class="prize-goods-list">
                                <a href="javascript:;" class="btn btn-link add-PrizeAddRes" data-flag="{{addIndex @index}}">添加奖品</a>
                                <div id="G-luckPrize-{{addIndex @index}}" class="luckPrize-group"></div>
                            </div>
                        {{/compare}}
                    </li>
                {{/each}}
            {{/if}}
        {{/if}}
    </ul>
</div>