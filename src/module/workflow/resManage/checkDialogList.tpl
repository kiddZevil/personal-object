
    {{#if bean}}
    <tr>
			<td width="33.33%" style="display: table; width: 100%; border: 0">
				<div class="info-label" style="display: table-cell; vertical-align: middle;width:33%; width:100px\0;width:100px\9;">
                    <span>资源名称：</span>
                </div>
                <span class="info-con" style="display: table-cell; width: 60%">{{bean.rsNm}}</span>
			</td>
	        <td width="33.33%">
	            <span class="info-label">资源类型：</span>	            
	            <span class="info-con">
	            {{#expression bean.rsTypeCd "==" "01"}}
	            	实物
	            {{/expression}}
	            {{#expression bean.rsTypeCd "==" "02"}}	
	            	优惠券
	            {{/expression}}
	            {{#expression bean.rsTypeCd "==" "03"}}	
	           		虚拟物品
	           	{{/expression}} 
	            </span>
	        </td>
	        <td width="33.33%">
	            <span class="info-label">资源编号：</span>
	            <span class="info-con">{{bean.cmpgnRsId}}</span>
	        </td>
	    </tr>	   
	    <tr>
	        <td  width="33.33%">
	            <span class="info-label">创建人：</span>
	            <span class="info-con">{{bean.crtUserNm}}</span>
	        </td>           
	    	<td width="33.33%">
				<span class="info-label">创建时间：</span>
	            <span class="info-con">{{bean.crtTime}}</span>
	        </td>
	        <td width="33.33%">
				<span class="info-label">状态：</span>
	            {{#expression bean.validStsCd "==" "1"}}
	            <span class="t-tag-todo">
		            	已启用
	            </span>
		            {{/expression}}
		            {{#expression bean.validStsCd "==" "0"}}
		            <span class="t-tag">
		            	已停用
		            	</span>
		            {{/expression}}	            
	        </td>	        
	    </tr>
    
    
    {{#expression bean.rsTypeCd "==" "01"}}
	    
	    <tr>
	    <td width="33.33%">
				<span class="info-label">是否为商品：</span>
	            <span class="info-con">
	            
					{{#expression bean.mcdsFlag "==" "0"}}
		            	不是
		            {{/expression}}
		            {{#expression bean.mcdsFlag "==" "1"}}
		            	是
		            {{/expression}}
	            </span>
	        </td>
	        <td>				
				{{#expression bean.mcdsFlag "==" "1"}}
					<span class="info-label">归属店铺：</span>
					<span class="info-con">
						{{bean.mrctNm}}
					</span>
	            {{/expression}}
	        </td>
	        <td>								
	        </td>
	    </tr>
	     <tr>	        
	        <td width="33.33%">
				<span class="info-label">归属渠道ID：</span>
	            <span class="info-con">{{bean.mktgChnlId}}</span>
	        </td>
	        <td width="33.33%">
				<span class="info-label">数量：</span>
	            <span class="info-con">{{bean.preprQty}}</span>
	        </td>
	        <td width="33.33%">
				<span class="info-label">剩余：</span>
	            <span class="info-con">{{bean.leftQty}}</span>
	        </td>        
	    </tr>    	    
	{{/expression}}
	{{#expression bean.rsTypeCd "==" "02"}}
	    
	     <tr>	     	
	     	<td width="33.33%">
	            <span class="info-label">发放方式：</span>
	            <span class="info-con">{{bean.giveModeCd}}</span>
	        </td>
	        <td width="33.33%">
	            <span class="info-label" style="vertical-align: top;">有效期：</span>
	            <span class="info-con">{{bean.bgnValidTime}} 至 {{bean.endValidTime}}</span>
	        </td>
	        <td>
	            <span class="info-label">面值金额：</span>
	            <span class="info-con">{{bean.coupnFcvalAmt}}</span>
	        </td>             	    	
	    </tr>
	    <tr>	        
	        <td width="33.33%">
				<span class="info-label">归属渠道ID：</span>
	            <span class="info-con">{{bean.mktgChnlId}}</span>
	        </td>
	        <td width="33.33%">
				<span class="info-label">数量：</span>
	            <span class="info-con">{{bean.preprQty}}</span>
	        </td>
	        <td width="33.33%">
				<span class="info-label">剩余：</span>
	            <span class="info-con">{{bean.leftQty}}</span>
	        </td>        
	    </tr>   	   
	{{/expression}}
	{{#expression bean.rsTypeCd "==" "03"}}	    
	    <tr>
	        <td width="33.33%">
				<span class="info-label">渠道ID：</span>
	            <span class="info-con">{{bean.mktgChnlId}}</span>
	        </td>
	         <td width="33.33%">
				<span class="info-label">数量：</span>
	            <span class="info-con">{{bean.preprQty}}</span>
	        </td>
	        <td width="33.33%">
				<span class="info-label">剩余：</span>
	            <span class="info-con">{{bean.leftQty}}</span>
	        </td>
	    </tr>   
	{{/expression}}
	<tr>
	        <td colspan="3" class="c-info-txt">
	            <div class="fn-clear">
	                <span class="info-label">资源描述：</span>
	                <span class="info-con">
	                    {{bean.rsDesc}}
	                </span>
	            </div>
	        </td>
	    </tr>
	    <tr>
	        <td colspan="3" class="c-info-txt">
	            <div class="fn-clear">
	                <span class="info-label" style="vertical-align: top;">资源图片：</span>
	                <span class="info-con">
	                {{#if bean.rsPicPath}}
	                	<img width="200" src="{{bean/prePath}}{{bean.rsPicPath}}"/>	  
	                {{else}}
	                	<img width="200" src="src/assets/img/noImg.png"/>	
	                {{/if}}                  
	                </span>
	            </div>
	        </td>
	    </tr>
    {{/if}}
    