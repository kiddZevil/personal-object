{{#if beans}}
    <table>
        <thead>
            <tr>
                <th rowspan="2" width="10%" style="border-right: 1px solid #ddd">到达规则</th>
                <th colspan="{{times.length}}">日期</th>
            </tr>
            <tr>
                {{#each times}}
                    <th>{{this}}</th>
                {{/each}}
            </tr>
        </thead>
        <tbody>
        {{#each beans}}
        <tr>
            <td>签到{{reachDayCnt}}天的人数</td>
            {{#each statNum}}
            <td>{{this}}</td>
            {{/each}}
        </tr>
        {{/each}}
        </tbody>
    </table>
{{/if}}