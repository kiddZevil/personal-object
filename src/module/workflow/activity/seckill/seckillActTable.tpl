{{#if flag}}
    {{#if object}}
        {{#each object}}
            {{#each cmpnList}}
                <tr data-id="{{../mcdsId}}" data-rowspan="{{../cmpnTotal}}" data-index="{{addIndex @index}}" class="tr-{{../mcdsId}}">
                    <input type="hidden" value="{{../mcdsId}}" name="mcdsId">
                    <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}}">
                        <input type="text" class="c-td-control input-large beg-time date-{{../mcdsId}}-beg" data-cl="time" name="bgnTime" value="{{bgnTime}}">
                    </td>
                    <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}}">
                        <input type="text" class="c-td-control input-large date-{{../mcdsId}}-end" data-cl="time" name="finishTime"
                               value="{{finishTime}}">
                    </td>
                    <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}}" style="display:none">
                        <div class="control-group">
                            <input type="hidden" name="lmtpchsFlag" value="{{lmtpchsFlag}}">
                            <div class="c-radio">
                                <label>
                                    {{#compare lmtpchsFlag '==' "0"}}
                                    <input class="ml-15 lmt no" data-i="{{../mcdsId}}" name="_{{rsComponId}}"
                                           data-check="no"
                                           type="radio"
                                           checked>
                                    {{else}}
                                    <input class="ml-15 lmt no" data-i="{{../mcdsId}}" name="_{{rsComponId}}"
                                           data-check="no" type="radio">
                                    {{/compare}}

                                    否
                                </label>
                            </div>
                            <div class="c-radio">
                                {{#compare lmtpchsFlag "==" "1"}}
                                <label>
                                    <input class="ml-15 lmt sel" data-i="{{../mcdsId}}" name="_{{rsComponId}}"
                                           data-check="yes" type="radio"
                                           checked>
                                    是，限购
                                </label>
                                <input type="text" name="lmtpchsQty" data-cl="qty" value="{{lmtpchsQty}}">
                                件
                                {{else}}
                                <label>
                                    <input class="ml-15 lmt sel" data-i="{{../mcdsId}}" name="_{{rsComponId}}"
                                           data-check="yes" type="radio">
                                    是，限购
                                </label>
                                <input type="text" class="{{../mcdsId}}" name="lmtpchsQty" disabled="disabled" data-cl="qty"
                                       value="{{lmtpchsQty}}">
                                件
                                {{/compare}}
                            </div>
                        </div>
                    </td>
                    <td rowspan="{{../cmpnTotal}}" class="td-show-more {{tdShow @index}}">
                        {{../rsNm}}
                    </td>
                    <td class="td-show-more" title="{{componNm}}">
                        {{componNm}}
                    </td>
                    <td style="display:none">
                        <input type="hidden" value="{{rsComponId}}" name="mcdsUnitId">
                        {{rsComponId}}
                    </td>
                    <td>
                        <input type="text" class="c-td-control input-small" data-cl="setup" name="setupQty" value="{{setupQty}}">
                    </td>
                    <td>
                        <input type="text" class="c-td-control input-small" data-cl="price" name="origUprc" value="{{origUprc}}">
                    </td>
                    <td>
                        <input type="text" class="c-td-control input-small" data-cl="price" name="pmtUprc" value="{{pmtUprc}}">
                    </td>
                    <td>
                        <a href="javascript:;" class="btn btn-link oper-delRes">删除</a>
                    </td>
                </tr>
            {{/each}}
        {{/each}}
    {{/if}}
{{else}}
    {{#if object}}
        {{#each object}}
            {{#each cmpnList}}
            <tr data-id="{{../cmpgnRsId}}" data-rowspan="{{../cmpnTotal}}" data-index="{{addIndex @index}}" class="tr-{{../cmpgnRsId}}">
                <input type="hidden" value="{{../cmpgnRsId}}" name="mcdsId">
                <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}}">
                    <input type="text" class="c-td-control input-large beg-time date-{{../cmpgnRsId}}-beg" data-cl="time" name="bgnTime" value="{{../../bTime}}">
                </td>
                <td rowspan="{{../cmpnTotal}}" class="{{tdShow @index}}">
                    <input type="text" class="c-td-control input-large date-{{../cmpgnRsId}}-end" data-cl="time" name="finishTime" value="{{../../eTime}}">
                </td>
                <td rowspan="{{../cmpnTotal}}" class="fn-hide {{tdShow @index}}" style="display:none">
                    <div class="control-group">
                        <input type="hidden" name="lmtpchsFlag" value="1">
                        <div class="c-radio">
                            <label>
                                <input class="ml-15 lmt no" data-i="{{cmpgnRsId}}" name="_{{rsComponId}}"
                                       data-check="no" type="radio">
                                否
                            </label>
                        </div>
                        <div class="c-radio">
                            <label>
                                <input class="ml-15 lmt sel" data-i="{{cmpgnRsId}}" name="_{{rsComponId}}"
                                       data-check="yes" type="radio" checked>
                                是，限购
                            </label>
                            <input type="text" class="{{cmpgnRsId}}" name="lmtpchsQty"
                            data-cl="qty" value="1">
                            件
                        </div>
                    </div>
                </td>
                <td rowspan="{{../cmpnTotal}}" class="td-show-more {{tdShow @index}}">
                    {{../rsNm}}
                </td>
                <td class="td-show-more" title="{{componNm}}">
                    {{componNm}}
                </td>
                <td class="fn-hide" style="display:none">
                    <input type="hidden" value="{{rsComponId}}" name="mcdsUnitId">
                    {{rsComponId}}
                </td>
                <td>
                    <input type="text" class="c-td-control input-small" data-cl="setup" name="setupQty" value="{{preprQty}}">
                </td>
                <td>
                    <input type="text" class="c-td-control input-small" data-cl="price" name="origUprc" value="{{componUprc}}">
                </td>
                <td>
                    <input type="text" class="c-td-control input-small" data-cl="price" name="pmtUprc" value="">
                </td>
                <td>
                    <a href="javascript:;" class="btn btn-link oper-delRes">删除
                    </a>
                </td>
            </tr>
            {{/each}}
        {{/each}}
    {{/if}}
{{/if}}
