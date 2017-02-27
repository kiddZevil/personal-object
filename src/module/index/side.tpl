<div class="main_menu">
    <h1><a href="javascript:;"><img src="src/assets/img/logo.png" width="50" height="64"></a></h1>
    <ul>
        {{#each this}}
            <li class="J_click_item" data-url="{{url}}" data-id="{{id}}">
                <i class="product_font {{icon}}"></i>
                <a href="javascript:;">{{name}}</a>
            </li>
        {{/each}}
    </ul>
    <!--<div class="exit J_hover_userInfo">
        <a href="../mamp/logout" class="userInfo_name">退出</a>
    </div>!-->
    <div class="exit J_hover_userInfo">
        <input type="hidden" id="userInfo_hid" value="">
        <p class="userInfo_name" style="color:#e0e0e0">账户名</p>
        <div class="exit_div J_hover_userInfoBox" style="display: none">

        </div>
    </div>
</div>
<div class="sub_menu J_render_item">

</div>