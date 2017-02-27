{{#if beans}}
    {{#each beans}}
        <div class="c-section">
            <div class="c-section-header c-bg-gary">
                <span class="c-section-tit c-ml15 c-nobd">{{name}}</span>
            </div>
            <div class="c-section-con">
                <div class="tool-group fn-clear">
                    {{#each secondMenu}}
                        <dl class="tool-box" data-type="{{type}}" data-ctype="{{cType}}"  data-class="{{class}}" data-name="{{name}}" data-url="{{url}}">
                            <dd class="tool-box-t">
                                <div class="tool-tit"><b>{{icon}}</b></div>
                                <div class="tool-triangle-down"></div>
                            </dd>
                            <dd class="tool-box-c">
                                <div class="tit">{{name}}</div>
                                <div class="des">{{des}}</div>
                            </dd>
                            <dd class="tool-box-b">
                                <a href="javascript:;" class="btn fn-right add-activity" data-type="{{type}}" data-name="{{name}}" data-url="{{url}}">{{../flag}}</a>
                            </dd>
                        </dl>
                    {{/each}}
                </div>
            </div>
        </div>
    {{/each}}
{{/if}}