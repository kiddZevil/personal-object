{{#if beans}}
    {{#each beans}}
        <tr data-id="{{cmpgnRsId}}" data-state="{{validStsCd}}">
            <td valign="top">
		                {{#expression rsTypeCd "==" "01"}}
		                     实物
		                {{/expression}}
		                {{#expression rsTypeCd "==" "02"}}
		                    优惠券
		                {{/expression}}
		                {{#expression rsTypeCd "==" "03"}}
		                    虚拟物品
		                {{/expression}}
            </td>
            <td valign="top">
	            <div class="list-img">	            
	            	{{#if rsPicPath}}	            			            				
	            		<img src="{{complete ../bean/prePath rsPicPath}}"/>
	            	{{else}}
	            		<img src="src/assets/img/noImg.png"/>
	            	{{/if}}
	            </div>
            </td>
            <td valign="top" class="td-show-more" title="{{rsNm}}">{{rsNm}}</td>
            <td valign="top" class="td-show-more" title="{{crtTime}}">{{crtTime}}</td>
            <td valign="top" title="{{preprQty}}">{{preprQty}}</td>
            <td valign="top" title="{{leftQty}}">{{leftQty}}</td>
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
            <td valign="top">{{crtUserNm}}</td>
            <td valign="top">
                {{#expression validStsCd '==' "0" }}
                <a href="javascript:;" data-operation="begin-activity" class="text-change-orange mr-5 oper-activity">启用</a>
                {{/expression}}
                {{#expression validStsCd '==' "1" }}
                <a href="javascript:;" data-operation="stop-activity" class="text-change-orange mr-5 oper-activity">停用</a>
                {{/expression}}
                <a class="text-change-orange mr-5 oper-check" href="javascript:;">查看</a>
            </td>
        </tr>
	{{/each}}
    {{else}}
    <tr height="239">
        <td  colspan="9" class="fn-txt-center"><img src="src/assets/img/no-data.png" style="margin-right:0px;"><h1>暂无数据</h1></td>
    </tr>
{{/if}}