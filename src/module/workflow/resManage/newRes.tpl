 <div class="con-title">
    <p><a class="c-back-btn" id="G-back-parent"></a> > <span id="G-pageTit"></span></p>
</div>
<div class="wrap_right_con">
    <div class="z-container">
        <div id="select_types">
            <form id="G-form" class="form-horizontal">
                <div class="control-group">
                    <label class="control-label"><b>*</b>资源类型：</label>
                    <div id="G-select" class="controls border-0 pt-0 mt-5">
                        <label class="label-type"><input name="rsTypeCd" value="01" type="radio" checked/>实物</label>
                        <label class="label-type"><input name="rsTypeCd" value="02" type="radio"/>优惠券</label>
                        <label class="label-type"><input name="rsTypeCd" value="03" type="radio"/>虚拟物品</label>
                        
                        <!--<select name="rsTypeCd" id="G-select"  class="input">
                            <option value="01">实物</option>
                            <option value="02">优惠券</option>
                            <option value="03">虚拟物品</option>
                        </select> -->
                    </div>
                </div>
                 <!--选择实物时出现,并默认选择是,是会出现商品选择,否不会-->
                <div id="G-typeMerc">
                    <div class="control-group">
                        <label class="control-label"><b>*</b>是否为商品：</label>
                        <!--是实物商品的标识: isMcds 为1-->
                        <div>
                            <label class="control-content shopCategoryNm" for="yes">
                                <input  class="select_merc ml-15" id="G-yes" name="isMcds" type="radio" value="1" checked/>
                            是</label>
                            <label class="control-content shopCategoryNm"  for="no">
                                <input  class="select_merc ml-15" id="G-no" name="isMcds" value="0" type="radio"/>
                            否</label>
                        </div>
                    </div>
                    <div id="G-isMcds" class="control-group">
                        <label class="control-label"><b>*</b>商品选择：</label>
                        <div class="pt-5">
                            <a id="G-choose" class="text-change-orange ml-15" href="javascript:;">请选择商品</a>
                        </div>
                        <div id="G-mcdsHide" class="fn-hide">
                            <input name="mcdsId" type="hidden" />
                            <input name="prodUprc" type="hidden" />
                            <input name="mrctId" type="hidden" />
                            <input name="shopNm" type="hidden" />
                            <input name="srcSysId" type="hidden"/>
                            <input name="mcdsNm" type="hidden"/>
                        </div>
                    </div>
                </div>
                <div class="control-group">
                    <!--可以是优惠券,商品名(不可改变),虚拟商品名-->
                    <label class="control-label" id="G-name"><b>*</b>商品名称：</label>
                    <div class="controls noEdit">
                        <input name="rsNm" maxlength="32" oninput="console.log('input');" id="G-nameInput" class="input" type="text" readonly/>
                    </div>                 
                    <span id="G-msgNm" class="tip-span">                       
                    </span>
                </div>             
                <!--选优惠券显示-->
                <div id="G-typeCoupon" style="display:none;">
                    <div class="control-group">
                        <label class="control-label"><b>*</b>优惠券面额：</label>
                        <div class="controls">
                            <input class="concPrsnName input" id="G-numInput" name="coupnFcvalAmt" type="text"/>
                        </div>
                        <span id="G-msgAmt" class="tip-span">                       
                    	</span>
                    </div>

                    <div class="control-group datetime z-time">

                    </div>

                    <div class="control-group">
                        <label class="control-label"><b>*</b>发放方式：</label>
                        <div class="controls border-0 pt-0" style="width:276px;">
                            <select name="giveModeCd" class="input" id="">
                                <option>系统发放</option>
                                <option>人工发放</option>
                            </select>
                        </div>
                    </div>                                  
                    <div class="control-group">
                        <label class="control-label"><b>*</b>文件导入：</label>
                        <div>
                       	  	 <a id="G-importFile" class="fuckIn btn btn-blue ml-15">导入</a>
                           <!--   <input class="fn-hide" type="file" name="couponFile" id="G-fileUpload" multiple="multiple" title="点击上传"  />
                            -->  <span id="G-upLoadTip" class="tip-span"></span>                                              
                        </div>                      
                    </div>  
                    <div class="control-group">
                        <label class="control-label"></label>
                        <div >
                            <a class="text-change-orange ml-15" href="src/assets/doc/coupon_tpl.xls">下载优惠券模板</a>
                            <p class="mt-10" style="margin-left: 150px;">通过下载“下载模板“获取excel表格模板。</p>
                        </div>
                    </div>                                                                       
                </div>

               
				<div class="control-group" >
                    <label id="G-qty" class="control-label"><b>*</b>数量：</label>
                    <div class="controls noEdit">
                        <input name="preprQty" value="" class="input border-0 pt-0" type="text" readonly/>
                    </div>
                </div>    
                <div class="control-group">
	            <label class="control-label"><b>*</b>资源图片：</label>
	            <div class="prize-upload-img">
	                <input type="hidden" value="" name="rsPicPath">
	                <div class="prize-img-img">
	                    <div class="prize-add-imgbg">+</div>
	                </div>
	                <div class="prize-change-img">
	                    点击上传
	                </div>
	            </div>
	        </div>
                <div class="control-group">
                    <label class="control-label"><b>*</b>资源描述：</label>
                    <div class="controls "  style="width:380px">
                        <textarea id="G-rsDesc" name="rsDesc" style="height:80px"></textarea>
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