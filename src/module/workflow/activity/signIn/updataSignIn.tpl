{{#if flag}}
{{#if beans}}
{{#each beans}}
<div class="sign-rule-box">
    <h3>
        规则<span class="rule-count">{{addIndex @index}}</span>
        <a href="javascript:;" class="btn g-delete btn-link fn-right">删除</a>
    </h3>
    <div class="sign-rule-info">
        <input type="hidden" name="signdTypeCd" value="01"> <!--连续签到-->
        <div class="sign-rule-row">
            连续签到
            <input class="sign-input" name="signdDayCnt" value="{{signdDayCnt}}" type="text"> <!--签到天数-->
            天
        </div>
        <input type="hidden" name="takeLmtTypeCd" value="{{takeLmtTypeCd}}">

        {{#compare takeLmtTypeCd "==" "01"}}
            <div class="sign-rule-row fn-inline">
                <div class="c-radio">
                    <label class="G-label">
                        <input class="ml-15" data-check="all" type="radio">
                        允许一共领取
                    </label>
                </div>
                <input class="sign-input input-all" name="takeLmtQty"  type="text"  disabled> <!--签到天数-->
                件(库存)
            </div>
            <div class="sign-rule-row fn-inline">
                <div class="c-radio">
                    <label class="G-labels">
                        <input class="ml-15" data-check="day" type="radio" checked>
                        允许每天领取
                    </label>
                </div>
                <input class="sign-input input-day" name="takeLmtQty" value="{{takeLmtQty}}" type="text"> <!--签到天数-->
                件(库存)
            </div>
        {{else}}
            <div class="sign-rule-row fn-inline">
                <div class="c-radio">
                    <label class="G-label">
                        <input class="ml-15" data-check="all" type="radio" checked>
                        允许一共领取
                    </label>
                </div>
                <input class="sign-input input-all" name="takeLmtQty" value="{{takeLmtQty}}" type="text"> <!--签到天数-->
                件(库存)
            </div>
            <div class="sign-rule-row fn-inline">
                <div class="c-radio">
                    <label class="G-labels">
                        <input class="ml-15" data-check="day" type="radio">
                        允许每天领取
                    </label>
                </div>
                <input class="sign-input input-day" name="takeLmtQty" type="text" disabled> <!--签到天数-->
                件(库存)
            </div>
        {{/compare}}

        <a href="javascript:;" class="btn btn-link z-addMcds">添加商品</a>
        <div class="sign-rule-goods form-horizontal form-prize">
            <input class="input" type="hidden" name="cmpgnRsId" value="{{cmpgnRsId}}">
            <div class="control-group">
                <label class="control-label">奖品名称：</label>
                <div class="controls noEdit">
                    <input class="input" name="rsNm" value="{{rsNm}}" readonly type="text"/>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">剩余数量：</label>
                <div style="width:120px;" class="controls noEdit">
                    <input class="input" name="leftQty" value="{{leftQty}}" readonly type="text"/>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">奖品图片：</label>
                <div class="prize-upload-img">
                	{{#if rsPicPath}}
	            	<img src="{{../bean/ftpUrl}}{{rsPicPath}}" class="rsPicPath" alt="">
	            	{{else}}
	            	<img src="src/assets/img/noImg.png"/>
	            	{{/if}}                   
                </div>
            </div>
        </div>
    </div>
</div>
{{/each}}
{{/if}}
{{/if}}
