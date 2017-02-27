{{#if beans}}
    {{#each beans}}
        <tr>
            <td class="td-show-more" title="{{cmpgnId}}">{{cmpgnId}}</td>
            <td class="td-show-more" title="{{cmpgnNm}}">{{cmpgnNm}}</td>
            <td class="td-show-more" title="{{cmpgnType}}">{{cmpgnType}}</td>
            <td class="td-show-more" title="{{rsNm}}">{{rsNm}}</td>
            <td>
            {{rsType}}
            <!--
            {{#expression rsTypeCd "==" "01"}}
                 实物
            {{/expression}}
            {{#expression rsTypeCd "==" "02"}}
                优惠券
            {{/expression}}
            {{#expression rsTypeCdd "==" "03"}}
                虚拟物品
            {{/expression}}
            -->
            </td>
            <td title="{{prchsMobnum}}">{{prchsMobnum}}</td>
            <td title="{{ntcSts}}">
   
            {{#expression ntcStsCd "==" "00"}}
                 通知失败
            {{/expression}}
            {{#expression ntcStsCd "==" "01"}}
                已通知
            {{/expression}}
            {{#expression ntcStsCd "==" "02"}}
                已发放
            {{/expression}}
            </td>
            <td class="td-show-more" title="{{crtTime}}">{{crtTime}}</td>
        </tr>
	{{/each}}
    {{else}}
    <tr height="239">
        <td  colspan="8" class="fn-txt-center"><img src="src/assets/img/no-data.png" style="margin-right:0px;"><h1>暂无数据</h1></td>
    </tr>
{{/if}}