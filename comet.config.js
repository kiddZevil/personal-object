/**
 * Created by lizhao on 2016/9/23.
 */

module.exports = {
    name:"busimng_npm",
    appDir:"src/",
    projectType:"r00",
    connect:{
        port: 8090,
        dataDir:'src/assets/data/',
        mockConfig:"src/assets/_config/mockConfig.js"
    },
    font:{
        entry:"src/assets/_svg/",
        fontName: 'iconfont',
        formats: ['ttf', 'eot', 'woff','svg'],
        output:"src/assets/iconfont/"
    },
    images:{
        entry:"src/assets/_img/", // 要合成的图片路径
        imageType:".png", // 合成的图片类型
        spriteCss:"../css/",    // 合并后生成的css文件名称及地址
        padding:5,   //合并时两个图片的间距
        algorithm: "top-down", // 合并图片的排列方式
        cssTemplate: "./css/spriteTemplate.css", // css模版
        output:"src/assets/images" // 生成雪碧图的保存位置
    },
    sass:{
        sassUrl:"src/assets/sass/",
        output:"src/assets/css/"
    },
    release:{
        appDir: 'src/',
        baseUrl: './',
        css:[
            "assets/css/_style.css",
            'assets/css/basic.css',
            'assets/css/common.css',
            'assets/css/app_new.css',
            'assets/css/Tab.css',
            'assets/css/ProcessBar.css',
            'assets/css/scrollBar.css',
            'assets/css/PopWin.css',
            'assets/css/droplist.css',
            'assets/css/index.css'
        ],
        mainConfigFile: "assets/common/requirejsMain.js",
        cssMini:"assets/css/combined.css",
        _index:"_index.html",
        index:"index.html",
        dir: 'release/',
        dirRoot:"/ngcs/",
        // optimize: 'uglify2',
        // preserveLicenseComments: false,
        // optimizeCss: 'standard',
        modules:"moduleList.js",
        deleteFileConfig:"deleteFileConfig.js"
    }
};
