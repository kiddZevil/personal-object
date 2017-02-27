
var gulp = require('gulp')
    ,release = require('cm-release-require')
    ,fs = require('fs')
    ,path = require('path')
    // ,iconfont = require('gulp-iconfont')
    ;

/*//字体图标生产
gulp.task('iconfont', function () {
    return gulp.src(['src/assets/_svg/*.svg'])
        .pipe(iconfont({
            fontName: 'iconfont-gulp',
            prependUnicode: true,
            _demoHtml:"src/assets/css/iconfont-gulp/_iconfont.html",
            demoHtml:"src/assets/css/iconfont-gulp/iconfont.html",
            //targetPath: 'svg.css',
            cssName: 'src/assets/css/iconfont.css',
            formats: ['ttf', 'eot', 'woff','svg'], // default, 'woff2' and 'svg' are available
            timestamp: Math.round(Date.now()/1000)
        }))
        .on('glyphs', function(glyphs, options) {
            var arr = [], fontName = 'iconfont-gulp/' + options.fontName,Htmlarr=[];
            arr.push('@font-face {font-family: "' + options.fontName + '";' +
                'src: url("' + fontName + '.eot?t=' + options.timestamp + '"), ' +
                'url("' + fontName + '.woff?t=' + options.timestamp + '") format("woff"),' +
                'url("' + fontName + '.ttf?t=' + options.timestamp + '") format("truetype"),' +
                'url("' + fontName + '.svg?t=' + options.timestamp + '") format("svg");' +
                '}\n');
            Htmlarr.push('<div class="clearfix warp">'+"\n");
            arr.push('.iconfont,.product_font{font-family:"' + options.fontName+'" !important;font-style:normal;font-size:1.15rem;-webkit-font-smoothing: antialiased;-webkit-text-stroke-width: 0.2px;}\n')
            glyphs.forEach(function (item) {
                Htmlarr.push('<div class="fn-left warp-item"><p><span class="iconfont icon-'+item.name+'"></span></p><p>iconfont<br>icon-'+item.name+'</p></div>'+"\n");
                arr.push(".icon-"+item.name+":before{ content: '"+item.unicode[0]+"';}\n");
            });
            Htmlarr.push('</div>');
            fs.writeFile(options.demoHtml, fs.readFileSync(options._demoHtml,'utf-8').replace(new RegExp('\{\{content\}\}','g'),Htmlarr.join('')));
            fs.writeFile(options.cssName, arr.join(''));
        })
        .pipe(gulp.dest('src/assets/css/iconfont-gulp/'));
});*/

//开启服务
gulp.task('connect', function() {
    release.connect({
        port: 8890,
        root:'./',
        proxyRoot:'mamp',
        //release:true,
        dataDir:'src/assets/data/',
        mockConfig:"src/assets/_config/mockConfig.js"
    })
});