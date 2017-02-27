{{#if beans}}
    {{#each beans}}
        <tr data-id="{{tmpltId}}" data-state="{{validStsCd}}">
            <td valign="top">
                {{#expression cmpgnTypeCd "==" "01"}}
                    团购
                {{/expression}}
                {{#expression cmpgnTypeCd "==" "02"}}
                    秒杀
                {{/expression}}
                {{#expression cmpgnTypeCd "==" "03"}}
                    抽奖
                {{/expression}}
                {{#expression cmpgnTypeCd "==" "04"}}
                    签到
                {{/expression}}
                {{#expression cmpgnTypeCd "==" "05"}}
                    宣传
                {{/expression}}
                {{#expression cmpgnTypeCd "==" "06"}}
                    互动
                {{/expression}}
            </td>
            <td valign="top">
	            <div class="list-img" style="width: 90px;height:auto;">
	            	{{#if tmpltPicUrlAddr}}
	            		<img src="{{complete ../bean/ftpUrl tmpltPicUrlAddr}}"/>
	            	{{else}}
	            		<img src="src/assets/img/noImg.png"/>
	            	{{/if}}
	            </div>
            </td>
            <td valign="top" class="td-show-more" title="{{rsNm}}">{{tmpltNm}}</td>
            <td valign="top" class="td-show-more">
                {{#expression showTrmnTypeCd "==" "01"}}
                PC端
                {{/expression}}
                {{#expression showTrmnTypeCd "==" "02"}}
                移动端
                {{/expression}}</td>
            <td valign="top">
                {{#expression validStsCd '==' "1" }}
                    <span class="t-tag-todo">已开启</span>
                    <span style="display:none" class="t-tag">已停用</span>
                {{/expression}}
                {{#expression validStsCd '==' "0" }}
                     <span style="display:none" class="t-tag-todo">已开启</span>
                     <span class="t-tag">已停用</span>
                {{/expression}}
            </td>
            <td valign="top">
                {{#expression validStsCd '==' "0" }}
                <a href="javascript:;" data-operation="begin-activity" class="text-change-orange mr-5 oper-activity">启用</a>
                {{/expression}}
                {{#expression validStsCd '==' "1" }}
                <a href="javascript:;" data-operation="stop-activity" class="text-change-orange mr-5 oper-activity">停用</a>
                {{/expression}}
            </td>
        </tr>
	{{/each}}
    {{else}}
    <tr height="239">
        <td  colspan="6" class="fn-txt-center"><img src="src/assets/img/no-data.png" style="margin-right:0px;"><h1>暂无数据</h1></td>
    </tr>
{{/if}}