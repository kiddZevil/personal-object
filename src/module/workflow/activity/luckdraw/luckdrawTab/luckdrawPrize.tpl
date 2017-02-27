{{#if bean}}
    {{#each bean}}
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
                            <input class="input" type="text" data-qty="{{leftQty}}" name="prizePreprQty" value="{{prizePreprQty}}" onkeyup="this.value=this.value.replace(/\D/g,'')" >
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label"><b class="must-tip">*</b>奖品图片：</label>
                        <div class="prize-upload-img">
                            <input type="hidden" value="" name="prizePicUrlAddr">
                            <div class="prize-img-img">
                                <div class="prize-add-imgbg">+</div>
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
{{/if}}