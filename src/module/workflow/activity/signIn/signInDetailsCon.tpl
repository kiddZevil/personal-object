<table>
    <thead>
    <tr class="c-table-tit">
        <th width="15%">活动资源信息</th>
        <th width="40%"></th>
        <th width="22%"></th>
        <th width="23%"></th>
    </tr>
    <tr class="c-table-class">
        <th>签到天数</th>
        <th>奖品名称</th>
        <th>领取限制类型</th>
        <th>领取限制数量</th>
    </tr>
    </thead>
    <tbody>
    {{#if beans}}
    {{#each beans}}
    <tr>
        <td>
            {{signdDayCnt}}
        </td>
        <td class="td-img">
        {{#if rsPicPath}}	            			            				
	            		<img src="{{complete ../imgUrl rsPicPath}}" alt="{{rsNm}}" title="{{rsNm}}"/>
	            	{{else}}
	            		<img src="src/assets/img/noImg.png" alt="{{rsNm}}" title="{{rsNm}}"/>
	            	{{/if}}
            <span>{{rsNm}}</span>
        </td>
        <td>
            {{#compare takeLmtTypeCd "==" "01"}}
            每天
            {{else}}
            一共
            {{/compare}}
        </td>
        <td>
            {{takeLmtQty}}
        </td>
    </tr>
    {{/each}}
    {{/if}}
    </tbody>
</table>