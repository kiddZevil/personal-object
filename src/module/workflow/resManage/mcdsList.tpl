 {{#each beans}}
     <tr data-id="{{srcSysId}}">
      	<td><input class="g-mcdsAdd" name="addMcds" type="radio" data-id="{{cmpgnRsId}}"></td>  
         <td class="mcdsId td-show-more">{{mcdsId}}</td><!-- 商品编码 -->
         <td class="mcdsNm td-show-more">{{mcdsNm}}</td><!-- 商品名称 -->
         <td class="smallType td-show-more">{{smallType}}</td><!-- 类目 -->
         <td class="prodUprc td-show-more">{{prodUprc}}</td><!-- 商品价格 -->
         <td class="td-show-more mrctId fn-hide">{{mrctId}}</td><!-- 店铺ID -->
         <td class="shopNm td-show-more">{{shopNm}}</td><!-- 店铺名称 -->
         <td class="fn-hide preprQty">{{preprQty}}</td><!-- 剩余数量 -->
     </tr>
{{/each}}

