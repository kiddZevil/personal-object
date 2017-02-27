{{#each beans}}
	{{#if rsPicPath}}
	<tr data-url="{{../bean/prePath}}{{rsPicPath}}">
	{{else}}
	<tr data-url="">
	{{/if}}
      <td><input class="g-mcdsAdd" name="addMcds" type="radio" data-id="{{cmpgnRsId}}"></td>       
      <td>
         	      {{#expression rsTypeCd "==" "01"}}
		                     实物
		                {{/expression}}
		                {{#expression rsTypeCd "==" "02"}}
		                    优惠券
		                {{/expression}}
		                {{#expression rsTypeCd "==" "03"}}
		                    虚拟物品
		                {{/expression}}
         </td>    
         
         <td class="rsNm td-show-more">{{rsNm}}</td>
          <td class="res-goods-prc">
          {{#if coupnFcvalAmt}}
          	{{coupnFcvalAmt}}
          {{else}}
          	暂无
          {{/if}}
          </td>
          <td class="leftQty">{{leftQty}}</td>
         <td>{{crtTime}}</td>
     </tr>
{{/each}}