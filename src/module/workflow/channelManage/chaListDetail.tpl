<!--查询结果列表-->
 <table cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                    <th>渠道编码</th>
                    <th>渠道名称</th>
                    <th>创建时间</th>
                    <th>创建人</th>
                    <th>渠道状态</th>
                    <th>渠道负责人</th>
                    <th>联系方式</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                 {{#if beans}}
                 {{#each beans}}
                <tr>
                <td class="mktgChnlId ">{{mktgChnlId}}</td>
                    <td class="mktgChnlNm" title="{{mktgChnlNm}}">{{mktgChnlNm}}</td>
                    <td>{{crtTime}}</td>
                    <td class="crtUserNm">{{crtUserNm}}</td>
                    <td>正常</td>
                    <td class="chnlRspderNm">{{chnlRspderNm}}</td>
                    <td class="chnlRspderTelnum">{{chnlRspderTelnum}}</td>
                    <td class="action">
                        <a href="javascript:;" class="G-chanEdit"  mktgChnlId="{{mktgChnlId}}">编辑</a>
                        <a href="javascript:;" class="G-chanDel" mktgChnlId="{{mktgChnlId}}" validStsCd="{{validStsCd}}">删除</a>
                    </td>
                </tr>
                {{/each}}
                {{else}}
                 <tr height="239">
              <td  colspan="8" class="fn-txt-center"><img src="src/assets/img/no-data.png" style="margin-right:0px;"><h1>暂无数据</h1></td>
                 </tr>
                {{/if}}
                </tbody>
            </table>