 <div class="con-title">
    <p><a class="c-back-btn" id="G-back-parent"></a> > <span id="G-pageTit"></span></p>
</div>
<div class="wrap_right_con">
    <div class="z-container">
        <div id="select_types">
            <form id="G-form" class="form-horizontal">
                <div class="control-group">
                    <label class="control-label"><b>*</b>营销类型：</label>
                    <!--<div class="controls border-0 pt-0" style="width:276px;">
                        <select name="giveModeCd" class="input">
                            <option>团购</option>
                            <option>签到</option>
                            <option>抽奖</option>
                            <option>秒杀</option>
                            <option>宣传</option>
                        </select>
                    </div>-->
                    <div id="G-select" class="controls border-0 pt-0 mt-5"></div>
                </div>
                <!--TODO 编辑时启用-->
                <!--<div id="G-tplId">
                    <div class="control-group">
                        <label class="control-label"><b>*</b>模板ID：</label>
                        <div class="controls">
                            <input id="G-idInput" name="tmpltId" class="input" type="text"/>
                        </div>
                        <span id="G-msgAmt" class="tip-span">
                    	</span>
                    </div>
                    <div class="control-group">
                        <label class="control-label"></label>
                        <div class="ml-15">
                            <span class="ml-15">
                                模板ID请以大写M开头后跟6位数字，例：M123456
                            </span>
                        </div>
                    </div>
                </div>-->
				<div class="control-group" >
                    <label class="control-label"><b>*</b>模板名称：</label>
                    <div class="controls">
                        <input name="tmpltNm" value="" class="input border-0 pt-0" type="text"/>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label"><b>*</b>模板类型：</label>
                    <div class="controls border-0 pt-0" style="width:276px;">
                        <select name="showTrmnTypeCd" class="input">
                            <option value="02">移动端</option>
                            <option value="01">PC端</option>
                        </select>
                    </div>
                </div>
                <div class="control-group" >
                    <label class="control-label"><b>*</b>模板路径：</label>
                    <div class="controls">
                        <input id="G-adrInput" value="/src/template/tmp/" class="input border-0 pt-0 fn-inlinblock" style="width: 150px;" type="text" readonly/><input id="G-adrInput2" value="" class="input border-0 pt-0 fn-inlinblock"  style="width: 42%" type="text" placeholder="输入路径"/>
                    </div>
                    <input name="tmpltPath" type="hidden"/>
                </div>
                <div class="control-group" >
                    <label class="control-label"><b>*</b>模板banner大小：</label>
                    <span class="ml-15">高度：</span>
                    <div class="controls ml-0" style="width:82px" >
                        <input name="bannerPicHt" class="input border-0 pt-0" type="text"/>
                    </div>
                    <span>宽度：</span>
                    <div class="controls ml-0" style="width:82px" >
                        <input name="bannerPicWidth" class="input border-0 pt-0" type="text"/>
                    </div>
                </div>
                <div class="fn-hide" id="G-quantity">
	                <div class="control-group ">
	                    <label class="control-label"><b>*</b>奖项数量：</label>
	                    <div class="controls">
	                        <input name="przitmCnt" class="input border-0 pt-0" type="text"/>
	                    </div>
	                </div>
                </div>
                <div class="control-group" id="G-tpl-ctype">
                    <label class="control-label"><b>*</b>子模版类型：</label>
                    <div class="controls border-0 pt-0" style="width:276px;">
                        <select name="cmpgnChildTypeCd" id="G-drawtype" class="input">
                        </select>
                    </div>
                </div>
                <div class="control-group">
	            <label class="control-label"><b>*</b>模板图片：</label>
	            <div class="prize-upload-img">
	                <input type="hidden" value="" name="tmpltPicUrlAddr">
	                <div class="prize-img-img">
	                    <div class="prize-add-imgbg">+</div>
	                </div>
	                <div class="prize-change-img">
	                    点击上传
	                </div>
	            </div>
	        </div>
                <div class="control-group">
                    <label class="control-label">模板描述：</label>
                    <div class="controls "  style="width:380px">
                        <textarea id="G-tplDesc" name="tmpltDesc" style="height:80px"></textarea>
                    </div>
                    <span id="G-msgDesc" class="tip-span"> </span>
                </div>
                <div class="control-group">
                    <label class="control-label"></label>
                    <div>
                        <button type="button" id="G-submit" class="btn btn-blue ml-15">确定</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>