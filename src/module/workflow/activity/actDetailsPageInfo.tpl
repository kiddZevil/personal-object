<table>
    <thead>
    <tr class="c-table-tit">
        <th colspan="3">
            营销活动信息
        </th>
    </tr>
    </thead>
    <tbody>
    {{#if bean}}
    <tr>
        <td width="33.33%" style="display: table; width: 100%; border: 0">
            <div class="info-label" style="display: table-cell; vertical-align: middle;width:33%; width:100px\0;width:100px\9;">
                <span>活动名称：</span>
            </div>
            <span class="info-con" style="display: table-cell; width: 60%">{{bean.cmpgnNm}}</span>
        </td>
        <td width="33.33%">
            <span class="info-label">活动创建人：</span>
            <span class="info-con">{{bean.userNm}}</span>
        </td>
        <td width="33.33%">
            <span class="info-label">活动编号：</span>
            <span class="info-con">{{bean.cmpgnId}}</span>
        </td>
    </tr>
    <tr>
        <td width="33.33%">
            <span class="info-label">活动开始时间：</span>
            <span class="info-con">{{bean.bgnValidTime}}</span>
        </td>
        <td width="33.33%">
            <span class="info-label">活动结束时间：</span>
            <span class="info-con">{{bean.endValidTime}}</span>
        </td>
        <td width="33.33%"></td>
    </tr>
    {{#if bean.givprzTypeCd}}
        <tr>
            <td>
                <span class="info-label">派奖模式：</span>
                <span class="info-con">
                    {{#compare bean.givprzTypeCd '==' '01'}}
                        按抽奖
                    {{else}}
                        按排名
                    {{/compare}}
                </span>
            </td>
            <td>
                {{#compare bean.givprzTypeCd '==' '01'}}
                    <span class="info-label">抽奖门槛：</span>
                    <span class="info-con">
                        {{#compare bean.gameScore '!=' '0.00'}}
                            {{bean.gameScore}}分
                        {{else}}
                            {{bean.gameTmlenSecCnt}}秒
                        {{/compare}}
                    </span>
                {{/compare}}
            </td>
            <td>
                {{#if bean.przdrwTmsCntTypeCd}}
                <span class="info-label">抽奖次数：</span>
                <span class="info-con">
                    {{#compare bean.przdrwTmsCntTypeCd '==' '02'}}
                            每人总抽奖{{bean.przdrwTmsCnt}}次
                        {{else}}
                            每人每天最多抽奖{{bean.przdrwTmsCnt}}次
                    {{/compare}}
                </span>
                {{/if}}
            </td>
        </tr>
    {{/if}}
    {{#if bean.rwdPrzdrwChancFlag}}
        <tr>
            <td colspan="3" class="c-info-txt">
                <div class="fn-clear" {{bean.rwdPrzdrwChancFlag}}>
                    <span class="info-label">抽奖机会：</span>
                    <span class="info-con">
                        {{#compare bean.rwdPrzdrwChancFlag '==' '1'}}
                            抽奖机会不作为奖项
                        {{else}}
                            再来一次
                        {{/compare}}
                    </span>
                </div>
            </td>
        </tr>
    {{/if}}
    <tr>
        <td colspan="3" class="c-info-txt">
            <div class="fn-clear">
                <span class="info-label">活动简介：</span>
                <span class="info-con">
                    {{bean.cmpgnDesc}}
                </span>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="3" class="c-info-txt">
            <div class="fn-clear">
                <span class="info-label">活动规则说明：</span>
                <span class="info-con">
                    {{bean.cmpgnRuleCntt}}
                </span>
            </div>
        </td>
    </tr>
    {{/if}}
    </tbody>
</table>