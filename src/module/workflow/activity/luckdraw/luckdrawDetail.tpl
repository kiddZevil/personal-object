<table>
    <thead>
    <tr class="c-table-tit">
        <th width="35%">活动资源信息</th>
        <th width="10%"></th>
        <th width="45%"></th>
        <th width="10%"></th>
    </tr>
    <tr class="c-table-class">
        <th>奖品等级</th>
        <th>中奖概率</th>
        <th>奖品名称</th>
        <th>奖品数量</th>
    </tr>
    </thead>
    <tbody>
    {{#if beans}}
        {{#each beans}}
            {{#each cmpnList}}
                <tr data-rowspan="{{../cmpnTotal}}">
                 <!--奖品等级-->
                    <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}} td-img">
                        <img src="{{../../imgUrl}}{{../przitmPicUrlAddr}}" alt="{{../lvlNm}}" title="{{../lvlNm}}">
                        <span style="line-height: 50px; margin-left: 8px">{{../lvlNm}}</span>
                    </td>
                     <!--中奖概率-->
                   <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}}">
                                {{../winprzRate}}
                            </td>
                    <!--奖品名称-->
                    <td class="td-img">
                        <img src="{{../../imgUrl}}{{prizePicUrlAddr}}" alt="{{rsNm}}" title="{{rsNm}}">
                        <span title="{{rsNm}}">{{rsNm}}</span>
                    </td>
                    <!--奖品数量-->
                    <td>
                        {{prizePreprQty}}
                    </td>

                </tr>
            {{/each}}
            {{#expression lvlCd '==' "00" }}
                <tr>
                    <!--奖品等级-->
                    <td class="td-img">
                        <img src="{{../imgUrl}}{{przitmPicUrlAddr}}" alt="{{lvlNm}}" title="{{lvlNm}}">
                        <span style="line-height: 50px; margin-left: 8px" title="{{lvlNm}}">{{lvlNm}}</span>
                    </td>
                    <!--中奖概率-->
                    <td>
                        {{winprzRate}}
                    </td>
                    <!--奖品名称-->
                    <td class="td-img">
                        <img src="{{../imgUrl}}{{przitmPicUrlAddr}}" alt="{{rsNm}}" title="{{rsNm}}">
                        <span>再来一次</span>
                    </td>
                    <!--奖品数量-->
                    <td>
                        {{prizeItemQty}}
                    </td>

                </tr>
            {{/expression}}
        {{/each}}
    {{/if}}
    </tbody>
</table>