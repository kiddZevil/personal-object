<div class="c-article c-step-one" id="G-stepOne">
    <div class="c-section">
        <!-- <div class="c-section-header">
             <span class="c-section-tit">奖励设置</span>
         </div>-->
        <input type="hidden" value="" name="cmpgnTypeCd" />
        <input type="hidden" value="" name="cmpgnId" />
        <div class="c-form-group">
            <label> <b>*</b> 活动名称： </label>
            <input name="cmpgnNm" type="text" class="c-form-control" maxlength="32" placeholder="请输入活动名称(不少于5个字)" />
            <span class="c-form-tips">活动名称不少于5个字且不能含有空格</span>
        </div>
        <div class="c-form-group">
            <label> <b>*</b> 活动简介：</label>
            <textarea class="c-form-control" name="cmpgnDesc" maxlength="250"  rows="3" placeholder="请输入活动简介"></textarea>
            <span class="c-form-tips"></span>
        </div>
        <div class="c-form-group">
            <label> <b>*</b> 起止时间：</label>
            <div class="c-input-inline fn-clear">
                <input type="text" name="bgnValidTime" class="c-form-control" placeholder="请选择开始时间"/>
                <div class="c-form-mid">至</div>
                <input type="text" name="endValidTime" class="c-form-control" placeholder="请选择结束时间" />
            </div>
        </div>
        <div class="c-form-group" id="">
            <label> <b>*</b> 活动类型：</label>
            <div id="G-selActPatBox" style="display: inline-block">

            </div>
            <!--disabled !-->

            <!--<select id="G-selAct" name="selActType" class="c-form-control sel-act">
               <option value="01" data-skip="js/workflow/activity/groupbuy/groupbuy">团购活动</option>
               <option value="02" data-skip="js/workflow/activity/seckill/seckill">秒杀活动</option>
               <option value="03" data-skip="js/workflow/activity/luckdraw/luckdraw">抽奖活动</option>
               <option value="04" data-skip="js/workflow/activity/signIn/signIn">签到活动</option>
               <option value="05" data-skip="js/workflow/activity/propagate/propagate">宣传活动</option>
            </select>-->
        </div>
        <div class="c-form-group"  style="display: none">
            <label> <b>*</b> 活动子类型：</label>
            <div id="G-selActChnBox" style="display: inline-block">

            </div>
        </div>
        <div class="c-form-group">
                <label> <b>*</b> 创建人信息：</label>
                <input type="text" class="c-form-control" name="founder" disabled value="创建人不可编辑" style="width:150px" />
            </div>
        <div  style="margin-left: 101px;">
          <a href="javascript:;" class="btn btn-blue" id="G-stepOneNext">下一步</a>
          </div>

    </div>
</div>