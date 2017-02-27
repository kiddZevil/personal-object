/**
 * Created by lizhao on 2016/6/14.
 */
define(['Util', 'text!module/components/tab.tpl'],
    function (Util, tpl) {
        return  Util.extend({
            _initialize: function (options) {
                this.options = options;
                this.template = Util.hdb.compile(this.options.tpl ? this.options.tpl : tpl);
                this.options.activeClass = ( this.options.activeClass ? this.options.activeClass : 'active');
                this._eventInit();
                this._render();
                setTimeout($.proxy(function () {
                    var $li = $('.J_item_click', this.$el).first();
                    if ($li.length) {
                        $li.trigger("click");
                    }
                }, this), 200);
            },
            _eventInit: function () {
                this.$el.unbind("click");
                this.$el.on('click', ".J_item_click", $.proxy(this.itemClick, this));
            },
            _render: function () {
                this.$el.html(this.template(this.options.tabs));
                return this;
            },
            switchTab: function (title) {
                if ($('.J_item_click', this.$el).length > 1) {
                    $('.J_item_click', this.$el).each(function () {
                        var $li = $(this);
                        if ($li.html().indexOf(title)) {
                            $li.click();
                            return false;
                        }
                    })
                }
            },
            itemClick: function (e) {
                var $src = $(e.target || e.currentTarget).closest(".J_item_click");
                var index = this.$el.find('.J_item_click').index($src);
                var tabData = this.options.tabs[index];
                $('.J_item_click', this.$el).removeClass(this.options.activeClass);
                $src.addClass(this.options.activeClass);
                this.trigger('click', e, tabData);
                if (tabData && tabData.click) {
                    tabData.click(e, tabData);
                }
            },
            content:function(html){
                var $contentArea = $('>.J_tab_container>.J_tab_render>.J_content_render',this.$el);
                if (this.lastDom){
                    this.lastDom.detach();
                }
                if (typeof(html) == 'object'){
                    this.lastDom = html;
                    $contentArea.empty().append(html);
                }
                else{
                    $contentArea.html(html);
                }
            },
            destroy: function () {
                this.$el.remove();
            }
        });
    });
