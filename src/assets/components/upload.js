/**
 * Created by lizhao on 2016/7/20.
 * http://blueimp.github.io/jQuery-File-Upload/basic-plus.html
 */
 /*
'assets/lib/jQuery-File-Upload/js/canvas-to-blob.min',
'assets/lib/jQuery-File-Upload/js/jquery.fileupload-process',
    'assets/lib/jQuery-File-Upload/js/jquery.fileupload-image'

 */
define(['Util',
    'jquery.ui.widget',
    'jquery.iframe',
    'jquery.fileuploader'
    ],function (Util,widget,iframe,fileupload) {
    var init=function(){};
    var objClass=function(options){
    	var _this=this;
        this.options = $.extend({
            el:"",
            url:"/server/php/",
            imageMaxWidth:480,
            imageMaxHeight:480,
            name:"file",
            /*accept:'accept="image/!*"'*/
            accept: 'accept="*"'
        }, options);
        this.$el=$(this.options.el).css({"position":"relative"});
        this.$input=$('<input  type="file" style="position: absolute;opacity: 0;filter: alpha(opacity=0);filter: alpha(opacity=0);-moz-opacity: 0;' +
            'left: 0;top: 0;bottom: 0;height: 100%;width: 100%;right: 0;cursor: pointer;z-index: 2;" ' +
            'name="'+this.options.name+'" '+this.options.accept+' multiple/>').appendTo(this.$el);
      /*  this.$el.on("click", $.proxy(function(){
            this.$el.find("input[name="+this.options.name+"]").click();
        },this));*/
        this.$input.fileupload({
            url:this.options.url,
            dataType : 'json',
            formData:this.options.formData,
            disableImageResize:false,
            imageMaxWidth: this.options.imageMaxWidth,
            imageMaxHeight: this.options.imageMaxHeight
        }).on('fileuploadprocessalways', function (e, data) {
            _this.options.processalways&&_this.options.processalways(e,data,_this.$el)
        }).on('fileuploadadd', function (e, data) {
            var isReturn=true;
            _this.options.add&&_this.options.add(e,data,_this.$el);
            if(isReturn==false){
                return false
            }
        }).on('fileuploadsubmit', function (e, data) {
            var isReturn=true;
            _this.options.submit&&(isReturn=_this.options.submit(e,data,_this.$el));
            if(isReturn==false){
                return false
            }
        }).on('fileuploaddone', function (e, data) {
            _this.options.done&&_this.options.done(e,data,_this.$el)
        }).on('fileuploadprogressall', function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            _this.options.progressall&&_this.options.progressall(e,data,_this.$el)
        }).on('fileuploadfail', function (e, data) {
            _this.options.fail&&_this.options.fail(e,data,_this.$el)
        }).on("click change",function(event){
            event.stopPropagation();
        })
    };
   /* var objClass=Util.extend({
        _initialize:function(options){
            
        }
    });*/

    init.upload=function(option){
        new objClass(option);
    };
  /*  var objClass=function(option){
        this.option
    };
*/
    return init
});