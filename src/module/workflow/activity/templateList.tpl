<ul class="templateList ml-10 mt-15 fn-clear">
    <input type="hidden" name="tmpltId" value="">
    <input type="hidden" name="tmpltPath" value="">
    <input type="hidden" name="cmpgnChildTypeCd" value="">
    {{#if beans}}
        {{#each beans}}
            <li data-prz="{{przitmCnt}}" data-ctypecd="{{cmpgnChildTypeCd}}" data-id="{{tmpltId}}" data-path="{{tmpltPath}}"
                data-img="{{actvBannerPicAddr}}" data-w="{{bannerPicWidth}}" data-h="{{bannerPicHt}}">
                <img class="tempImg" src="{{../ftpUrl}}{{tmpltPicUrlAddr}}"  alt=""/>
                <p>{{tmpltNm}}</p>
            </li>
        {{/each}}
    {{/if}}
</ul>
<div class="upload-tmp-banner">
    <div class="control-group img">
        <label class="control-label">修改选中模版BANNER图：
        <br>
        <span id="img-def-size" class="img-size-tip"></span>
        </label>
        <div class="prize-upload-img" style="position: relative;">
            <input type="hidden" value="" name="actvBannerPicAddr">
            <div class="prize-img-img">
                <div class="prize-add-imgbg">+</div>
                <img class="imgUrl" alt="奖项" style="display:none">
            </div>
            <div class="prize-change-img">
                X
            </div>
        </div>
    </div>
</div>


