<div class="sn-list fn-clear mt-15 c-activity-list">
    <table>
        <thead>
            <tr>
                <th width="15%">活动编号</th>
                <th>活动名称</th>
                <th width="7%">活动类型</th>
                <th width="16%">活动有效期</th>
                <th width="8%">状态</th>
                <th width="8%">浏览人数</th>
                <th width="8%">浏览次数</th>
                <th width="8%">参与人数</th>
                <th width="8%">参与次数</th>
                <th width="8%">人均参与数</th>
                <th width="8%">操作</th>
            </tr>
        </thead>
        <tbody>
        {{#if beans}}
            {{#each beans}}
                <tr data-id="{{cmpgnId}}" data-type="{{cmpgnTypeCd}}" data-btime="{{bgnValidTime}}" data-etime="{{endValidTime}}">
                    <td class="td-show-more">{{cmpgnId}}</td>
                    <td class="fn-txt-left td-show-more">{{cmpgnNm}}</td>
                    <td>
                        {{#expression cmpgnTypeCd '==' "01" }}
                            团购
                        {{/expression}}
                        {{#expression cmpgnTypeCd '==' "02" }}
                            秒杀
                        {{/expression}}
                        {{#expression cmpgnTypeCd '==' "03" }}
                            抽奖
                        {{/expression}}
                        {{#expression cmpgnTypeCd '==' "04" }}
                            签到
                        {{/expression}}
                        {{#expression cmpgnTypeCd '==' "05" }}
                            宣传
                        {{/expression}}
                        {{#expression cmpgnTypeCd '==' "06" }}
                            互动
                        {{/expression}}
                    </td>
                    <td class="td-show-more" title="{{bgnValidTime}} - {{endValidTime}}">{{bgnValidTime}} - {{endValidTime}}</td>
                    <td class="tag-status">
                        {{#expression cmpgnStsCd '==' "04" }}
                            <span class="t-tag t-tag-edit fn-text-center">已开展</span>
                        {{/expression}}
                        {{#expression cmpgnStsCd '==' "05" }}
                            <span class="t-tag t-tag-edit fn-text-center">已结束</span>
                        {{/expression}}
                    </td>
                    <td>{{#if visitors}} {{visitors}} {{else}} 0 {{/if}}</td>
                    <td>{{#if views}} {{views}} {{else}} 0 {{/if}}</td>
                    <td>{{#if joinPerson}} {{joinPerson}} {{else}} 0 {{/if}}</td>
                    <td>{{#if joinTimes}} {{joinTimes}} {{else}} 0 {{/if}}</td>
                    <td>{{#if joinTimesAvg}} {{joinTimesAvg}} {{else}} 0 {{/if}}</td>
                    <td class="act-td">
                        <a href="javascript:;" data-operation="edit-act" class="btn btn-link oper-activity open-details">数据分析
                        </a>
                    </td>
                </tr>
            {{/each}}
        {{else}}
            <tr height="239">
                <td  colspan="11" class="fn-txt-center c-tips-data"><img src="src/assets/img/no-data.png" style="margin-right:0px;"><h1>暂无数据
                </h1></td>
            </tr>
        {{/if}}
        </tbody>
    </table>
</div>