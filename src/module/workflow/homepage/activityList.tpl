<div class="sn-list fn-clear mt-15 c-activity-list">
    <table>
        <thead>
            <tr>
                <!--<th class="c-tb-checkbox"><input type="checkbox" name="selectAll" /></th>-->
                <th width="15%">活动编号</th>
                <th>活动名称</th>
                <th width="7%">活动类型</th>
                <th width="8%">渠道</th>
                <th width="16%">活动有效期</th>
                <th width="8%">状态</th>
                <th width="8%">启用标识</th>
                <th width="20%">操作</th>
            </tr>
        </thead>
        <tbody>
        {{#if beans}}
            {{#each beans}}
        {{#expression cmpgnStsCd '==' "05"}}
            <tr data-id="{{cmpgnId}}" data-state="{{strtupStsCd}}" data-type="{{cmpgnTypeCd}}" data-ctype="{{cmpgnChildTypeCd}}" data-ctype="{{cmpgnChildTypeCd}}">
        {{else}}
            <tr data-id="{{cmpgnId}}" data-state="{{strtupStsCd}}" data-type="{{cmpgnTypeCd}}" data-ctype="{{cmpgnChildTypeCd}}" data-path="{{tmpltPath}}">
        {{/expression}}

                    <!--<td class="fn-txt-center"><input type="checkbox" name="activity" /></td>-->
                    <td class="td-show-more">{{cmpgnId}}</td>
                    <td class="fn-txt-left td-show-more">{{cmpgnNm}}</td>
                    <td>
                        {{cmpgnTypeCdNm}}
                        {{#if cmpgnChildTypeCdNm}} / {{cmpgnChildTypeCdNm}} {{/if}}
                    </td>
                    <td title="{{mktgChnlNm}}">{{mktgChnlNm}}</td>
                    <td class="td-show-more" title="{{bgnValidTime}} - {{endValidTime}}">{{bgnValidTime}} - {{endValidTime}}</td>
                    <td class="tag-status">
                        {{#expression cmpgnStsCd '==' "01" }}
                            <span class="t-tag t-tag-edit fn-text-center">草稿</span>
                        {{/expression}}
                        {{#expression cmpgnStsCd '==' "03" }}
                        <span class="t-tag t-tag-edit fn-text-center">未开展</span>
                        {{/expression}}
                        {{#expression cmpgnStsCd '==' "04" }}
                        <span class="t-tag t-tag-edit fn-text-center">已开展</span>
                        {{/expression}}
                        {{#expression cmpgnStsCd '==' "05" }}
                        <span class="t-tag t-tag-edit fn-text-center">已结束</span>
                        {{/expression}}
                    </td>
                 <td class="begin-or-stop">
                  {{#expression cmpgnStsCd '!=' "01"}}
                    {{#expression strtupStsCd '==' "01"}}  <!--活动开启状态显示-->
                     <span class="t-tag-todo" style="background:#60bb58;">已开启</span>
                    <span style="display:none" class="t-tag">已停用</span>
                    {{/expression}}
                    {{#expression strtupStsCd '==' "02"}}  <!--活动停止状态显示-->
                  <span style="display:none; background:#60bb58;" class="t-tag-todo"> 已开启</span>
                   <span class="t-tag">已停用</span>
                    {{/expression}}
                   {{/expression}}
                     {{#expression cmpgnStsCd '==' "01"}}
                     <span class="t-tag-todo" style="background:#60bb58;display:none;">已开启</span>
                     <span style="display:none" class="t-tag">已停用</span>
                     {{/expression}}
                 </td>

                    <td class="act-td">
                        {{#expression cmpgnStsCd '==' "01"}}
                            <a href="javascript:;" data-operation="issue-act" class="btn btn-link oper-activity">发布</a>
                            <a href="javascript:;" data-operation="edit-act" class="btn btn-link oper-activity">编辑</a>
                        {{/expression}}

                        {{#expression cmpgnStsCd '!=' "01"}}
                            {{#expression cmpgnStsCd '!=' "05"}}
                                {{#expression strtupStsCd '==' "01" }}
                                    <a href="javascript:;" data-operation="begin-act" class="btn btn-link oper-activity">停止</a>
                                {{/expression}}
                                {{#expression strtupStsCd '==' "02" }}
                                    <a href="javascript:;" data-operation="stop-act" class="btn btn-link oper-activity">开始</a>
                                {{/expression}}
                            {{/expression}}
                        {{/expression}}

                        <a href="javascript:;" data-operation="look-act" class="btn btn-link oper-activity">查看</a>

                        {{#expression cmpgnStsCd '==' "01"}}
                            <a href="javascript:;" data-operation="preview-act" class="btn btn-link oper-activity">预览</a>
                            <a href="javascript:;" data-operation="del-act" class="btn btn-link oper-activity">删除</a>
                        {{/expression}}

                        {{#expression cmpgnStsCd '==' "03" '||' cmpgnStsCd '==' "04"}}
                            <a href="javascript:;" data-operation="share-act" class="btn btn-link oper-activity">分享</a>
                        {{/expression}}
                    </td>
                </tr>
            {{/each}}
        {{else}}
            <tr height="239">
                <td  colspan="9" class="fn-txt-center c-tips-data"><img src="src/assets/img/no-data.png" style="margin-right:0px;"><h1>暂无数据
                </h1></td>
            </tr>
        {{/if}}
        </tbody>
    </table>
</div>