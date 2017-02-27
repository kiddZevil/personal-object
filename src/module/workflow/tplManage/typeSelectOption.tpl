{{#if cmpgnType}}
    <option value="">全部</option>
    {{#each cmpgnType}}
        <option value="{{cmpgnTypeCd}}">{{name}}</option>
    {{/each}}
{{/if}}