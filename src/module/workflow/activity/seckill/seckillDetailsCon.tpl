<table>
    <thead>
    <tr class="c-table-tit">
        <th width="14%">活动资源信息</th>
        <th width="20%"></th>
        <!--<th width="10%"></th>!-->
        <th width="34%"></th>
        <th width="8%"></th>
        <th width="8%"></th>
        <th width="10%"></th>
    </tr>
    <tr class="c-table-class">
        <th>商品名称</th>
        <th>活动时间</th>
        <!--<th>限购</th>!-->
        <th>商品规格</th>
        <th>数量</th>
        <th>原价</th>
        <th>秒杀价</th>
    </tr>
    </thead>
    <tbody>
    {{#if beans}}
        {{#each beans}}
            {{#each cmpnList}}
                <tr data-rowspan="{{../cmpnTotal}}">
                    <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}} td-show-more">
                        {{../rsNm}}
                    </td>
                    <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}}">
                        {{bgnTime}}<br /> ~ <br />{{finishTime}}
                    </td>
                    <!--<td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}} td-show-more">
                        {{#compare lmtpchsFlag '==' "0"}}
                            否
                        {{else}}
                            限购 {{lmtpchsQty}} 件
                        {{/compare}}
                    </td>!-->
                    <td class="td-img td-show-more">
                        {{#if componPicUrlAddr}}
                                <img src="{{../../imgUrl}}{{componPicUrlAddr}}" alt="{{componNm}}" title="{{componNm}}">
                                <span>{{componNm}}</span>
                            {{else}}
                                {{componNm}}
                        {{/if}}
                    </td>
                    <td title="{{setupQty}}">
                        {{setupQty}}
                    </td>
                    <td title="{{origUprc}}">
                        {{origUprc}}
                    </td>
                    <td title="{{pmtUprc}}">
                        {{pmtUprc}}
                    </td>
                </tr>
            {{/each}}
        {{/each}}
    {{/if}}
    </tbody>
</table>