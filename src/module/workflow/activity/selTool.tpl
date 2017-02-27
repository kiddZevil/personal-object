{{#if object}}
    <select class="sel-ptool c-form-control sel-act" name="cmpgnType">
        {{#each object}}
            <option value="{{cmpgnTypeCd}}" data-skip="{{skipUrl}}">{{name}}</option>
        {{/each}}
    </select>
{{else}}
    <select class="sel-ctool c-form-control sel-act" name="cmpgnChildType">
        {{#each beans}}
            <option value="{{cmpgnChildTypeCd}}" data-skip="{{skipUrl}}">{{name}}</option>
        {{/each}}
    </select>
{{/if}}