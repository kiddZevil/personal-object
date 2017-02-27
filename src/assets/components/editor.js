/**
 * Created by lizhao on 2016/2/29.
 */
window.UEDITOR_HOME_URL="src/assets/lib/ueditor/";
define(['Util','ueditorConfig','ueditor'],function (Util) {
    return  Util.extend({
        _initialize:function(option){
            this.option = option;
            var editorID = 'sn-editor-' + Math.random();
            this.$el.attr('id', editorID);
            var opt= $.extend({

                // 服务器统一请求接口路径
                serverUrl: "/busimng/src/assets/lib/ueditor/jsp/controller.jsp",
                initialFrameHeight:400, //初始化编辑器高度,默认320
                autoHeightEnabled:false // 是否自动长高,默认true
       /*         ,toolbars: [
                    [
                        'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'formatmatch', 'autotypeset', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink', '|',
                        'simpleupload', 'attachment', 'background', '|',
                        'horizontal', 'date', 'time', 'spechars', 'snapscreen', '|',
                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                        'print', 'preview', 'searchreplace'
                    ]

                ]*/
            },option);
            UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
			UE.Editor.prototype.getActionUrl = function(action) {
			if (action == 'uploadimage'
						|| action == 'uploadscrawl'
						|| action == 'uploadimage') {
					return '/busimng/front/sh/common!uploadUeditorImg?uid=up001';
				} else if (action == 'uploadvideo') {
					return '/busimng/front/sh/common!uploadUeditorImg?uid=up001';
				} else {
					return this._bkGetActionUrl.call(this,action);
				}
			};
            
            
            this.ue=UE.getEditor(editorID,opt);
            this.ue.ready($.proxy(function() {
                //设置编辑器的内容
                this.ue.setContent('hello');
                //获取html内容，返回: <p>hello</p>
                var html = this.ue.setContent(option.content);
                //获取纯文本内容，返回: hello
                // var txt = ue.getContentTxt();
            },this));

            this.content = this.el;
        }, 
        setContent:function(html){
            return this.ue.setContent(html);
        },
        ue:function(){
        	return this.ue;
        },
        getContent:function(){
            return this.ue.getContent();
        }
    });


});