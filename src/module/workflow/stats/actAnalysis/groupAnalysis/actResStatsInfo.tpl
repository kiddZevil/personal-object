<div class="fn-left" style="width:20%">
    <table>
        <thead>
        <tr>
            <th style="height: 57px;overflow: hidden;">活动名称</th>
        </tr>
        </thead>
        <tbody>
        {{#if rsNms}}
        {{#each rsNms}}
        <tr>
            <td style="height: 127px">{{this}}</td>
        </tr>
        {{/each}}
        {{/if}}
        </tbody>
    </table>
</div>
<div class="fn-left" style="width:80%;margin-left: -2px">
    <table>
        {{#if times}}
        <thead>
        <tr>
            <th rowspan="2" style="border-right: 1px solid #ddd">计数类别</th>
            <th class="fn-text-center" colspan="{{times.length}}">日期</th>
        </tr>
        <tr>
            {{#each times}}
            <th>{{this}}</th>
            {{/each}}
        </tr>
        </thead>
        {{/if}}
        <tbody>
            {{#if beans}}
            {{#each beans}}
                <tr>
                    <td>{{typeNm}}</td>
                    <td class="day1">{{day1}}</td>
                    <td class="day2">{{day2}}</td>
                    <td class="day3">{{day3}}</td>
                    <td class="day4">{{day4}}</td>
                    <td class="day5">{{day5}}</td>
                    <td class="day6">{{day6}}</td>
                    <td class="day7">{{day7}}</td>
                </tr>
            {{/each}}
            {{/if}}
        </tbody>
    </table>
</div>

