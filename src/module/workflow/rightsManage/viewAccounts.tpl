<!--title begin-->
<div class="con-title">
    <p><a href="javascript:;" id="G-back-parent">权限管理</a><span>&nbsp;&gt;&nbsp;查看账号</span></p>
</div>
<!--title end-->
<!--右侧主体内容begin-->
<div class="wrap_right_con">
    <div class="all_order right-edit viewInfo">

        <form class="form-horizontal">
            <!--账号 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    账号:
                </div>
                <div class="controls disable-control">
                    <input class="account-name" type="text" name="account" disabled="" placeholder="请输入账号，4-20个字符组成">

                </div>
                <div id="J-account-name_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-account-name" class="error">账号不能为空</p>
                </div>
            </div>
            <!--账号  end-->

            <!--归属渠道 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    归属渠道:
                </div>
                <div class="controls disable-control border-0 pt-0">
                    <select name="channelSel" disabled="" class="channel-select" id="channel-select">

                    </select>

                </div>
                <div id="J-channel_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-channel" class="error">请选择归属渠道</p>
                </div>
            </div>
            <!--归属渠道  end-->


            <!--角色 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    角色:
                </div>
                <div class="controls disable-control border-0 pt-0">
                    <select name="roleSel" class="role-select" disabled="" id="role-select">

                    </select>

                </div>
                <div id="J-roles_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-roles" class="error">请选择角色</p>
                </div>
            </div>
            <!--角色  end-->

        </form>
        <div class="pad_left157">
            <a href="javascript:;" class="btn btn-blue" id="return-btn">返回列表</a>
        </div>
    </div>
</div>
<!--右侧主体内容end-->