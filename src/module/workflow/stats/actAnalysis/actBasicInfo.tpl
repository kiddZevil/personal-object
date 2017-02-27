<table>
    <tbody>
    {{#if bean}}
    <tr>
        <td width="25%" style="display: table; width: 100%; border: 0">
            <div class="info-label" style="display: table-cell; vertical-align: middle;width:13%;
            width:100px\0;width:100px\9;">
                <span>活动名称：</span>
            </div>
            <span class="info-con" style="display: table-cell; width: 60%">{{bean.cmpgnNm}}</span>
        </td>
        <td width="25%">
            <span class="info-label">活动编号：</span>
            <span class="info-con">{{bean.cmpgnId}}</span>
        </td>
        <td width="35%">
            <span class="info-label">活动类型：</span>
            <span class="info-con">
                {{#expression bean.cmpgnTypeCd '==' "01" }}
                            团购
                {{/expression}}
                {{#expression bean.cmpgnTypeCd '==' "02" }}
                    秒杀
                {{/expression}}
                {{#expression bean.cmpgnTypeCd '==' "03" }}
                    抽奖
                {{/expression}}
                {{#expression bean.cmpgnTypeCd '==' "04" }}
                    签到
                {{/expression}}
                {{#expression bean.cmpgnTypeCd '==' "05" }}
                    宣传
                {{/expression}}
                {{#expression bean.cmpgnTypeCd '==' "06" }}
                    互动
                {{/expression}}
            </span>
        </td>
        <!--<td width="25%">
            <span class="info-label">活动时间：</span>
            <span class="info-con">{{bean.bgnValidTime}} ~ {{bean.endValidTime}}</span>
        </td>-->
    </tr>
    {{/if}}
    </tbody>
</table>
