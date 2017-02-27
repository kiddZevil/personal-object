<style>
    .g-sd1{position:relative;float:left;width:280px;margin-right:-280px;}
    .g-mn1{float:right;width:100%;}
    .g-mn1c{margin-left:280px;}
</style>
<div class="g-sd1 fn-clear">
    <table style="width: 100%; float: left;">
        <thead>
            <tr>
                <th rowspan="2" width="8%" style="height: 57px">类型</th>
                <th rowspan="2" width="10%" style="height: 57px">奖项等级</th>
                <th rowspan="2" width="10%" style="height: 57px">等级奖品</th>
            </tr>
        </thead>
        <tbody>
        {{#if leftTbArr}}
            {{#each leftTbArr}}
                <tr>
                    <td rowspan="{{rowspan}}" style="{{#if rowspan}}{{else}}display:none{{/if}}">{{nav}}</td>
                    <td rowspan="{{tRowspan}}" style="{{#if lineShow}}{{else}}display:none{{/if}}">{{tit}}</td>
                    <td>{{prize}}</td>
                </tr>
            {{/each}}
        {{/if}}
        </tbody>
    </table>
</div>
<div class="g-mn1">
    <div class="g-mn1c">
        <table style="width: 100%;float: left; margin-left: -1px; padding-left: 200px">
            <thead>
            <tr>
                <th colspan="{{time.length}}" width="100%">日期</th>
            </tr>
            <tr>
                {{#each time}}
                    <th>{{this}}</th>
                {{/each}}
            </tr>
            </thead>
            <tbody>
                {{#if rightTbArr}}
                    {{#each rightTbArr}}
                        {{#each this}}
                            <tr>
                                {{#each this}}
                                    <td>{{this}}</td>
                                {{/each}}
                            </tr>
                        {{/each}}
                    {{/each}}
                {{/if}}
            </tbody>
        </table>
    </div>
</div>