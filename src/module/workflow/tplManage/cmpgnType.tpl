{{#if cmpgnType}}
    {{#each cmpgnType}}
        {{#expression @index '>' '0'}}
            <label class="label-type"><input name="cmpgnTypeCd" value="{{cmpgnTypeCd}}" type="radio"/>{{name}}</label>
        {{else}}
            <label class="label-type"><input name="cmpgnTypeCd" value="{{cmpgnTypeCd}}" type="radio" checked/>{{name}}</label>
        {{/expression}}
    {{/each}}
{{/if}}