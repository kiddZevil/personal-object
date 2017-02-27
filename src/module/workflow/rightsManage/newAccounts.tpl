<!--title begin-->
<div class="con-title">
    <p><a href="javascript:;" id="G-back-parent">权限管理</a><span>&nbsp;&gt;&nbsp;新建账号</span></p>
</div>
<!--title end-->
<!--右侧主体内容begin-->
<div class="wrap_right_con">
    <div class="all_order right-edit">
        <form class="form-horizontal">
            <!--账号 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    账号:
                </div>
                <div class="controls">
                    <input class="account-name" type="text" name="account" placeholder="请输入账号，4-20个字符组成" maxlength="20">
                </div>
                <div id="J-account-name_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-account-name" class="error">账号必须是4-20位字符组成</p>
                </div>
            </div>
            <!--账号  end-->
            <!--昵称 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    昵称:
                </div>
                <div class="controls controls">
                    <input class="account-als" type="text" name="userAls" placeholder="请输入昵称，4-20个字符组成" maxlength="12">
                </div>
                <div id="J-account-als_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-account-als" class="error"></p>
                </div>
            </div>
            <!--昵称  end-->
            <!--归属渠道 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    归属渠道:
                </div>
                <div class="controls border-0 pt-0">
                    <select name="channelSel" class="channel-select" id="channel-select">
                    </select>
                </div>
                <div id="J-channel_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-channel" class="error">请选择归属渠道</p>
                </div>
            </div>
            <!--归属渠道  end-->

            <!--密码 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    密码:
                </div>
                <div class="controls">
                    <input name="accPassword" class="accPassword" type="password" placeholder="请输入8-20位数字、字母和字符组成的密码">

                </div>
                <div id="J-password_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-password" class="error">请输入8-20位数字、字母和字符组成的密码</p>
                </div>
            </div>
            <!--密码  end-->

            <!--确认密码 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    确认密码:
                </div>
                <div class="controls">
                    <input name="rePassword" class="rePassword" type="password" placeholder="再输一次密码" >
                </div>
                <div id="J-rePassword_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-rePassword" class="error">两次输入的密码必须一致</p>

                </div>
            </div>
            <!--确认密码  end-->

            <!--角色 beg-->
            <div class="control-group">
                <div class="control-label">
                    <em class="con-required">*</em>
                    角色:
                </div>
                <div class="controls border-0 pt-0">
                    <select name="roleSel" class="role-select" id="role-select">
                    </select>

                </div>
                <div id="J-roles_wrapper" class="error-tips fn-hide mt-15">
                    <p id="J-roles" class="error">请选择角色</p>
                </div>
            </div>
            <!--角色  end-->

        </form>
        <div class="pad_left157">
            <a href="javascript:;" class="btn btn-blue" id="submit-btn">确定提交</a>
            <a href="javascript:;" class="btn" id="cancel-submit">取消</a>
        </div>
    </div>
</div>
<!--右侧主体内容end-->