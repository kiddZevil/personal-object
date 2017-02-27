<table>
    <thead>
        <tr>
            <th width="20%">日期</th>
            <th width="20%">浏览人数</th>
            <th width="20%">浏览次数</th>
        </tr>
    </thead>
    <tbody>
    {{#if beans}}
        {{#each beans}}
            <tr>
                <td>{{#if statDate}} {{subStr statDate 0 10}} {{else}} 0 {{/if}}</td>
                <td>{{#if urlPv}} {{urlPv}} {{else}} 0 {{/if}}</td>
                <td>{{#if urlUv}} {{urlUv}} {{else}} 0 {{/if}}</td>
            </tr>
        {{/each}}
    {{else}}
        <tr height="150">
            <td  colspan="9" class="fn-txt-center c-tips-data">
                <img src="src/assets/img/no-data.png" style="margin-right:0px;">
                <h1>暂无数据</h1>
            </td>
        </tr>
    {{/if}}
    </tbody>
</table>
