<!--查询结果列表-->
            <table  cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                    <th>账号</th>
                    <th>归属渠道</th>
                    <th>创建时间</th>
                    <th>上次登录时间</th>
                    <th>角色</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {{#if beans}}
                {{#each beans}}
                <tr>
                    <td>{{userNm}}</td>
                    <td title="{{chnlNm}}">{{chnlNm}}</td>
                    <td>{{crtTime}}</td>
                    <td>
                        {{#if lastOneTmsLoginTime}}
                            {{lastOneTmsLoginTime}}
                        {{else}}
                            暂无信息
                        {{/if}}
                    </td>
                    <td>{{roleNm}}</td>
                    <td class="action">
                        {{#expression roleId '==' "001" }}
                        {{else}}
                        <a href="javascript:;" class="J_click_detail" data-id="{{userId}}">查看</a>
                        <a href="javascript:;" class="J_click_edit" data-id="{{userId}}">编辑</a>
                   {{#expression validStsCd '==' "1" }}
     <a href="javascript:;"  data-operation="startAcc" class="J_click_operation" data-id="{{userId}}" validStsCd="{{validStsCd}}">停用</a>
                                                    {{else}}
     <a href="javascript:;"  data-operation="startAcc" class="J_click_operation" data-id="{{userId}}" validStsCd="{{validStsCd}}">启用</a>
                                                {{/expression}}
                        {{/expression}}

                    </td>
                </tr>
                     {{/each}}
                      {{else}}
                         <tr height="239">
                             <td  colspan="6" class="fn-txt-center"><img src="src/assets/img/no-data.png" style="margin-right:0px;"><h1>暂无数据</h1></td>
                         </tr>
                {{/if}}

                </tbody>
            </table>