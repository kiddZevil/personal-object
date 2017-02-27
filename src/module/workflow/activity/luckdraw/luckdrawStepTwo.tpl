<div class="c-article c-step-two" id="G-stepTwo">
    <div class="c-section">
        <div class="c-section-header">
            <span class="c-section-tit">规则配置</span>
        </div>
        <div class="c-section-con form-horizontal">
            <div class="control-group mt-15">
                <label class="control-label">抽奖次数：</label>
                <div class="c-radio">
                    <label for="times">
                        <input class="ml-15" id="times" name="przdrwTmsCntTypeCd" type="radio" value="02" checked />
                        每人总抽奖
                    </label>
                    <input class="" name="przdrwTmsCnt" onkeyup="this.value=this.value.replace(/\D/g,'')" type="text" style="left:80px">
                    <b>次</b>
                </div>
                <div class="c-radio" style="margin-left: 75px">
                    <label for="line">
                        <input class="ml-15" id="line" name="przdrwTmsCntTypeCd" type="radio" value="03" />
                        每人每天最大抽奖次数，每天最多抽奖
                    </label>
                    <input class="" style="left:225px" name="przdrwTmsCnt" onkeyup="this.value=this.value.replace(/\D/g,'')" disabled type="text">
                    <b>次</b>
                </div>
            </div>
            <div class="control-group mt-15">
                <label class="control-label">抽奖机会作为奖项：</label>
                <div class="c-radio">
                    <label for="no">
                        <input class="ml-15" id="no" name="rwdPrzdrwChancFlag" type="radio" data-f="1" checked
                               value="1" />
                        否
                    </label>
                </div>
                <div class="c-radio">
                    <label for="yes">
                        <input class="ml-15" id="yes" name="rwdPrzdrwChancFlag" data-f="0" type="radio" value="0" />
                        是，奖品为再来一次
                    </label>
                </div>
            </div>
        </div>

    </div>
    <div class="c-section">
        <div class="c-section-header">
            <span class="c-section-tit">模版设置</span>
        </div>
        <div class="c-section-con">
            <div id="tempList90" class="c-section-con"></div>
        </div>
        
    </div>
    <div class="c-section">
        <div class="c-section-header">
            <span class="c-section-tit">奖品设置</span>
        </div>
        <div class="c-section-con" id="G-luckdraw">

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
