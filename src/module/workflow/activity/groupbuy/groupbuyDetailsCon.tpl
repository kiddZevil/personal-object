<table>
    <thead>
    <tr class="c-table-tit">
        <th width="30%">活动资源信息</th>
        <th width="35%"></th>
        <th></th>
        <th></th>

    </tr>
    <tr class="c-table-class">
        <th>资源名称</th>
        <th>活动时间</th>
        <th>商品原价</th>
        <th>商品现价</th>

    </tr>
    </thead>
    <tbody>
    {{#if beans}}
    {{#each beans}}
    <tr>
        <td class="td-img">
            <img src="{{../imgUrl}}{{mcdsPic}}" height="50" width="50" border="0" alt="{{mcdsNm}}" title="{{mcdsNm}}">
            <span>{{mcdsNm}}</span>
        </td>
        <td>
            {{bgnTime}} ~ {{finishTime}}
        </td>
        <td>
            {{origUprc}}
        </td>
        <td>
            {{pmtUprc}}
        </td>
    </tr>
    {{/each}}
    {{/if}}
    </tbody>
</table>