{{#if beans}}
    {{#each beans}}
        <tr data-id="{{cmpgnRsId}}" data-img="{{rsPicPath}}" data-qty="{{leftQty}}">
            <td class="fn-text-center">
                <input type="radio" name="resGoods" />
            </td>
            <td class="res-goods-type">
                {{#expression rsTypeCd '==' "01"}}
                实物
                {{/expression}}
                {{#expression rsTypeCd '==' "02"}}
                优惠券
                {{/expression}}
                {{#expression rsTypeCd '==' "03"}}
                虚拟物品
                {{/expression}}
            </td>
            <td class="fn-text-left res-goods-name">{{rsNm}}</td>
            <td class="res-goods-prc">
                {{#if prodUprc}}
                    {{prodUprc}}
                {{else}}
                    暂无
                {{/if}}
            </td>
            <td class="res-goods-amount">{{leftQty}}</td>
            <td class="res-goods-time">{{crtTime}}</td>
        </tr>
    {{/each}}
{{/if}}
