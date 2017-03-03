{{#if flag}}
    {{#if beans}}
        {{#each beans}}
        <tr data-id="{{mcdsId}}">
            <input type="hidden" name="mcdsId" value="{{mcdsId}}">
            <td>
                <input type="text" class="c-td-control input-large beg-time" data-cl="time"  name="bgnTime" value="{{bgnTime}}">
            </td>
            <td>
                <input type="text" class="c-td-control input-large" data-cl="time" name="finishTime" value="{{finishTime}}">
            </td>
            <td class="fn-text-left group-goods">
                <div class="fn-clear">
                    <div class="group-goods-img">
                        <img src="{{../imgUrl}}{{mcdsPic}}" alt="{{mcdsNm}}">
                    </div>
                    <div class="group-goods-info">{{mcdsNm}}</div>
                </div>
            </td>
            <td>
                <input type="text" class="c-td-control input-small" data-cl="price" name="origUprc" value="{{origUprc}}">
            </td>
            <td class="hidePrice {{#if ../hidePriceFlag}} fn-hide {{/if}}">
                <input type="text" class="c-td-control input-small" data-cl="price" name="pmtUprc" value="{{pmtUprc}}">
            </td>
            <td>
                <a href="javascript:;" class="btn btn-link oper-delRes">删除</a>
            </td>
        </tr>
        {{/each}}
    {{/if}}
{{else}}
    {{#if beans}}
        {{#each beans}}
        <tr data-id="{{mcdsId}}">
            <input type="hidden" name="mcdsId" value="{{mcdsId}}">
            <td>
                <input type="text" class="c-td-control input-large beg-time" data-cl="time"  name="bgnTime" value="{{../bTime}}">
            </td>
            <td>
                <input type="text" class="c-td-control input-large" data-cl="time" name="finishTime" value="{{../eTime}}">
            </td>
            <td class="fn-text-left group-goods">
                <div class="fn-clear">
                    <div class="group-goods-img">
                        <img src="{{rsPicPath}}" alt="{{rsNm}}">
                    </div>
                    <div class="group-goods-info">{{rsNm}}</div>
                 </div>
            </td>
            <td>
                <input type="text" class="c-td-control input-small" data-cl="price" name="origUprc" value="{{prodUprc}}">
            </td>
            <td class="hidePrice {{#if ../hidePriceFlag}} fn-hide {{/if}}">
                <input type="text" class="c-td-control input-small" data-cl="price" name="pmtUprc" value="{{prodUprc}}">
            </td>
            <td>
                <a href="javascript:;" class="btn btn-link oper-delRes">删除</a>
            </td>
        </tr>
        {{/each}}
    {{/if}}
{{/if}}
