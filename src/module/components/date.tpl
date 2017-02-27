{{#if double}}
    {{#if label}}
        <label>
            {{{label}}}
        </label>
    {{/if}}
    <div class="time-box">
    <div class="beg-time-box">
        {{#if double.start}}
            <input name="{{double.start.name}}" class="wid45" type="text" value="{{double.start.value}}">
        {{/if}}
    </div>
        <span class="mid-txt">
        {{#if mid}}
            {{mid}}
        {{else}}
            至
        {{/if}}
        </span>
    <div class="end-time-box">
        {{#if double.end}}
            <input name="{{double.end.name}}" class="wid45" type="text" value="{{double.end.value}}">
        {{/if}}
    </div>
    </div>
{{else}}
    {{#if label}}
        <label>
            {{{label}}}
        </label>
    {{/if}}
    <div>
        <input type="text" name="{{name}}" value="{{value}}">
        <!--<i class="iconfont icon-riqi"></i>-->
    </div>
{{/if}}