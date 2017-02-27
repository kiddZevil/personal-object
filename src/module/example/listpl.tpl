<div>
	{{#if beans}}
		{{#each beans}}
			<div style="width:500px;margin-top:20px;border:1px solid #ddd;">
				<table width="100%;" style="border-collapse:collapse">
					<tr>
						<th style="background:#f5f5f5;border-bottom:1px solid #ddd;">订单编号:{{mcds_unit_id}}</th>
						<th colspan="4" style="background:#f5f5f5;border-bottom:1px solid #ddd;">下单时间:{{createOrderTime}}</th>
						<th style="background:#f5f5f5;border-bottom:1px solid #ddd;">订单金额:<font color="red">{{refer_price}}</font>元</th>
					</tr>
					<tr>
						<td><img src="{{mcds_pic_url}}" width="50">{{mcds_unit_nm}}</td>
						<td>{{refer_price}}</td>
						<td>{{mcds_sku_qty}}</td>
						<td>{{refer_price}}</td>
						<td>{{payType}}</td>
						<td>{{orderStatus}}</td>
					</tr>
				</table>
			</div>
		{{/each}}
	{{/if}}
</div>