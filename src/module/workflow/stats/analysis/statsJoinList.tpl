{{#if beans}}
{{#expression flag "==" "1"}}
    {{#each beans}}
    <tr>
        <td>{{statDate}}</td>
        <td>{{pv}}</td>
        <td>{{uv}}</td>
        <td>{{participateUserNum}}</td>
        <td>{{participateNum}}</td>
        <td>{{orderUserNum}}</td>
        <td>{{orderNum}}</td>
        <td>{{avgPtNum}}</td>
    </tr>
    {{/each}}
{{/expression}}
{{#expression flag "==" "0"}}
{{#each beans}}
<tr>
    <td>{{statDate}}</td>
    <td>{{pv}}</td>
    <td>{{uv}}</td>
    <td>{{participateUserNum}}</td>
    <td>{{participateNum}}</td>
    <td>/</td>
    <td>/</td>
    <td>{{avgPtNum}}</td>
</tr>
{{/each}}
{{/expression}}
{{/if}}