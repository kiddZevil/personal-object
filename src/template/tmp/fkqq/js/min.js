function initSplash() {
    gameState = "splash",
        resizeCanvas(),
        previousTime = (new Date).getTime(),
        updateSplashScreenEvent()
}
function initStartScreen() {
    gameState = "start",
        gameScore = 0,
        background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height);
    /*var a = {
        oImgData: assetLib.getData("playBut"),
        /!*aPos: [canvas.width / 2, 430]*!/
        aPos: [110, 400]
    };*/
    var a = {
            oImgData: assetLib.getData("playBut"),
            aPos: [110, 400]
        },
        f = {
            oImgData: assetLib.getData("quitBut"),
            aPos: [260, 400]
        };
    userInput.addHitArea("startGame", butEventHandler, null, {
        type: "image",
        oImageData: a.oImgData,
        aCentrePos: a.aPos
    }),
        userInput.addHitArea("luckdraw", butEventHandler, null, {
            type: "image",
            oImageData: f.oImgData,
            aCentrePos: f.aPos
        });
    var b = new Array(a,f);
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), gameState, b, canvas.width, canvas.height),
        panel.startTween(),
        aDots = new Array;
    for (var c = 0; 2 > c; c++) {
        var d = new Elements.Dot(assetLib.getData("dot"), assetLib.getData("pop"), c, c, canvas.width, canvas.height);
        d.x = Math.random() * canvas.width,
            d.y = Math.random() * canvas.height,
            aDots.push(d)
    }
    previousTime = (new Date).getTime(),
        updateStartScreenEvent()
}
function initPreGame() {
    gameState = "tutorial";
    for (var a = 0; a < aTutorials.length; a++) if (aTutorials[a].gameNum == gameNum && !aTutorials[a].shown) {
        background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height);
        var b = {
            oImgData: assetLib.getData("playBut"),
            aPos: [canvas.width / 2, 465]
        };
        userInput.addHitArea("continue", butEventHandler, null, {
            type: "image",
            oImageData: b.oImgData,
            aCentrePos: b.aPos
        });
        var c = new Array(b);
        return panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), aTutorials[a].panelType, c, canvas.width, canvas.height),
            panel.startTween(),
            previousTime = (new Date).getTime(),
            updateTutorialEvent(),
            void 0
    }
    initGame()
}
function initGame() {
    gameState = "game",
        background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height),
        userInput.addHitArea("pause", butEventHandler, null, {
                type: "rect",
                aRect: [308, 0, 363, 66]
            },
            !0),
        hud = new Elements.Hud(assetLib.getData("hud"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), canvas.width, canvas.height),
        aDots = new Array,
        aSelected = new Array,
        //游戏时间
        gameTime = 30,
        gameScore = 0,
        blockTap = !1,
        balloonsPopped = 0,
        lastSelectedDot = null;
    for (var a = 0; 42 > a; a++) {
        var b = new Elements.Dot(assetLib.getData("dot"), assetLib.getData("pop"), a, getNewDotType(), canvas.width, canvas.height);
        b.targX = Math.round(62 * (a % 6) + 36),
            b.targY = Math.round(getYPosFromId(a)),
            b.fall(),
            userInput.addHitArea("dotHit", butEventHandler, {
                    id: a,
                    isDraggable: !0
                },
                {
                    type: "rect",
                    aRect: [b.x - 40, b.targY - 40, b.x + 40, b.targY + 40]
                }),
            aDots.push(b)
    }
    background.startScroll(20),
        userInput.addHitArea("mouseUp", butEventHandler, {
                multiTouch: !0
            },
            {
                type: "rect",
                aRect: [0, 0, canvas.width, canvas.height]
            }),
        previousTime = (new Date).getTime(),
        updateGameEvent()
}
function luckdraw(){
    if(givprzType === '01'){
        if(!Util.isLogin.login()){
            Util.act.power(chnlId); //未登录进行鉴权
        }else{
            //已登录进行抽奖
            var przMsg;
            Util.ajax.postJsonAsync('front/sh/game!execute?uid=m006&cmpgnId=' + cmpgnId,'',function(json,status){
                if(status) {
                    var bean = json.bean;
                    if(bean.lvlCd == '00'){
                        przMsg = '亲爱的用户，谢谢您的参与！';
                    }else{
                        przMsg = (!bean.lvlCd) ? bean.Msg : ('亲爱的用户，恭喜您中了'+ bean.lvlNm +'！<br />' + bean.rsNm);
                    }
                    Util.layer.confirm({
                        title : "抽奖结果",
                        content : przMsg,
                        btn : ['确认'],
                        yes : "",
                        no  : "",
                        cancel:""
                    })
                }
            });
        }
    }
}
function butEventHandler(a, b) {
    switch (a) {
        case "langSelect":
            console.log(b.lang),
                curLang = b.lang,
                ctx.clearRect(0, 0, canvas.width, canvas.height),
                userInput.removeHitArea("langSelect"),
                initLoadAssets();
            break;
        case "startGame":
            userInput.removeHitArea("startGame"),
            userInput.removeHitArea("luckdraw"),
                initPreGame();
            break;
        case "dotHit":
            if (blockTap) break;
            if (b.isBeingDragged) {
                if (null == lastSelectedDot) break;
                lastSelectedDot = aDots[b.id].trySelect(lastSelectedDot);
                for (var c = -1,
                         d = 0; d < aSelected.length; d++) aSelected[d] == lastSelectedDot && (c = d);
                if ( - 1 == c) aSelected.push(lastSelectedDot);
                else for (var d = c + 1; d < aSelected.length; d++) aSelected[d].unSelect(),
                    aSelected.splice(d, 1),
                    d -= 1
            } else aDots[b.id].type < 6 && (aDots[b.id].select(), lastSelectedDot = aDots[b.id], aSelected = new Array(lastSelectedDot));
            break;
        case "mouseUp":
            if (!b.isDown) {
                if (blockTap) break;
                if (aSelected.length >= 3) {
                    for (var e = 0,
                             f = aSelected.length,
                             g = !1,
                             d = 0; f > d; d++) {
                        if (7 == aSelected[d].type || 9 == aSelected[d].type) {
                            g = !0;
                            for (var h = 0; 6 > h; h++) {
                                for (var i = !0,
                                         j = 0; j < aSelected.length; j++) aSelected[j] == aDots[6 * Math.floor(aSelected[d].id / 6) + h] && (i = !1);
                                i && aSelected.push(aDots[6 * Math.floor(aSelected[d].id / 6) + h])
                            }
                        }
                        if (8 == aSelected[d].type || 9 == aSelected[d].type) {
                            g = !0;
                            for (var h = 0; 7 > h; h++) {
                                for (var i = !0,
                                         j = 0; j < aSelected.length; j++) aSelected[j] == aDots[aSelected[d].id % 6 + 6 * h] && (i = !1);
                                i && aSelected.push(aDots[aSelected[d].id % 6 + 6 * h])
                            }
                        }
                    }
                    sortThis(aSelected);
                    for (var d = 0; d < aSelected.length; d++) 10 == aSelected[d].type ? gameTime += 1 : 11 == aSelected[d].type && (gameTime += 3),
                        aSelected[d].hit(d / aSelected.length);
                    balloonsPopped += aSelected.length,
                        updateScore(10 * f * f + 100 * aSelected.length + 2 * e * 100 * aSelected.length),
                        blockTap = !0,
                        background.startScroll(aSelected.length)
                } else {
                    for (var d = 0; d < aSelected.length; d++) aSelected[d].unSelect();
                    aSelected = new Array
                }
                removedDots = 0,
                    lastSelectedDot = null
            }
            break;
        case "continue":
            userInput.removeHitArea("continue"),
            userInput.removeHitArea("luckdraw"),
                initGame();
            begTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            break;
        case "newGame":
            userInput.removeHitArea("pause"),
                userInput.removeHitArea("newGame"),
                userInput.removeHitArea("quitFromEnd"),
                gameNum++,
                initGame();
            break;
        case "luckdraw":
            if(flag == '0'){
                Util.layer.tips('预览中，不能抽奖');
                return;
            }else{
                luckdraw();
            }
            break;
        case "pause":
        case "resumeFromPause":
            toggleManualPause();
            break;
        case "quitFromPause":
            toggleManualPause(),
                userInput.removeHitArea("pause"),
                userInput.removeHitArea("dotHit"),
                userInput.removeHitArea("mouseUp"),
                userInput.removeHitArea("quitFromPause"),
                userInput.removeHitArea("resumeFromPause"),
                gameScore = 0,
                initStartScreen()
    }
}
function sortThis(a) {
    a.sort(function(a, b) {
        var c = a.id,
            d = b.id;
        return d > c ? -1 : c > d ? 1 : 0
    })
}
function updateScore(a) {
    gameScore += a,
        hud.updateScore(balloonsPopped)
}
function initGameOver() {
    gameState = "gameOver",
        userInput.removeHitArea("dotHit"),
        userInput.removeHitArea("mouseUp"),
        background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height);
    var a = {
            oImgData: assetLib.getData("playBut"),
            aPos: [110, 400]
        },
        b = {
            oImgData: assetLib.getData("quitBut"),
            aPos: [260, 400]
        };
    userInput.addHitArea("newGame", butEventHandler, null, {
        type: "image",
        oImageData: a.oImgData,
        aCentrePos: a.aPos
    }),
    userInput.addHitArea("luckdraw", butEventHandler, null, {
        type: "image",
        oImageData: b.oImgData,
        aCentrePos: b.aPos
    });
    var c = new Array(a,b);
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), gameState, c, canvas.width, canvas.height),
        panel.startTween(),
        panel.oScoreData = {
            gameScore: gameScore,
            balloonsPopped: balloonsPopped
        },
        previousTime = (new Date).getTime(),
        updateGameOver(),
        setScore(balloonsPopped);
    endTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    //游戏分数
    if(!Util.isLogin.login()){
        //判断是否登录上传分数
        Util.layer.confirm({
            content : '是否登录，并保存您的游戏分数？',
            close: false,
            okFn : function(){
                sessionStorage.setItem("gameScore",balloonsPopped);
                sessionStorage.setItem("bgnGameTime",begTime);
                sessionStorage.setItem("endGameTime",endTime);
                Util.act.power(chnlId);
                return
            },
            cancelFn : function(){}
        });
    }else{
        var loading = Util.layer.loading(10000);
        var param = {
            'cmpgnId':cmpgnId,
            'gameScore': balloonsPopped,
            'bgnGameTime':begTime,
            'endGameTime':endTime
        };
        Util.ajax.postJsonAsync(saveUrl,param,function(json,status){
            if(status){
                Util.layer.close(loading);
            }else{
                Util.layer.close(loading);
            }
        });
    }
}
function replaceDots() {
    for (var a = 0; a < aSelected.length; a++) {
        for (var b = 6; aSelected[a].id + b < 42 && !aDots[aSelected[a].id + b].canHit;) b += 6;
        aSelected[a].id > 36 || aSelected[a].id + b >= 42 ? aDots[aSelected[a].id].replaceWithNewDot(getNewDotType()) : (aDots[aSelected[a].id].replaceWithExistingDot(aDots[aSelected[a].id + b]), renderSprite(aDots[aSelected[a].id]), aDots[aSelected[a].id + b].canHit && (aDots[aSelected[a].id + b].canHit = !1, aSelected.push(aDots[aSelected[a].id + b]), sortThis(aSelected)))
    }
    aSelected = new Array,
        blockTap = !1
}
function getYPosFromId(a) {
    return 62 * Math.floor(a / 6) + 110
}
function getNewDotType() {
    return 9 * Math.random() < 8 ? Math.floor(6 * Math.random()) : Math.floor(6 * Math.random() + 6)
}
function updateGameEvent() {
    if (!manualPause && !rotatePause && "game" == gameState) {
        var a = getDelta();
        background.render(ctx);
        for (var b = 0; b < aDots.length; b++) aDots[b].update(a),
            renderSprite(aDots[b]),
        aDots[b].removeMe && (aDots[b].removeMe = !1, ++removedDots == aSelected.length && replaceDots());
        if (gameTime -= a, 0 >= gameTime) return initGameOver(),
            void 0;
        hud.render(ctx, Math.round(gameTime)),
            requestAnimFrame(updateGameEvent)
    }
}
//游戏结束
function updateGameOver() {
    if (!rotatePause && "gameOver" == gameState) {
        var a = getDelta();
        background.updateScroll(a),
            background.render(ctx),
            panel.update(a),
            panel.render(ctx),
            requestAnimFrame(updateGameOver)
    }
}
function updateSplashScreenEvent() {
    rotatePause || "splash" != gameState || (initStartScreen(), requestAnimFrame(updateSplashScreenEvent))
}
function updateStartScreenEvent() {
    if (!rotatePause && "start" == gameState) {
        var a = getDelta();
        background.updateScroll(a),
            background.render(ctx);
        for (var b = 0; b < aDots.length; b++) aDots[b].y -= (30 + 2 * b) * a,
            aDots[b].x = aDots[b].x - 50 * Math.sin(aDots[b].y / 50) * a,
        aDots[b].y < -100 && (aDots[b].x = Math.random() * canvas.width, aDots[b].y = canvas.height + 200 * Math.random() + 100),
            aDots[b].update(a),
            renderSprite(aDots[b]);
        panel.update(a),
            panel.render(ctx),
            requestAnimFrame(updateStartScreenEvent)
    }
}
function updateTutorialEvent() {
    if (!rotatePause && "tutorial" == gameState) {
        var a = getDelta();
        background.updateScroll(a),
            background.render(ctx),
            panel.update(a),
            panel.render(ctx),
            requestAnimFrame(updateTutorialEvent)
    }
}
function getDelta() {
    var a = (new Date).getTime(),
        b = (a - previousTime) / 1e3;
    return previousTime = a,
    b > .5 && (b = 0),
        b
}
function renderSprite(a) {
    ctx.save(),
        ctx.translate(a.x, a.y),
        ctx.scale(a.scaleX, a.scaleY),
        ctx.rotate(a.rotation),
        a.render(ctx),
        ctx.restore()
}
function checkSpriteCollision(a, b, c) {
    var d = a.x,
        e = a.y,
        f = b.x,
        g = b.y,
        h = (d - f) * (d - f) + (e - g) * (e - g),
        i = (a.radius + c) * (a.radius + c);
    return i > h ? !0 : !1
}
function loadPreAssets() {
    aLangs.length > 1 ? (preAssetLib = new Utils.AssetLoader(curLang, [{
        id: "langSelect",
        file: "image/game/poprush/langSelect.jpg?20141008V1"
    },
        {
            id: "preloadImage",
            file: "image/game/poprush/preloadImage.jpg?20141008V1"
        }], ctx, canvas.width, canvas.height, !1), preAssetLib.onReady(initLangSelect)) : initLoadAssets()
}
function initLangSelect() {
    var a = preAssetLib.getData("langSelect");
    ctx.drawImage(a.img, canvas.width / 2 - a.img.width / 2, canvas.height / 2 - a.img.height / 2);
    for (var b = 140,
             c = 0; c < aLangs.length; c++) {
        var d = canvas.width / 2 - b * aLangs.length / 2 + c * b,
            e = canvas.height / 2 - b / 2;
        userInput.addHitArea("langSelect", butEventHandler, {
                lang: aLangs[c]
            },
            {
                type: "rect",
                aRect: [d, e, d + b, e + 140]
            })
    }
}
function initLoadAssets() {
    loadAssets()
}
function loadAssets() {
    assetLib = new Utils.AssetLoader(curLang, [{
        id: "background",
        file: "image/game/poprush/background.png"
    },
        {
            id: "rotateDeviceMessage",
            file: "image/game/poprush/rotateDeviceMessage.jpg"
        },
        {
            id: "hud",
            file: "image/game/poprush/hud.png"
        },
        {
            id: "playBut",
            file: "image/game/poprush/playBut.png"
        },
        {
            id: "quitBut",
            file: "image/game/poprush/quitBut.png"
        },
        {
            id: "panels",
            file: "image/game/poprush/panels.png",
            oData: {
                columns: 2,
                spriteWidth: 383,
                spriteHeight: 550
            }
        },
        {
            id: "dot",
            file: "image/game/poprush/dots.png",
            oData: {
                oAnims: {
                    unSelected0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                    unSelected1: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
                    unSelected2: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
                    unSelected3: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
                    unSelected4: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
                    unSelected5: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119],
                    unSelected6: [120],
                    unSelected7: [121],
                    unSelected8: [122],
                    unSelected9: [123],
                    unSelected10: [124],
                    unSelected11: [125],
                    selected0: [126, 127, 128, 129],
                    selected1: [130, 131, 132, 133],
                    selected2: [134, 135, 136, 137],
                    selected3: [138, 139, 140, 141],
                    selected4: [142, 143, 144, 145],
                    selected5: [146, 147, 148, 149],
                    selected6: [150, 151, 152, 153],
                    selected7: [154, 155, 156, 157],
                    selected8: [158, 159, 160, 161],
                    selected9: [162, 163, 164, 165],
                    selected10: [166, 167, 168, 169],
                    selected11: [170, 171, 172, 173]
                },
                columns: 16,
                spriteWidth: 64,
                spriteHeight: 86
            }
        },
        {
            id: "pop",
            file: "image/game/poprush/pop.png",
            oData: {
                oAnims: {
                    pop: [0, 1, 2, 3, 4, 5]
                },
                columns: 6,
                spriteWidth: 156,
                spriteHeight: 141
            }
        },
        {
            id: "fatNumbers",
            file: "image/game/poprush/fatNumbers.png",
            oData: {
                columns: 10,
                spriteWidth: 33,
                spriteHeight: 41
            }
        },
        {
            id: "thinNumbers",
            file: "image/game/poprush/thinNumbers.png",
            oData: {
                columns: 10,
                spriteWidth: 25,
                spriteHeight: 32
            }
        }], ctx, canvas.width, canvas.height),
        assetLib.onReady(initSplash)
}
function resizeCanvas() {
    var a = window.innerWidth,
        b = window.innerHeight;
    a > 480 && (a -= 1, b -= 1),
        window.innerWidth > window.innerHeight && isMobile ? ("loading" != gameState && rotatePauseOn(), a / canvas.width < b / canvas.height ? (canvas.style.width = a + "px", canvas.style.height = a / canvas.width * canvas.height + "px", canvasX = 0, canvasY = (b - a / canvas.width * canvas.height) / 2, canvasScaleX = canvasScaleY = canvas.width / a, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px") : (canvas.style.width = b / canvas.height * canvas.width + "px", canvas.style.height = b + "px", canvasX = (a - b / canvas.height * canvas.width) / 2, canvasY = 0, canvasScaleX = canvasScaleY = canvas.height / b, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px")) : isMobile ? (rotatePause && rotatePauseOff(), canvasX = canvasY = 0, canvasScaleX = canvas.width / a, canvasScaleY = canvas.height / b, canvas.style.width = a + "px", canvas.style.height = b + "px", div.style.marginTop = "0px", div.style.marginLeft = "0px") : (rotatePause && rotatePauseOff(), a / canvas.width < b / canvas.height ? (canvas.style.width = a + "px", canvas.style.height = a / canvas.width * canvas.height + "px", canvasX = 0, canvasY = (b - a / canvas.width * canvas.height) / 2, canvasScaleX = canvasScaleY = canvas.width / a, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px") : (canvas.style.width = b / canvas.height * canvas.width + "px", canvas.style.height = b + "px", canvasX = (a - b / canvas.height * canvas.width) / 2, canvasY = 0, canvasScaleX = canvasScaleY = canvas.height / b, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px")),
        userInput.setCanvas(canvasX, canvasY, canvasScaleX, canvasScaleY)
}
function toggleManualPause() {
    if (manualPause) manualPause = !1,
        userInput.removeHitArea("resumeFromPause"),
        pauseCoreOff();
    else {
        manualPause = !0,
            pauseCoreOn();
        var a = {
                oImgData: assetLib.getData("playBut"),
                aPos: [canvas.width / 2, 450]
            },
            b = new Array(a);
        userInput.addHitArea("resumeFromPause", butEventHandler, null, {
            type: "image",
            oImageData: a.oImgData,
            aCentrePos: a.aPos
        }),
            panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), "pause", b, canvas.width, canvas.height),
            panel.render(ctx),
            userInput.addHitArea("pause", butEventHandler, null, {
                    type: "rect",
                    aRect: [294, 0, 336, 48]
                },
                !0)
    }
}
function rotatePauseOn() {
    rotatePause = !0,
        ctx.drawImage(assetLib.getImg("rotateDeviceMessage"), 0, 0),
        userInput.pauseIsOn = !0,
        pauseCoreOn()
}
function rotatePauseOff() {
    rotatePause = !1,
        pauseCoreOff()
}
function pauseCoreOn() {
    switch (gameState) {
        case "start":
            break;
        case "help":
            break;
        case "game":
            userInput.removeHitArea("dotHit"),
                userInput.removeHitArea("mouseUp");
            break;
        case "end":
    }
}
function pauseCoreOff() {
    switch (previousTime = (new Date).getTime(), userInput.pauseIsOn = !1, gameState) {
        case "splash":
            updateSplashScreenEvent();
            break;
        case "start":
            initStartScreen();
            break;
        case "tutorial":
            initPreGame();
            break;
        case "game":
            manualPause = !1;
            for (var a = 0; a < aDots.length; a++) userInput.addHitArea("dotHit", butEventHandler, {
                    id: a,
                    isDraggable: !0
                },
                {
                    type: "rect",
                    aRect: [aDots[a].x - 22, aDots[a].targY - 22, aDots[a].x + 22, aDots[a].targY + 22]
                });
            userInput.addHitArea("mouseUp", butEventHandler, {
                    multiTouch: !0
                },
                {
                    type: "rect",
                    aRect: [0, 0, canvas.width, canvas.height]
                }),
                updateGameEvent();
            break;
        case "gameOver":
            initGameOver()
    }
} (window._gsQueue || (window._gsQueue = [])).push(function() {
    "use strict";
    window._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"],
        function(a, b, c) {
            var d = [].slice,
                e = function(a, b, d) {
                    c.call(this, a, b, d),
                        this._cycle = 0,
                        this._yoyo = this.vars.yoyo === !0,
                        this._repeat = this.vars.repeat || 0,
                        this._repeatDelay = this.vars.repeatDelay || 0,
                        this._dirty = !0,
                        this.render = e.prototype.render
                },
                f = function(a) {
                    return a.jquery || a.length && a !== window && a[0] && (a[0] === window || a[0].nodeType && a[0].style && !a.nodeType)
                },
                g = e.prototype = c.to({},
                    .1, {}),
                h = [];
            e.version = "1.10.2",
                g.constructor = e,
                g.kill()._gc = !1,
                e.killTweensOf = e.killDelayedCallsTo = c.killTweensOf,
                e.getTweensOf = c.getTweensOf,
                e.ticker = c.ticker,
                g.invalidate = function() {
                    return this._yoyo = this.vars.yoyo === !0,
                        this._repeat = this.vars.repeat || 0,
                        this._repeatDelay = this.vars.repeatDelay || 0,
                        this._uncache(!0),
                        c.prototype.invalidate.call(this)
                },
                g.updateTo = function(a, b) {
                    var d, e = this.ratio;
                    b && this.timeline && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
                    for (d in a) this.vars[d] = a[d];
                    if (this._initted) if (b) this._initted = !1;
                    else if (this._notifyPluginsOfEnabled && this._firstPT && c._onPluginEvent("_onDisable", this), this._time / this._duration > .998) {
                        var f = this._time;
                        this.render(0, !0, !1),
                            this._initted = !1,
                            this.render(f, !0, !1)
                    } else if (this._time > 0) {
                        this._initted = !1,
                            this._init();
                        for (var g, h = 1 / (1 - e), i = this._firstPT; i;) g = i.s + i.c,
                            i.c *= h,
                            i.s = g - i.c,
                            i = i._next
                    }
                    return this
                },
                g.render = function(a, b, c) {
                    var d, e, f, g, i, j, k, l = this._dirty ? this.totalDuration() : this._totalDuration,
                        m = this._time,
                        n = this._totalTime,
                        o = this._cycle;
                    if (a >= l ? (this._totalTime = l, this._cycle = this._repeat, this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = this._duration, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (d = !0, e = "onComplete"), 0 === this._duration && ((0 === a || 0 > this._rawPrevTime) && this._rawPrevTime !== a && (c = !0, this._rawPrevTime > 0 && (e = "onReverseComplete", b && (a = -1))), this._rawPrevTime = a)) : 1e-7 > a ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== n || 0 === this._duration && this._rawPrevTime > 0) && (e = "onReverseComplete", d = this._reversed), 0 > a ? (this._active = !1, 0 === this._duration && (this._rawPrevTime >= 0 && (c = !0), this._rawPrevTime = a)) : this._initted || (c = !0)) : (this._totalTime = this._time = a, 0 !== this._repeat && (g = this._duration + this._repeatDelay, this._cycle = this._totalTime / g >> 0, 0 !== this._cycle && this._cycle === this._totalTime / g && this._cycle--, this._time = this._totalTime - this._cycle * g, this._yoyo && 0 !== (1 & this._cycle) && (this._time = this._duration - this._time), this._time > this._duration ? this._time = this._duration: 0 > this._time && (this._time = 0)), this._easeType ? (i = this._time / this._duration, j = this._easeType, k = this._easePower, (1 === j || 3 === j && i >= .5) && (i = 1 - i), 3 === j && (i *= 2), 1 === k ? i *= i: 2 === k ? i *= i * i: 3 === k ? i *= i * i * i: 4 === k && (i *= i * i * i * i), this.ratio = 1 === j ? 1 - i: 2 === j ? i: .5 > this._time / this._duration ? i / 2 : 1 - i / 2) : this.ratio = this._ease.getRatio(this._time / this._duration)), m === this._time && !c) return n !== this._totalTime && this._onUpdate && (b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || h)),
                        void 0;
                    if (!this._initted) {
                        if (this._init(), !this._initted) return;
                        this._time && !d ? this.ratio = this._ease.getRatio(this._time / this._duration) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                    }
                    for (this._active || !this._paused && this._time !== m && a >= 0 && (this._active = !0), 0 === n && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")), this.vars.onStart && (0 !== this._totalTime || 0 === this._duration) && (b || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || h))), f = this._firstPT; f;) f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s,
                        f = f._next;
                    this._onUpdate && (0 > a && this._startAt && this._startAt.render(a, b, c), b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || h)),
                    this._cycle !== o && (b || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || h)),
                    e && (this._gc || (0 > a && this._startAt && !this._onUpdate && this._startAt.render(a, b, c), d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[e] && this.vars[e].apply(this.vars[e + "Scope"] || this, this.vars[e + "Params"] || h)))
                },
                e.to = function(a, b, c) {
                    return new e(a, b, c)
                },
                e.from = function(a, b, c) {
                    return c.runBackwards = !0,
                        c.immediateRender = 0 != c.immediateRender,
                        new e(a, b, c)
                },
                e.fromTo = function(a, b, c, d) {
                    return d.startAt = c,
                        d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
                        new e(a, b, d)
                },
                e.staggerTo = e.allTo = function(a, b, g, i, j, k, l) {
                    i = i || 0;
                    var m, n, o, p, q = g.delay || 0,
                        r = [],
                        s = function() {
                            g.onComplete && g.onComplete.apply(g.onCompleteScope || this, arguments),
                                j.apply(l || this, k || h)
                        };
                    for (a instanceof Array || ("string" == typeof a && (a = c.selector(a) || a), f(a) && (a = d.call(a, 0))), m = a.length, o = 0; m > o; o++) {
                        n = {};
                        for (p in g) n[p] = g[p];
                        n.delay = q,
                        o === m - 1 && j && (n.onComplete = s),
                            r[o] = new e(a[o], b, n),
                            q += i
                    }
                    return r
                },
                e.staggerFrom = e.allFrom = function(a, b, c, d, f, g, h) {
                    return c.runBackwards = !0,
                        c.immediateRender = 0 != c.immediateRender,
                        e.staggerTo(a, b, c, d, f, g, h)
                },
                e.staggerFromTo = e.allFromTo = function(a, b, c, d, f, g, h, i) {
                    return d.startAt = c,
                        d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
                        e.staggerTo(a, b, d, f, g, h, i)
                },
                e.delayedCall = function(a, b, c, d, f) {
                    return new e(b, 0, {
                        delay: a,
                        onComplete: b,
                        onCompleteParams: c,
                        onCompleteScope: d,
                        onReverseComplete: b,
                        onReverseCompleteParams: c,
                        onReverseCompleteScope: d,
                        immediateRender: !1,
                        useFrames: f,
                        overwrite: 0
                    })
                },
                e.set = function(a, b) {
                    return new e(a, 0, b)
                },
                e.isTweening = function(a) {
                    for (var b, d = c.getTweensOf(a), e = d.length; --e > -1;) if (b = d[e], b._active || b._startTime === b._timeline._time && b._timeline._active) return ! 0;
                    return ! 1
                };
            var i = function(a, b) {
                    for (var d = [], e = 0, f = a._first; f;) f instanceof c ? d[e++] = f: (b && (d[e++] = f), d = d.concat(i(f, b)), e = d.length),
                        f = f._next;
                    return d
                },
                j = e.getAllTweens = function(b) {
                    return i(a._rootTimeline, b).concat(i(a._rootFramesTimeline, b))
                };
            e.killAll = function(a, c, d, e) {
                null == c && (c = !0),
                null == d && (d = !0);
                var f, g, h, i = j(0 != e),
                    k = i.length,
                    l = c && d && e;
                for (h = 0; k > h; h++) g = i[h],
                (l || g instanceof b || (f = g.target === g.vars.onComplete) && d || c && !f) && (a ? g.totalTime(g.totalDuration()) : g._enabled(!1, !1))
            },
                e.killChildTweensOf = function(a, b) {
                    if (null != a) {
                        var g, h, i, j, k, l = c._tweenLookup;
                        if ("string" == typeof a && (a = c.selector(a) || a), f(a) && (a = d(a, 0)), a instanceof Array) for (j = a.length; --j > -1;) e.killChildTweensOf(a[j], b);
                        else {
                            g = [];
                            for (i in l) for (h = l[i].target.parentNode; h;) h === a && (g = g.concat(l[i].tweens)),
                                h = h.parentNode;
                            for (k = g.length, j = 0; k > j; j++) b && g[j].totalTime(g[j].totalDuration()),
                                g[j]._enabled(!1, !1)
                        }
                    }
                };
            var k = function(a, c, d, e) {
                c = c !== !1,
                    d = d !== !1,
                    e = e !== !1;
                for (var f, g, h = j(e), i = c && d && e, k = h.length; --k > -1;) g = h[k],
                (i || g instanceof b || (f = g.target === g.vars.onComplete) && d || c && !f) && g.paused(a)
            };
            return e.pauseAll = function(a, b, c) {
                k(!0, a, b, c)
            },
                e.resumeAll = function(a, b, c) {
                    k(!1, a, b, c)
                },
                e.globalTimeScale = function(b) {
                    var d = a._rootTimeline,
                        e = c.ticker.time;
                    return arguments.length ? (b = b || 1e-6, d._startTime = e - (e - d._startTime) * d._timeScale / b, d = a._rootFramesTimeline, e = c.ticker.frame, d._startTime = e - (e - d._startTime) * d._timeScale / b, d._timeScale = a._rootTimeline._timeScale = b, b) : d._timeScale
                },
                g.progress = function(a) {
                    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a: a) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration()
                },
                g.totalProgress = function(a) {
                    return arguments.length ? this.totalTime(this.totalDuration() * a, !1) : this._totalTime / this.totalDuration()
                },
                g.time = function(a, b) {
                    return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(a, b)) : this._time
                },
                g.duration = function(b) {
                    return arguments.length ? a.prototype.duration.call(this, b) : this._duration
                },
                g.totalDuration = function(a) {
                    return arguments.length ? -1 === this._repeat ? this: this.duration((a - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
                },
                g.repeat = function(a) {
                    return arguments.length ? (this._repeat = a, this._uncache(!0)) : this._repeat
                },
                g.repeatDelay = function(a) {
                    return arguments.length ? (this._repeatDelay = a, this._uncache(!0)) : this._repeatDelay
                },
                g.yoyo = function(a) {
                    return arguments.length ? (this._yoyo = a, this) : this._yoyo
                },
                e
        },
        !0),
        window._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"],
            function(a, b, c) {
                var d = function(a) {
                        b.call(this, a),
                            this._labels = {},
                            this.autoRemoveChildren = this.vars.autoRemoveChildren === !0,
                            this.smoothChildTiming = this.vars.smoothChildTiming === !0,
                            this._sortChildren = !0,
                            this._onUpdate = this.vars.onUpdate;
                        var c, d, e = this.vars;
                        for (d in e) c = e[d],
                        c instanceof Array && -1 !== c.join("").indexOf("{self}") && (e[d] = this._swapSelfInParams(c));
                        e.tweens instanceof Array && this.add(e.tweens, 0, e.align, e.stagger)
                    },
                    e = [],
                    f = function(a) {
                        var b, c = {};
                        for (b in a) c[b] = a[b];
                        return c
                    },
                    g = function(a, b, c, d) {
                        a._timeline.pause(a._startTime),
                        b && b.apply(d || a._timeline, c || e)
                    },
                    h = e.slice,
                    i = d.prototype = new b;
                return d.version = "1.10.2",
                    i.constructor = d,
                    i.kill()._gc = !1,
                    i.to = function(a, b, d, e) {
                        return b ? this.add(new c(a, b, d), e) : this.set(a, d, e)
                    },
                    i.from = function(a, b, d, e) {
                        return this.add(c.from(a, b, d), e)
                    },
                    i.fromTo = function(a, b, d, e, f) {
                        return b ? this.add(c.fromTo(a, b, d, e), f) : this.set(a, e, f)
                    },
                    i.staggerTo = function(a, b, e, g, i, j, k, l) {
                        var m, n = new d({
                            onComplete: j,
                            onCompleteParams: k,
                            onCompleteScope: l
                        });
                        for ("string" == typeof a && (a = c.selector(a) || a), !(a instanceof Array) && a.length && a !== window && a[0] && (a[0] === window || a[0].nodeType && a[0].style && !a.nodeType) && (a = h.call(a, 0)), g = g || 0, m = 0; a.length > m; m++) e.startAt && (e.startAt = f(e.startAt)),
                            n.to(a[m], b, f(e), m * g);
                        return this.add(n, i)
                    },
                    i.staggerFrom = function(a, b, c, d, e, f, g, h) {
                        return c.immediateRender = 0 != c.immediateRender,
                            c.runBackwards = !0,
                            this.staggerTo(a, b, c, d, e, f, g, h)
                    },
                    i.staggerFromTo = function(a, b, c, d, e, f, g, h, i) {
                        return d.startAt = c,
                            d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
                            this.staggerTo(a, b, d, e, f, g, h, i)
                    },
                    i.call = function(a, b, d, e) {
                        return this.add(c.delayedCall(0, a, b, d), e)
                    },
                    i.set = function(a, b, d) {
                        return d = this._parseTimeOrLabel(d, 0, !0),
                        null == b.immediateRender && (b.immediateRender = d === this._time && !this._paused),
                            this.add(new c(a, 0, b), d)
                    },
                    d.exportRoot = function(a, b) {
                        a = a || {},
                        null == a.smoothChildTiming && (a.smoothChildTiming = !0);
                        var e, f, g = new d(a),
                            h = g._timeline;
                        for (null == b && (b = !0), h._remove(g, !0), g._startTime = 0, g._rawPrevTime = g._time = g._totalTime = h._time, e = h._first; e;) f = e._next,
                        b && e instanceof c && e.target === e.vars.onComplete || g.add(e, e._startTime - e._delay),
                            e = f;
                        return h.add(g, 0),
                            g
                    },
                    i.add = function(e, f, g, h) {
                        var i, j, k, l, m;
                        if ("number" != typeof f && (f = this._parseTimeOrLabel(f, 0, !0, e)), !(e instanceof a)) {
                            if (e instanceof Array) {
                                for (g = g || "normal", h = h || 0, i = f, j = e.length, k = 0; j > k; k++)(l = e[k]) instanceof Array && (l = new d({
                                    tweens: l
                                })),
                                    this.add(l, i),
                                "string" != typeof l && "function" != typeof l && ("sequence" === g ? i = l._startTime + l.totalDuration() / l._timeScale: "start" === g && (l._startTime -= l.delay())),
                                    i += h;
                                return this._uncache(!0)
                            }
                            if ("string" == typeof e) return this.addLabel(e, f);
                            if ("function" != typeof e) throw "Cannot add " + e + " into the timeline; it is neither a tween, timeline, function, nor a string.";
                            e = c.delayedCall(0, e)
                        }
                        if (b.prototype.add.call(this, e, f), this._gc && !this._paused && this._time === this._duration && this._time < this.duration()) for (m = this; m._gc && m._timeline;) m._timeline.smoothChildTiming ? m.totalTime(m._totalTime, !0) : m._enabled(!0, !1),
                            m = m._timeline;
                        return this
                    },
                    i.remove = function(b) {
                        if (b instanceof a) return this._remove(b, !1);
                        if (b instanceof Array) {
                            for (var c = b.length; --c > -1;) this.remove(b[c]);
                            return this
                        }
                        return "string" == typeof b ? this.removeLabel(b) : this.kill(null, b)
                    },
                    i._remove = function(a, c) {
                        return b.prototype._remove.call(this, a, c),
                            this._last ? this._time > this._last._startTime && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = 0,
                            this
                    },
                    i.append = function(a, b) {
                        return this.add(a, this._parseTimeOrLabel(null, b, !0, a))
                    },
                    i.insert = i.insertMultiple = function(a, b, c, d) {
                        return this.add(a, b || 0, c, d)
                    },
                    i.appendMultiple = function(a, b, c, d) {
                        return this.add(a, this._parseTimeOrLabel(null, b, !0, a), c, d)
                    },
                    i.addLabel = function(a, b) {
                        return this._labels[a] = this._parseTimeOrLabel(b),
                            this
                    },
                    i.addPause = function(a, b, c, d) {
                        return this.call(g, ["{self}", b, c, d], this, a)
                    },
                    i.removeLabel = function(a) {
                        return delete this._labels[a],
                            this
                    },
                    i.getLabelTime = function(a) {
                        return null != this._labels[a] ? this._labels[a] : -1
                    },
                    i._parseTimeOrLabel = function(b, c, d, e) {
                        var f;
                        if (e instanceof a && e.timeline === this) this.remove(e);
                        else if (e instanceof Array) for (f = e.length; --f > -1;) e[f] instanceof a && e[f].timeline === this && this.remove(e[f]);
                        if ("string" == typeof c) return this._parseTimeOrLabel(c, d && "number" == typeof b && null == this._labels[c] ? b - this.duration() : 0, d);
                        if (c = c || 0, "string" != typeof b || !isNaN(b) && null == this._labels[b]) null == b && (b = this.duration());
                        else {
                            if (f = b.indexOf("="), -1 === f) return null == this._labels[b] ? d ? this._labels[b] = this.duration() + c: c: this._labels[b] + c;
                            c = parseInt(b.charAt(f - 1) + "1", 10) * Number(b.substr(f + 1)),
                                b = f > 1 ? this._parseTimeOrLabel(b.substr(0, f - 1), 0, d) : this.duration()
                        }
                        return Number(b) + c
                    },
                    i.seek = function(a, b) {
                        return this.totalTime("number" == typeof a ? a: this._parseTimeOrLabel(a), b !== !1)
                    },
                    i.stop = function() {
                        return this.paused(!0)
                    },
                    i.gotoAndPlay = function(a, b) {
                        return this.play(a, b)
                    },
                    i.gotoAndStop = function(a, b) {
                        return this.pause(a, b)
                    },
                    i.render = function(a, b, c) {
                        this._gc && this._enabled(!0, !1);
                        var d, f, g, h, i, j = this._dirty ? this.totalDuration() : this._totalDuration,
                            k = this._time,
                            l = this._startTime,
                            m = this._timeScale,
                            n = this._paused;
                        if (a >= j ? (this._totalTime = this._time = j, this._reversed || this._hasPausedChild() || (f = !0, h = "onComplete", 0 === this._duration && (0 === a || 0 > this._rawPrevTime) && this._rawPrevTime !== a && this._first && (i = !0, this._rawPrevTime > 0 && (h = "onReverseComplete"))), this._rawPrevTime = a, a = j + 1e-6) : 1e-7 > a ? (this._totalTime = this._time = 0, (0 !== k || 0 === this._duration && this._rawPrevTime > 0) && (h = "onReverseComplete", f = this._reversed), 0 > a ? (this._active = !1, 0 === this._duration && this._rawPrevTime >= 0 && this._first && (i = !0), this._rawPrevTime = a) : (this._rawPrevTime = a, a = 0, this._initted || (i = !0))) : this._totalTime = this._time = this._rawPrevTime = a, this._time !== k && this._first || c || i) {
                            if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== k && a > 0 && (this._active = !0), 0 === k && this.vars.onStart && 0 !== this._time && (b || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || e)), this._time >= k) for (d = this._first; d && (g = d._next, !this._paused || n);)(d._active || d._startTime <= this._time && !d._paused && !d._gc) && (d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)),
                                d = g;
                            else for (d = this._last; d && (g = d._prev, !this._paused || n);)(d._active || k >= d._startTime && !d._paused && !d._gc) && (d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)),
                                d = g;
                            this._onUpdate && (b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || e)),
                            h && (this._gc || (l === this._startTime || m !== this._timeScale) && (0 === this._time || j >= this.totalDuration()) && (f && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[h] && this.vars[h].apply(this.vars[h + "Scope"] || this, this.vars[h + "Params"] || e)))
                        }
                    },
                    i._hasPausedChild = function() {
                        for (var a = this._first; a;) {
                            if (a._paused || a instanceof d && a._hasPausedChild()) return ! 0;
                            a = a._next
                        }
                        return ! 1
                    },
                    i.getChildren = function(a, b, d, e) {
                        e = e || -9999999999;
                        for (var f = [], g = this._first, h = 0; g;) e > g._startTime || (g instanceof c ? b !== !1 && (f[h++] = g) : (d !== !1 && (f[h++] = g), a !== !1 && (f = f.concat(g.getChildren(!0, b, d)), h = f.length))),
                            g = g._next;
                        return f
                    },
                    i.getTweensOf = function(a, b) {
                        for (var d = c.getTweensOf(a), e = d.length, f = [], g = 0; --e > -1;)(d[e].timeline === this || b && this._contains(d[e])) && (f[g++] = d[e]);
                        return f
                    },
                    i._contains = function(a) {
                        for (var b = a.timeline; b;) {
                            if (b === this) return ! 0;
                            b = b.timeline
                        }
                        return ! 1
                    },
                    i.shiftChildren = function(a, b, c) {
                        c = c || 0;
                        for (var d, e = this._first,
                                 f = this._labels; e;) e._startTime >= c && (e._startTime += a),
                            e = e._next;
                        if (b) for (d in f) f[d] >= c && (f[d] += a);
                        return this._uncache(!0)
                    },
                    i._kill = function(a, b) {
                        if (!a && !b) return this._enabled(!1, !1);
                        for (var c = b ? this.getTweensOf(b) : this.getChildren(!0, !0, !1), d = c.length, e = !1; --d > -1;) c[d]._kill(a, b) && (e = !0);
                        return e
                    },
                    i.clear = function(a) {
                        var b = this.getChildren(!1, !0, !0),
                            c = b.length;
                        for (this._time = this._totalTime = 0; --c > -1;) b[c]._enabled(!1, !1);
                        return a !== !1 && (this._labels = {}),
                            this._uncache(!0)
                    },
                    i.invalidate = function() {
                        for (var a = this._first; a;) a.invalidate(),
                            a = a._next;
                        return this
                    },
                    i._enabled = function(a, c) {
                        if (a === this._gc) for (var d = this._first; d;) d._enabled(a, !0),
                            d = d._next;
                        return b.prototype._enabled.call(this, a, c)
                    },
                    i.progress = function(a) {
                        return arguments.length ? this.totalTime(this.duration() * a, !1) : this._time / this.duration()
                    },
                    i.duration = function(a) {
                        return arguments.length ? (0 !== this.duration() && 0 !== a && this.timeScale(this._duration / a), this) : (this._dirty && this.totalDuration(), this._duration)
                    },
                    i.totalDuration = function(a) {
                        if (!arguments.length) {
                            if (this._dirty) {
                                for (var b, c, d = 0,
                                         e = this._last,
                                         f = 999999999999; e;) b = e._prev,
                                e._dirty && e.totalDuration(),
                                    e._startTime > f && this._sortChildren && !e._paused ? this.add(e, e._startTime - e._delay) : f = e._startTime,
                                0 > e._startTime && !e._paused && (d -= e._startTime, this._timeline.smoothChildTiming && (this._startTime += e._startTime / this._timeScale), this.shiftChildren( - e._startTime, !1, -9999999999), f = 0),
                                    c = e._startTime + e._totalDuration / e._timeScale,
                                c > d && (d = c),
                                    e = b;
                                this._duration = this._totalDuration = d,
                                    this._dirty = !1
                            }
                            return this._totalDuration
                        }
                        return 0 !== this.totalDuration() && 0 !== a && this.timeScale(this._totalDuration / a),
                            this
                    },
                    i.usesFrames = function() {
                        for (var b = this._timeline; b._timeline;) b = b._timeline;
                        return b === a._rootFramesTimeline
                    },
                    i.rawTime = function() {
                        return this._paused || 0 !== this._totalTime && this._totalTime !== this._totalDuration ? this._totalTime: (this._timeline.rawTime() - this._startTime) * this._timeScale
                    },
                    d
            },
            !0),
        window._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"],
            function(a, b, c) {
                var d = function(b) {
                        a.call(this, b),
                            this._repeat = this.vars.repeat || 0,
                            this._repeatDelay = this.vars.repeatDelay || 0,
                            this._cycle = 0,
                            this._yoyo = this.vars.yoyo === !0,
                            this._dirty = !0
                    },
                    e = [],
                    f = new c(null, null, 1, 0),
                    g = function(a) {
                        for (; a;) {
                            if (a._paused) return ! 0;
                            a = a._timeline
                        }
                        return ! 1
                    },
                    h = d.prototype = new a;
                return h.constructor = d,
                    h.kill()._gc = !1,
                    d.version = "1.10.2",
                    h.invalidate = function() {
                        return this._yoyo = this.vars.yoyo === !0,
                            this._repeat = this.vars.repeat || 0,
                            this._repeatDelay = this.vars.repeatDelay || 0,
                            this._uncache(!0),
                            a.prototype.invalidate.call(this)
                    },
                    h.addCallback = function(a, c, d, e) {
                        return this.add(b.delayedCall(0, a, d, e), c)
                    },
                    h.removeCallback = function(a, b) {
                        if (a) if (null == b) this._kill(null, a);
                        else for (var c = this.getTweensOf(a, !1), d = c.length, e = this._parseTimeOrLabel(b); --d > -1;) c[d]._startTime === e && c[d]._enabled(!1, !1);
                        return this
                    },
                    h.tweenTo = function(a, c) {
                        c = c || {};
                        var d, g, h = {
                            ease: f,
                            overwrite: 2,
                            useFrames: this.usesFrames(),
                            immediateRender: !1
                        };
                        for (d in c) h[d] = c[d];
                        return h.time = this._parseTimeOrLabel(a),
                            g = new b(this, Math.abs(Number(h.time) - this._time) / this._timeScale || .001, h),
                            h.onStart = function() {
                                g.target.paused(!0),
                                g.vars.time !== g.target.time() && g.duration(Math.abs(g.vars.time - g.target.time()) / g.target._timeScale),
                                c.onStart && c.onStart.apply(c.onStartScope || g, c.onStartParams || e)
                            },
                            g
                    },
                    h.tweenFromTo = function(a, b, c) {
                        c = c || {},
                            a = this._parseTimeOrLabel(a),
                            c.startAt = {
                                onComplete: this.seek,
                                onCompleteParams: [a],
                                onCompleteScope: this
                            },
                            c.immediateRender = c.immediateRender !== !1;
                        var d = this.tweenTo(b, c);
                        return d.duration(Math.abs(d.vars.time - a) / this._timeScale || .001)
                    },
                    h.render = function(a, b, c) {
                        this._gc && this._enabled(!0, !1);
                        var d, f, g, h, i, j, k = this._dirty ? this.totalDuration() : this._totalDuration,
                            l = this._duration,
                            m = this._time,
                            n = this._totalTime,
                            o = this._startTime,
                            p = this._timeScale,
                            q = this._rawPrevTime,
                            r = this._paused,
                            s = this._cycle;
                        if (a >= k ? (this._locked || (this._totalTime = k, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (f = !0, h = "onComplete", 0 === l && (0 === a || 0 > this._rawPrevTime) && this._rawPrevTime !== a && this._first && (i = !0, this._rawPrevTime > 0 && (h = "onReverseComplete"))), this._rawPrevTime = a, this._yoyo && 0 !== (1 & this._cycle) ? this._time = a = 0 : (this._time = l, a = l + 1e-6)) : 1e-7 > a ? (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== m || 0 === l && this._rawPrevTime > 0 && !this._locked) && (h = "onReverseComplete", f = this._reversed), 0 > a ? (this._active = !1, 0 === l && this._rawPrevTime >= 0 && this._first && (i = !0), this._rawPrevTime = a) : (this._rawPrevTime = a, a = 0, this._initted || (i = !0))) : (this._time = this._rawPrevTime = a, this._locked || (this._totalTime = a, 0 !== this._repeat && (j = l + this._repeatDelay, this._cycle = this._totalTime / j >> 0, 0 !== this._cycle && this._cycle === this._totalTime / j && this._cycle--, this._time = this._totalTime - this._cycle * j, this._yoyo && 0 !== (1 & this._cycle) && (this._time = l - this._time), this._time > l ? (this._time = l, a = l + 1e-6) : 0 > this._time ? this._time = a = 0 : a = this._time))), this._cycle !== s && !this._locked) {
                            var t = this._yoyo && 0 !== (1 & s),
                                u = t === (this._yoyo && 0 !== (1 & this._cycle)),
                                v = this._totalTime,
                                w = this._cycle,
                                x = this._rawPrevTime,
                                y = this._time;
                            if (this._totalTime = s * l, s > this._cycle ? t = !t: this._totalTime += l, this._time = m, this._rawPrevTime = 0 === l ? q - 1e-5: q, this._cycle = s, this._locked = !0, m = t ? 0 : l, this.render(m, b, 0 === l), b || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || e), u && (m = t ? l + 1e-6: -1e-6, this.render(m, !0, !1)), this._locked = !1, this._paused && !r) return;
                            this._time = y,
                                this._totalTime = v,
                                this._cycle = w,
                                this._rawPrevTime = x
                        }
                        if (! (this._time !== m && this._first || c || i)) return n !== this._totalTime && this._onUpdate && (b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || e)),
                            void 0;
                        if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== n && a > 0 && (this._active = !0), 0 === n && this.vars.onStart && 0 !== this._totalTime && (b || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || e)), this._time >= m) for (d = this._first; d && (g = d._next, !this._paused || r);)(d._active || d._startTime <= this._time && !d._paused && !d._gc) && (d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)),
                            d = g;
                        else for (d = this._last; d && (g = d._prev, !this._paused || r);)(d._active || m >= d._startTime && !d._paused && !d._gc) && (d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)),
                            d = g;
                        this._onUpdate && (b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || e)),
                        h && (this._locked || this._gc || (o === this._startTime || p !== this._timeScale) && (0 === this._time || k >= this.totalDuration()) && (f && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[h] && this.vars[h].apply(this.vars[h + "Scope"] || this, this.vars[h + "Params"] || e)))
                    },
                    h.getActive = function(a, b, c) {
                        null == a && (a = !0),
                        null == b && (b = !0),
                        null == c && (c = !1);
                        var d, e, f = [],
                            h = this.getChildren(a, b, c),
                            i = 0,
                            j = h.length;
                        for (d = 0; j > d; d++) e = h[d],
                        e._paused || e._timeline._time >= e._startTime && e._timeline._time < e._startTime + e._totalDuration / e._timeScale && (g(e._timeline) || (f[i++] = e));
                        return f
                    },
                    h.getLabelAfter = function(a) {
                        a || 0 !== a && (a = this._time);
                        var b, c = this.getLabelsArray(),
                            d = c.length;
                        for (b = 0; d > b; b++) if (c[b].time > a) return c[b].name;
                        return null
                    },
                    h.getLabelBefore = function(a) {
                        null == a && (a = this._time);
                        for (var b = this.getLabelsArray(), c = b.length; --c > -1;) if (a > b[c].time) return b[c].name;
                        return null
                    },
                    h.getLabelsArray = function() {
                        var a, b = [],
                            c = 0;
                        for (a in this._labels) b[c++] = {
                            time: this._labels[a],
                            name: a
                        };
                        return b.sort(function(a, b) {
                            return a.time - b.time
                        }),
                            b
                    },
                    h.progress = function(a) {
                        return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a: a) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration()
                    },
                    h.totalProgress = function(a) {
                        return arguments.length ? this.totalTime(this.totalDuration() * a, !1) : this._totalTime / this.totalDuration()
                    },
                    h.totalDuration = function(b) {
                        return arguments.length ? -1 === this._repeat ? this: this.duration((b - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (a.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
                    },
                    h.time = function(a, b) {
                        return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(a, b)) : this._time
                    },
                    h.repeat = function(a) {
                        return arguments.length ? (this._repeat = a, this._uncache(!0)) : this._repeat
                    },
                    h.repeatDelay = function(a) {
                        return arguments.length ? (this._repeatDelay = a, this._uncache(!0)) : this._repeatDelay
                    },
                    h.yoyo = function(a) {
                        return arguments.length ? (this._yoyo = a, this) : this._yoyo
                    },
                    h.currentLabel = function(a) {
                        return arguments.length ? this.seek(a, !0) : this.getLabelBefore(this._time + 1e-8)
                    },
                    d
            },
            !0),
        function() {
            var a = 180 / Math.PI,
                b = Math.PI / 180,
                c = [],
                d = [],
                e = [],
                f = {},
                g = function(a, b, c, d) {
                    this.a = a,
                        this.b = b,
                        this.c = c,
                        this.d = d,
                        this.da = d - a,
                        this.ca = c - a,
                        this.ba = b - a
                },
                h = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
                i = function(a, b, c, d) {
                    var e = {
                            a: a
                        },
                        f = {},
                        g = {},
                        h = {
                            c: d
                        },
                        i = (a + b) / 2,
                        j = (b + c) / 2,
                        k = (c + d) / 2,
                        l = (i + j) / 2,
                        m = (j + k) / 2,
                        n = (m - l) / 8;
                    return e.b = i + (a - i) / 4,
                        f.b = l + n,
                        e.c = f.a = (e.b + f.b) / 2,
                        f.c = g.a = (l + m) / 2,
                        g.b = m - n,
                        h.b = k + (d - k) / 4,
                        g.c = h.a = (g.b + h.b) / 2,
                        [e, f, g, h]
                },
                j = function(a, b, f, g, h) {
                    var j, k, l, m, n, o, p, q, r, s, t, u, v, w = a.length - 1,
                        x = 0,
                        y = a[0].a;
                    for (j = 0; w > j; j++) n = a[x],
                        k = n.a,
                        l = n.d,
                        m = a[x + 1].d,
                        h ? (t = c[j], u = d[j], v = .25 * (u + t) * b / (g ? .5 : e[j] || .5), o = l - (l - k) * (g ? .5 * b: 0 !== t ? v / t: 0), p = l + (m - l) * (g ? .5 * b: 0 !== u ? v / u: 0), q = l - (o + ((p - o) * (3 * t / (t + u) + .5) / 4 || 0))) : (o = l - .5 * (l - k) * b, p = l + .5 * (m - l) * b, q = l - (o + p) / 2),
                        o += q,
                        p += q,
                        n.c = r = o,
                        n.b = 0 !== j ? y: y = n.a + .6 * (n.c - n.a),
                        n.da = l - k,
                        n.ca = r - k,
                        n.ba = y - k,
                        f ? (s = i(k, y, r, l), a.splice(x, 1, s[0], s[1], s[2], s[3]), x += 4) : x++,
                        y = p;
                    n = a[x],
                        n.b = y,
                        n.c = y + .4 * (n.d - y),
                        n.da = n.d - n.a,
                        n.ca = n.c - n.a,
                        n.ba = y - n.a,
                    f && (s = i(n.a, y, n.c, n.d), a.splice(x, 1, s[0], s[1], s[2], s[3]))
                },
                k = function(a, b, e, f) {
                    var h, i, j, k, l, m, n = [];
                    if (f) for (a = [f].concat(a), i = a.length; --i > -1;)"string" == typeof(m = a[i][b]) && "=" === m.charAt(1) && (a[i][b] = f[b] + Number(m.charAt(0) + m.substr(2)));
                    if (h = a.length - 2, 0 > h) return n[0] = new g(a[0][b], 0, 0, a[ - 1 > h ? 0 : 1][b]),
                        n;
                    for (i = 0; h > i; i++) j = a[i][b],
                        k = a[i + 1][b],
                        n[i] = new g(j, 0, 0, k),
                    e && (l = a[i + 2][b], c[i] = (c[i] || 0) + (k - j) * (k - j), d[i] = (d[i] || 0) + (l - k) * (l - k));
                    return n[i] = new g(a[i][b], 0, 0, a[i + 1][b]),
                        n
                },
                l = function(a, b, g, i, l, m) {
                    var n, o, p, q, r, s, t, u, v = {},
                        w = [],
                        x = m || a[0];
                    l = "string" == typeof l ? "," + l + ",": h,
                    null == b && (b = 1);
                    for (o in a[0]) w.push(o);
                    if (a.length > 1) {
                        for (u = a[a.length - 1], t = !0, n = w.length; --n > -1;) if (o = w[n], Math.abs(x[o] - u[o]) > .05) {
                            t = !1;
                            break
                        }
                        t && (a = a.concat(), m && a.unshift(m), a.push(a[1]), m = a[a.length - 3])
                    }
                    for (c.length = d.length = e.length = 0, n = w.length; --n > -1;) o = w[n],
                        f[o] = -1 !== l.indexOf("," + o + ","),
                        v[o] = k(a, o, f[o], m);
                    for (n = c.length; --n > -1;) c[n] = Math.sqrt(c[n]),
                        d[n] = Math.sqrt(d[n]);
                    if (!i) {
                        for (n = w.length; --n > -1;) if (f[o]) for (p = v[w[n]], s = p.length - 1, q = 0; s > q; q++) r = p[q + 1].da / d[q] + p[q].da / c[q],
                            e[q] = (e[q] || 0) + r * r;
                        for (n = e.length; --n > -1;) e[n] = Math.sqrt(e[n])
                    }
                    for (n = w.length, q = g ? 4 : 1; --n > -1;) o = w[n],
                        p = v[o],
                        j(p, b, g, i, f[o]),
                    t && (p.splice(0, q), p.splice(p.length - q, q));
                    return v
                },
                m = function(a, b, c) {
                    b = b || "soft";
                    var d, e, f, h, i, j, k, l, m, n, o, p = {},
                        q = "cubic" === b ? 3 : 2,
                        r = "soft" === b,
                        s = [];
                    if (r && c && (a = [c].concat(a)), null == a || q + 1 > a.length) throw "invalid Bezier data";
                    for (m in a[0]) s.push(m);
                    for (j = s.length; --j > -1;) {
                        for (m = s[j], p[m] = i = [], n = 0, l = a.length, k = 0; l > k; k++) d = null == c ? a[k][m] : "string" == typeof(o = a[k][m]) && "=" === o.charAt(1) ? c[m] + Number(o.charAt(0) + o.substr(2)) : Number(o),
                        r && k > 1 && l - 1 > k && (i[n++] = (d + i[n - 2]) / 2),
                            i[n++] = d;
                        for (l = n - q + 1, n = 0, k = 0; l > k; k += q) d = i[k],
                            e = i[k + 1],
                            f = i[k + 2],
                            h = 2 === q ? 0 : i[k + 3],
                            i[n++] = o = 3 === q ? new g(d, e, f, h) : new g(d, (2 * e + d) / 3, (2 * e + f) / 3, f);
                        i.length = n
                    }
                    return p
                },
                n = function(a, b, c) {
                    for (var d, e, f, g, h, i, j, k, l, m, n, o = 1 / c,
                             p = a.length; --p > -1;) for (m = a[p], f = m.a, g = m.d - f, h = m.c - f, i = m.b - f, d = e = 0, k = 1; c >= k; k++) j = o * k,
                        l = 1 - j,
                        d = e - (e = (j * j * g + 3 * l * (j * h + l * i)) * j),
                        n = p * c + k - 1,
                        b[n] = (b[n] || 0) + d * d
                },
                o = function(a, b) {
                    b = b >> 0 || 6;
                    var c, d, e, f, g = [],
                        h = [],
                        i = 0,
                        j = 0,
                        k = b - 1,
                        l = [],
                        m = [];
                    for (c in a) n(a[c], g, b);
                    for (e = g.length, d = 0; e > d; d++) i += Math.sqrt(g[d]),
                        f = d % b,
                        m[f] = i,
                    f === k && (j += i, f = d / b >> 0, l[f] = m, h[f] = j, i = 0, m = []);
                    return {
                        length: j,
                        lengths: h,
                        segments: l
                    }
                },
                p = window._gsDefine.plugin({
                    propName: "bezier",
                    priority: -1,
                    API: 2,
                    global: !0,
                    init: function(a, b, c) {
                        this._target = a,
                        b instanceof Array && (b = {
                            values: b
                        }),
                            this._func = {},
                            this._round = {},
                            this._props = [],
                            this._timeRes = null == b.timeResolution ? 6 : parseInt(b.timeResolution, 10);
                        var d, e, f, g, h, i = b.values || [],
                            j = {},
                            k = i[0],
                            n = b.autoRotate || c.vars.orientToBezier;
                        this._autoRotate = n ? n instanceof Array ? n: [["x", "y", "rotation", n === !0 ? 0 : Number(n) || 0]] : null;
                        for (d in k) this._props.push(d);
                        for (f = this._props.length; --f > -1;) d = this._props[f],
                            this._overwriteProps.push(d),
                            e = this._func[d] = "function" == typeof a[d],
                            j[d] = e ? a[d.indexOf("set") || "function" != typeof a["get" + d.substr(3)] ? d: "get" + d.substr(3)]() : parseFloat(a[d]),
                        h || j[d] !== i[0][d] && (h = j);
                        if (this._beziers = "cubic" !== b.type && "quadratic" !== b.type && "soft" !== b.type ? l(i, isNaN(b.curviness) ? 1 : b.curviness, !1, "thruBasic" === b.type, b.correlate, h) : m(i, b.type, j), this._segCount = this._beziers[d].length, this._timeRes) {
                            var p = o(this._beziers, this._timeRes);
                            this._length = p.length,
                                this._lengths = p.lengths,
                                this._segments = p.segments,
                                this._l1 = this._li = this._s1 = this._si = 0,
                                this._l2 = this._lengths[0],
                                this._curSeg = this._segments[0],
                                this._s2 = this._curSeg[0],
                                this._prec = 1 / this._curSeg.length
                        }
                        if (n = this._autoRotate) for (n[0] instanceof Array || (this._autoRotate = n = [n]), f = n.length; --f > -1;) for (g = 0; 3 > g; g++) d = n[f][g],
                            this._func[d] = "function" == typeof a[d] ? a[d.indexOf("set") || "function" != typeof a["get" + d.substr(3)] ? d: "get" + d.substr(3)] : !1;
                        return ! 0
                    },
                    set: function(b) {
                        var c, d, e, f, g, h, i, j, k, l, m = this._segCount,
                            n = this._func,
                            o = this._target;
                        if (this._timeRes) {
                            if (k = this._lengths, l = this._curSeg, b *= this._length, e = this._li, b > this._l2 && m - 1 > e) {
                                for (j = m - 1; j > e && b >= (this._l2 = k[++e]););
                                this._l1 = k[e - 1],
                                    this._li = e,
                                    this._curSeg = l = this._segments[e],
                                    this._s2 = l[this._s1 = this._si = 0]
                            } else if (this._l1 > b && e > 0) {
                                for (; e > 0 && (this._l1 = k[--e]) >= b;);
                                0 === e && this._l1 > b ? this._l1 = 0 : e++,
                                    this._l2 = k[e],
                                    this._li = e,
                                    this._curSeg = l = this._segments[e],
                                    this._s1 = l[(this._si = l.length - 1) - 1] || 0,
                                    this._s2 = l[this._si]
                            }
                            if (c = e, b -= this._l1, e = this._si, b > this._s2 && l.length - 1 > e) {
                                for (j = l.length - 1; j > e && b >= (this._s2 = l[++e]););
                                this._s1 = l[e - 1],
                                    this._si = e
                            } else if (this._s1 > b && e > 0) {
                                for (; e > 0 && (this._s1 = l[--e]) >= b;);
                                0 === e && this._s1 > b ? this._s1 = 0 : e++,
                                    this._s2 = l[e],
                                    this._si = e
                            }
                            h = (e + (b - this._s1) / (this._s2 - this._s1)) * this._prec
                        } else c = 0 > b ? 0 : b >= 1 ? m - 1 : m * b >> 0,
                            h = (b - c * (1 / m)) * m;
                        for (d = 1 - h, e = this._props.length; --e > -1;) f = this._props[e],
                            g = this._beziers[f][c],
                            i = (h * h * g.da + 3 * d * (h * g.ca + d * g.ba)) * h + g.a,
                        this._round[f] && (i = i + (i > 0 ? .5 : -.5) >> 0),
                            n[f] ? o[f](i) : o[f] = i;
                        if (this._autoRotate) {
                            var p, q, r, s, t, u, v, w = this._autoRotate;
                            for (e = w.length; --e > -1;) f = w[e][2],
                                u = w[e][3] || 0,
                                v = w[e][4] === !0 ? 1 : a,
                                g = this._beziers[w[e][0]],
                                p = this._beziers[w[e][1]],
                            g && p && (g = g[c], p = p[c], q = g.a + (g.b - g.a) * h, s = g.b + (g.c - g.b) * h, q += (s - q) * h, s += (g.c + (g.d - g.c) * h - s) * h, r = p.a + (p.b - p.a) * h, t = p.b + (p.c - p.b) * h, r += (t - r) * h, t += (p.c + (p.d - p.c) * h - t) * h, i = Math.atan2(t - r, s - q) * v + u, n[f] ? o[f](i) : o[f] = i)
                        }
                    }
                }),
                q = p.prototype;
            p.bezierThrough = l,
                p.cubicToQuadratic = i,
                p._autoCSS = !0,
                p.quadraticToCubic = function(a, b, c) {
                    return new g(a, (2 * b + a) / 3, (2 * b + c) / 3, c)
                },
                p._cssRegister = function() {
                    var a = window._gsDefine.globals.CSSPlugin;
                    if (a) {
                        var c = a._internals,
                            d = c._parseToProxy,
                            e = c._setPluginRatio,
                            f = c.CSSPropTween;
                        c._registerComplexSpecialProp("bezier", {
                            parser: function(a, c, g, h, i, j) {
                                c instanceof Array && (c = {
                                    values: c
                                }),
                                    j = new p;
                                var k, l, m, n = c.values,
                                    o = n.length - 1,
                                    q = [],
                                    r = {};
                                if (0 > o) return i;
                                for (k = 0; o >= k; k++) m = d(a, n[k], h, i, j, o !== k),
                                    q[k] = m.end;
                                for (l in c) r[l] = c[l];
                                return r.values = q,
                                    i = new f(a, "bezier", 0, 0, m.pt, 2),
                                    i.data = m,
                                    i.plugin = j,
                                    i.setRatio = e,
                                0 === r.autoRotate && (r.autoRotate = !0),
                                !r.autoRotate || r.autoRotate instanceof Array || (k = r.autoRotate === !0 ? 0 : Number(r.autoRotate) * b, r.autoRotate = null != m.end.left ? [["left", "top", "rotation", k, !0]] : null != m.end.x ? [["x", "y", "rotation", k, !0]] : !1),
                                r.autoRotate && (h._transform || h._enableTransforms(!1), m.autoRotate = h._target._gsTransform),
                                    j._onInitTween(m.proxy, r, h._tween),
                                    i
                            }
                        })
                    }
                },
                q._roundProps = function(a, b) {
                    for (var c = this._overwriteProps,
                             d = c.length; --d > -1;)(a[c[d]] || a.bezier || a.bezierThrough) && (this._round[c[d]] = b)
                },
                q._kill = function(a) {
                    var b, c, d = this._props;
                    for (b in this._beziers) if (b in a) for (delete this._beziers[b], delete this._func[b], c = d.length; --c > -1;) d[c] === b && d.splice(c, 1);
                    return this._super._kill.call(this, a)
                }
        } (),
        window._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"],
            function(a, b) {
                var c, d, e, f, g = function() {
                        a.call(this, "css"),
                            this._overwriteProps.length = 0,
                            this.setRatio = g.prototype.setRatio
                    },
                    h = {},
                    i = g.prototype = new a("css");
                i.constructor = g,
                    g.version = "1.10.2",
                    g.API = 2,
                    g.defaultTransformPerspective = 0,
                    i = "px",
                    g.suffixMap = {
                        top: i,
                        right: i,
                        bottom: i,
                        left: i,
                        width: i,
                        height: i,
                        fontSize: i,
                        padding: i,
                        margin: i,
                        perspective: i
                    };
                var j, k, l, m, n, o, p = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
                    q = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                    r = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                    s = /[^\d\-\.]/g,
                    t = /(?:\d|\-|\+|=|#|\.)*/g,
                    u = /opacity *= *([^)]*)/,
                    v = /opacity:([^;]*)/,
                    w = /alpha\(opacity *=.+?\)/i,
                    x = /^(rgb|hsl)/,
                    y = /([A-Z])/g,
                    z = /-([a-z])/gi,
                    A = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                    B = function(a, b) {
                        return b.toUpperCase()
                    },
                    C = /(?:Left|Right|Width)/i,
                    D = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                    E = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                    F = /,(?=[^\)]*(?:\(|$))/gi,
                    G = Math.PI / 180,
                    H = 180 / Math.PI,
                    I = {},
                    J = document,
                    K = J.createElement("div"),
                    L = J.createElement("img"),
                    M = g._internals = {
                        _specialProps: h
                    },
                    N = navigator.userAgent,
                    O = function() {
                        var a, b = N.indexOf("Android"),
                            c = J.createElement("div");
                        return l = -1 !== N.indexOf("Safari") && -1 === N.indexOf("Chrome") && ( - 1 === b || Number(N.substr(b + 8, 1)) > 3),
                            n = l && 6 > Number(N.substr(N.indexOf("Version/") + 8, 1)),
                            m = -1 !== N.indexOf("Firefox"),
                            /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(N),
                            o = parseFloat(RegExp.$1),
                            c.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>",
                            a = c.getElementsByTagName("a")[0],
                            a ? /^0.55/.test(a.style.opacity) : !1
                    } (),
                    P = function(a) {
                        return u.test("string" == typeof a ? a: (a.currentStyle ? a.currentStyle.filter: a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
                    },
                    Q = function(a) {
                        window.console && console.log(a)
                    },
                    R = "",
                    S = "",
                    T = function(a, b) {
                        b = b || K;
                        var c, d, e = b.style;
                        if (void 0 !== e[a]) return a;
                        for (a = a.charAt(0).toUpperCase() + a.substr(1), c = ["O", "Moz", "ms", "Ms", "Webkit"], d = 5; --d > -1 && void 0 === e[c[d] + a];);
                        return d >= 0 ? (S = 3 === d ? "ms": c[d], R = "-" + S.toLowerCase() + "-", S + a) : null
                    },
                    U = J.defaultView ? J.defaultView.getComputedStyle: function() {},
                    V = g.getStyle = function(a, b, c, d, e) {
                        var f;
                        return O || "opacity" !== b ? (!d && a.style[b] ? f = a.style[b] : (c = c || U(a, null)) ? (a = c.getPropertyValue(b.replace(y, "-$1").toLowerCase()), f = a || c.length ? a: c[b]) : a.currentStyle && (f = a.currentStyle[b]), null == e || f && "none" !== f && "auto" !== f && "auto auto" !== f ? f: e) : P(a)
                    },
                    W = function(a, b, c, d, e) {
                        if ("px" === d || !d) return c;
                        if ("auto" === d || !c) return 0;
                        var f, g = C.test(b),
                            h = a,
                            i = K.style,
                            j = 0 > c;
                        return j && (c = -c),
                            "%" === d && -1 !== b.indexOf("border") ? f = c / 100 * (g ? a.clientWidth: a.clientHeight) : (i.cssText = "border-style:solid; border-width:0; position:absolute; line-height:0;", "%" !== d && h.appendChild ? i[g ? "borderLeftWidth": "borderTopWidth"] = c + d: (h = a.parentNode || J.body, i[g ? "width": "height"] = c + d), h.appendChild(K), f = parseFloat(K[g ? "offsetWidth": "offsetHeight"]), h.removeChild(K), 0 !== f || e || (f = W(a, b, c, d, !0))),
                            j ? -f: f
                    },
                    X = function(a, b, c) {
                        if ("absolute" !== V(a, "position", c)) return 0;
                        var d = "left" === b ? "Left": "Top",
                            e = V(a, "margin" + d, c);
                        return a["offset" + d] - (W(a, b, parseFloat(e), e.replace(t, "")) || 0)
                    },
                    Y = function(a, b) {
                        var c, d, e = {};
                        if (b = b || U(a, null)) if (c = b.length) for (; --c > -1;) e[b[c].replace(z, B)] = b.getPropertyValue(b[c]);
                        else for (c in b) e[c] = b[c];
                        else if (b = a.currentStyle || a.style) for (c in b) e[c.replace(z, B)] = b[c];
                        return O || (e.opacity = P(a)),
                            d = xb(a, b, !1),
                            e.rotation = d.rotation * H,
                            e.skewX = d.skewX * H,
                            e.scaleX = d.scaleX,
                            e.scaleY = d.scaleY,
                            e.x = d.x,
                            e.y = d.y,
                        wb && (e.z = d.z, e.rotationX = d.rotationX * H, e.rotationY = d.rotationY * H, e.scaleZ = d.scaleZ),
                        e.filters && delete e.filters,
                            e
                    },
                    Z = function(a, b, c, d, e) {
                        var f, g, h, i = {},
                            j = a.style;
                        for (g in c)"cssText" !== g && "length" !== g && isNaN(g) && (b[g] !== (f = c[g]) || e && e[g]) && -1 === g.indexOf("Origin") && ("number" == typeof f || "string" == typeof f) && (i[g] = "auto" !== f || "left" !== g && "top" !== g ? "" !== f && "auto" !== f && "none" !== f || "string" != typeof b[g] || "" === b[g].replace(s, "") ? f: 0 : X(a, g), void 0 !== j[g] && (h = new lb(j, g, j[g], h)));
                        if (d) for (g in d)"className" !== g && (i[g] = d[g]);
                        return {
                            difs: i,
                            firstMPT: h
                        }
                    },
                    $ = {
                        width: ["Left", "Right"],
                        height: ["Top", "Bottom"]
                    },
                    _ = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                    ab = function(a, b, c) {
                        var d = parseFloat("width" === b ? a.offsetWidth: a.offsetHeight),
                            e = $[b],
                            f = e.length;
                        for (c = c || U(a, null); --f > -1;) d -= parseFloat(V(a, "padding" + e[f], c, !0)) || 0,
                            d -= parseFloat(V(a, "border" + e[f] + "Width", c, !0)) || 0;
                        return d
                    },
                    bb = function(a, b) { (null == a || "" === a || "auto" === a || "auto auto" === a) && (a = "0 0");
                        var c = a.split(" "),
                            d = -1 !== a.indexOf("left") ? "0%": -1 !== a.indexOf("right") ? "100%": c[0],
                            e = -1 !== a.indexOf("top") ? "0%": -1 !== a.indexOf("bottom") ? "100%": c[1];
                        return null == e ? e = "0": "center" === e && (e = "50%"),
                        ("center" === d || isNaN(parseFloat(d)) && -1 === (d + "").indexOf("=")) && (d = "50%"),
                        b && (b.oxp = -1 !== d.indexOf("%"), b.oyp = -1 !== e.indexOf("%"), b.oxr = "=" === d.charAt(1), b.oyr = "=" === e.charAt(1), b.ox = parseFloat(d.replace(s, "")), b.oy = parseFloat(e.replace(s, ""))),
                        d + " " + e + (c.length > 2 ? " " + c[2] : "")
                    },
                    cb = function(a, b) {
                        return "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(b)
                    },
                    db = function(a, b) {
                        return null == a ? b: "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * Number(a.substr(2)) + b: parseFloat(a)
                    },
                    eb = function(a, b, c, d) {
                        var e, f, g, h, i = 1e-6;
                        return null == a ? h = b: "number" == typeof a ? h = a * G: (e = 2 * Math.PI, f = a.split("_"), g = Number(f[0].replace(s, "")) * ( - 1 === a.indexOf("rad") ? G: 1) - ("=" === a.charAt(1) ? 0 : b), f.length && (d && (d[c] = b + g), -1 !== a.indexOf("short") && (g %= e, g !== g % (e / 2) && (g = 0 > g ? g + e: g - e)), -1 !== a.indexOf("_cw") && 0 > g ? g = (g + 9999999999 * e) % e - (0 | g / e) * e: -1 !== a.indexOf("ccw") && g > 0 && (g = (g - 9999999999 * e) % e - (0 | g / e) * e)), h = b + g),
                        i > h && h > -i && (h = 0),
                            h
                    },
                    fb = {
                        aqua: [0, 255, 255],
                        lime: [0, 255, 0],
                        silver: [192, 192, 192],
                        black: [0, 0, 0],
                        maroon: [128, 0, 0],
                        teal: [0, 128, 128],
                        blue: [0, 0, 255],
                        navy: [0, 0, 128],
                        white: [255, 255, 255],
                        fuchsia: [255, 0, 255],
                        olive: [128, 128, 0],
                        yellow: [255, 255, 0],
                        orange: [255, 165, 0],
                        gray: [128, 128, 128],
                        purple: [128, 0, 128],
                        green: [0, 128, 0],
                        red: [255, 0, 0],
                        pink: [255, 192, 203],
                        cyan: [0, 255, 255],
                        transparent: [255, 255, 255, 0]
                    },
                    gb = function(a, b, c) {
                        return a = 0 > a ? a + 1 : a > 1 ? a - 1 : a,
                        0 | 255 * (1 > 6 * a ? b + 6 * (c - b) * a: .5 > a ? c: 2 > 3 * a ? b + 6 * (c - b) * (2 / 3 - a) : b) + .5
                    },
                    hb = function(a) {
                        var b, c, d, e, f, g;
                        return a && "" !== a ? "number" == typeof a ? [a >> 16, 255 & a >> 8, 255 & a] : ("," === a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1)), fb[a] ? fb[a] : "#" === a.charAt(0) ? (4 === a.length && (b = a.charAt(1), c = a.charAt(2), d = a.charAt(3), a = "#" + b + b + c + c + d + d), a = parseInt(a.substr(1), 16), [a >> 16, 255 & a >> 8, 255 & a]) : "hsl" === a.substr(0, 3) ? (a = a.match(p), e = Number(a[0]) % 360 / 360, f = Number(a[1]) / 100, g = Number(a[2]) / 100, c = .5 >= g ? g * (f + 1) : g + f - g * f, b = 2 * g - c, a.length > 3 && (a[3] = Number(a[3])), a[0] = gb(e + 1 / 3, b, c), a[1] = gb(e, b, c), a[2] = gb(e - 1 / 3, b, c), a) : (a = a.match(p) || fb.transparent, a[0] = Number(a[0]), a[1] = Number(a[1]), a[2] = Number(a[2]), a.length > 3 && (a[3] = Number(a[3])), a)) : fb.black
                    },
                    ib = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
                for (i in fb) ib += "|" + i + "\\b";
                ib = RegExp(ib + ")", "gi");
                var jb = function(a, b, c, d) {
                        if (null == a) return function(a) {
                            return a
                        };
                        var e, f = b ? (a.match(ib) || [""])[0] : "",
                            g = a.split(f).join("").match(r) || [],
                            h = a.substr(0, a.indexOf(g[0])),
                            i = ")" === a.charAt(a.length - 1) ? ")": "",
                            j = -1 !== a.indexOf(" ") ? " ": ",",
                            k = g.length,
                            l = k > 0 ? g[0].replace(p, "") : "";
                        return k ? e = b ?
                            function(a) {
                                var b, m, n, o;
                                if ("number" == typeof a) a += l;
                                else if (d && F.test(a)) {
                                    for (o = a.replace(F, "|").split("|"), n = 0; o.length > n; n++) o[n] = e(o[n]);
                                    return o.join(",")
                                }
                                if (b = (a.match(ib) || [f])[0], m = a.split(b).join("").match(r) || [], n = m.length, k > n--) for (; k > ++n;) m[n] = c ? m[0 | (n - 1) / 2] : g[n];
                                return h + m.join(j) + j + b + i + ( - 1 !== a.indexOf("inset") ? " inset": "")
                            }: function(a) {
                            var b, f, m;
                            if ("number" == typeof a) a += l;
                            else if (d && F.test(a)) {
                                for (f = a.replace(F, "|").split("|"), m = 0; f.length > m; m++) f[m] = e(f[m]);
                                return f.join(",")
                            }
                            if (b = a.match(r) || [], m = b.length, k > m--) for (; k > ++m;) b[m] = c ? b[0 | (m - 1) / 2] : g[m];
                            return h + b.join(j) + i
                        }: function(a) {
                            return a
                        }
                    },
                    kb = function(a) {
                        return a = a.split(","),
                            function(b, c, d, e, f, g, h) {
                                var i, j = (c + "").split(" ");
                                for (h = {},
                                         i = 0; 4 > i; i++) h[a[i]] = j[i] = j[i] || j[(i - 1) / 2 >> 0];
                                return e.parse(b, h, f, g)
                            }
                    },
                    lb = (M._setPluginRatio = function(a) {
                        this.plugin.setRatio(a);
                        for (var b, c, d, e, f = this.data,
                                 g = f.proxy,
                                 h = f.firstMPT,
                                 i = 1e-6; h;) b = g[h.v],
                            h.r ? b = b > 0 ? 0 | b + .5 : 0 | b - .5 : i > b && b > -i && (b = 0),
                            h.t[h.p] = b,
                            h = h._next;
                        if (f.autoRotate && (f.autoRotate.rotation = g.rotation), 1 === a) for (h = f.firstMPT; h;) {
                            if (c = h.t, c.type) {
                                if (1 === c.type) {
                                    for (e = c.xs0 + c.s + c.xs1, d = 1; c.l > d; d++) e += c["xn" + d] + c["xs" + (d + 1)];
                                    c.e = e
                                }
                            } else c.e = c.s + c.xs0;
                            h = h._next
                        }
                    },
                        function(a, b, c, d, e) {
                            this.t = a,
                                this.p = b,
                                this.v = c,
                                this.r = e,
                            d && (d._prev = this, this._next = d)
                        }),
                    mb = (M._parseToProxy = function(a, b, c, d, e, f) {
                        var g, h, i, j, k, l = d,
                            m = {},
                            n = {},
                            o = c._transform,
                            p = I;
                        for (c._transform = null, I = b, d = k = c.parse(a, b, d, e), I = p, f && (c._transform = o, l && (l._prev = null, l._prev && (l._prev._next = null))); d && d !== l;) {
                            if (1 >= d.type && (h = d.p, n[h] = d.s + d.c, m[h] = d.s, f || (j = new lb(d, "s", h, j, d.r), d.c = 0), 1 === d.type)) for (g = d.l; --g > 0;) i = "xn" + g,
                                h = d.p + "_" + i,
                                n[h] = d.data[i],
                                m[h] = d[i],
                            f || (j = new lb(d, i, h, j, d.rxp[i]));
                            d = d._next
                        }
                        return {
                            proxy: m,
                            end: n,
                            firstMPT: j,
                            pt: k
                        }
                    },
                        M.CSSPropTween = function(a, b, d, e, g, h, i, j, k, l, m) {
                            this.t = a,
                                this.p = b,
                                this.s = d,
                                this.c = e,
                                this.n = i || b,
                            a instanceof mb || f.push(this.n),
                                this.r = j,
                                this.type = h || 0,
                            k && (this.pr = k, c = !0),
                                this.b = void 0 === l ? d: l,
                                this.e = void 0 === m ? d + e: m,
                            g && (this._next = g, g._prev = this)
                        }),
                    nb = g.parseComplex = function(a, b, c, d, e, f, g, h, i, k) {
                        c = c || f || "",
                            g = new mb(a, b, 0, 0, g, k ? 2 : 1, null, !1, h, c, d),
                            d += "";
                        var l, m, n, o, r, s, t, u, v, w, y, z, A = c.split(", ").join(",").split(" "),
                            B = d.split(", ").join(",").split(" "),
                            C = A.length,
                            D = j !== !1;
                        for (( - 1 !== d.indexOf(",") || -1 !== c.indexOf(",")) && (A = A.join(" ").replace(F, ", ").split(" "), B = B.join(" ").replace(F, ", ").split(" "), C = A.length), C !== B.length && (A = (f || "").split(" "), C = A.length), g.plugin = i, g.setRatio = k, l = 0; C > l; l++) if (o = A[l], r = B[l], u = parseFloat(o), u || 0 === u) g.appendXtra("", u, cb(r, u), r.replace(q, ""), D && -1 !== r.indexOf("px"), !0);
                        else if (e && ("#" === o.charAt(0) || fb[o] || x.test(o))) z = "," === r.charAt(r.length - 1) ? "),": ")",
                            o = hb(o),
                            r = hb(r),
                            v = o.length + r.length > 6,
                            v && !O && 0 === r[3] ? (g["xs" + g.l] += g.l ? " transparent": "transparent", g.e = g.e.split(B[l]).join("transparent")) : (O || (v = !1), g.appendXtra(v ? "rgba(": "rgb(", o[0], r[0] - o[0], ",", !0, !0).appendXtra("", o[1], r[1] - o[1], ",", !0).appendXtra("", o[2], r[2] - o[2], v ? ",": z, !0), v && (o = 4 > o.length ? 1 : o[3], g.appendXtra("", o, (4 > r.length ? 1 : r[3]) - o, z, !1)));
                        else if (s = o.match(p)) {
                            if (t = r.match(q), !t || t.length !== s.length) return g;
                            for (n = 0, m = 0; s.length > m; m++) y = s[m],
                                w = o.indexOf(y, n),
                                g.appendXtra(o.substr(n, w - n), Number(y), cb(t[m], y), "", D && "px" === o.substr(w + y.length, 2), 0 === m),
                                n = w + y.length;
                            g["xs" + g.l] += o.substr(n)
                        } else g["xs" + g.l] += g.l ? " " + o: o;
                        if ( - 1 !== d.indexOf("=") && g.data) {
                            for (z = g.xs0 + g.data.s, l = 1; g.l > l; l++) z += g["xs" + l] + g.data["xn" + l];
                            g.e = z + g["xs" + l]
                        }
                        return g.l || (g.type = -1, g.xs0 = g.e),
                        g.xfirst || g
                    },
                    ob = 9;
                for (i = mb.prototype, i.l = i.pr = 0; --ob > 0;) i["xn" + ob] = 0,
                    i["xs" + ob] = "";
                i.xs0 = "",
                    i._next = i._prev = i.xfirst = i.data = i.plugin = i.setRatio = i.rxp = null,
                    i.appendXtra = function(a, b, c, d, e, f) {
                        var g = this,
                            h = g.l;
                        return g["xs" + h] += f && h ? " " + a: a || "",
                            c || 0 === h || g.plugin ? (g.l++, g.type = g.setRatio ? 2 : 1, g["xs" + g.l] = d || "", h > 0 ? (g.data["xn" + h] = b + c, g.rxp["xn" + h] = e, g["xn" + h] = b, g.plugin || (g.xfirst = new mb(g, "xn" + h, b, c, g.xfirst || g, 0, g.n, e, g.pr), g.xfirst.xs0 = 0), g) : (g.data = {
                                s: b + c
                            },
                                g.rxp = {},
                                g.s = b, g.c = c, g.r = e, g)) : (g["xs" + h] += b + (d || ""), g)
                    };
                var pb = function(a, b) {
                        b = b || {},
                            this.p = b.prefix ? T(a) || a: a,
                            h[a] = h[this.p] = this,
                            this.format = b.formatter || jb(b.defaultValue, b.color, b.collapsible, b.multi),
                        b.parser && (this.parse = b.parser),
                            this.clrs = b.color,
                            this.multi = b.multi,
                            this.keyword = b.keyword,
                            this.dflt = b.defaultValue,
                            this.pr = b.priority || 0
                    },
                    qb = M._registerComplexSpecialProp = function(a, b, c) {
                        "object" != typeof b && (b = {
                            parser: c
                        });
                        var d, e, f = a.split(","),
                            g = b.defaultValue;
                        for (c = c || [g], d = 0; f.length > d; d++) b.prefix = 0 === d && b.prefix,
                            b.defaultValue = c[d] || g,
                            e = new pb(f[d], b)
                    },
                    rb = function(a) {
                        if (!h[a]) {
                            var b = a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                            qb(a, {
                                parser: function(a, c, d, e, f, g, i) {
                                    var j = (window.GreenSockGlobals || window).com.greensock.plugins[b];
                                    return j ? (j._cssRegister(), h[d].parse(a, c, d, e, f, g, i)) : (Q("Error: " + b + " js file not loaded."), f)
                                }
                            })
                        }
                    };
                i = pb.prototype,
                    i.parseComplex = function(a, b, c, d, e, f) {
                        var g, h, i, j, k, l, m = this.keyword;
                        if (this.multi && (F.test(c) || F.test(b) ? (h = b.replace(F, "|").split("|"), i = c.replace(F, "|").split("|")) : m && (h = [b], i = [c])), i) {
                            for (j = i.length > h.length ? i.length: h.length, g = 0; j > g; g++) b = h[g] = h[g] || this.dflt,
                                c = i[g] = i[g] || this.dflt,
                            m && (k = b.indexOf(m), l = c.indexOf(m), k !== l && (c = -1 === l ? i: h, c[g] += " " + m));
                            b = h.join(", "),
                                c = i.join(", ")
                        }
                        return nb(a, this.p, b, c, this.clrs, this.dflt, d, this.pr, e, f)
                    },
                    i.parse = function(a, b, c, d, f, g) {
                        return this.parseComplex(a.style, this.format(V(a, this.p, e, !1, this.dflt)), this.format(b), f, g)
                    },
                    g.registerSpecialProp = function(a, b, c) {
                        qb(a, {
                            parser: function(a, d, e, f, g, h) {
                                var i = new mb(a, e, 0, 0, g, 2, e, !1, c);
                                return i.plugin = h,
                                    i.setRatio = b(a, d, f._tween, e),
                                    i
                            },
                            priority: c
                        })
                    };
                var sb = "scaleX,scaleY,scaleZ,x,y,z,skewX,rotation,rotationX,rotationY,perspective".split(","),
                    tb = T("transform"),
                    ub = R + "transform",
                    vb = T("transformOrigin"),
                    wb = null !== T("perspective"),
                    xb = function(a, b, c, d) {
                        if (a._gsTransform && c && !d) return a._gsTransform;
                        var e, f, h, i, j, k, l, m, n, o, p, q, r, s = c ? a._gsTransform || {
                                skewY: 0
                            }: {
                                skewY: 0
                            },
                            t = 0 > s.scaleX,
                            u = 2e-5,
                            v = 1e5,
                            w = -Math.PI + 1e-4,
                            x = Math.PI - 1e-4,
                            y = wb ? parseFloat(V(a, vb, b, !1, "0 0 0").split(" ")[2]) || s.zOrigin || 0 : 0;
                        for (tb ? e = V(a, ub, b, !0) : a.currentStyle && (e = a.currentStyle.filter.match(D), e = e && 4 === e.length ? [e[0].substr(4), Number(e[2].substr(4)), Number(e[1].substr(4)), e[3].substr(4), s.x || 0, s.y || 0].join(",") : ""), f = (e || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], h = f.length; --h > -1;) i = Number(f[h]),
                            f[h] = (j = i - (i |= 0)) ? (0 | j * v + (0 > j ? -.5 : .5)) / v + i: i;
                        if (16 === f.length) {
                            var z = f[8],
                                A = f[9],
                                B = f[10],
                                C = f[12],
                                E = f[13],
                                F = f[14];
                            if (s.zOrigin && (F = -s.zOrigin, C = z * F - f[12], E = A * F - f[13], F = B * F + s.zOrigin - f[14]), !c || d || null == s.rotationX) {
                                var G, H, I, J, K, L, M, N = f[0],
                                    O = f[1],
                                    P = f[2],
                                    Q = f[3],
                                    R = f[4],
                                    S = f[5],
                                    T = f[6],
                                    U = f[7],
                                    W = f[11],
                                    X = s.rotationX = Math.atan2(T, B),
                                    Y = w > X || X > x;
                                X && (J = Math.cos( - X), K = Math.sin( - X), G = R * J + z * K, H = S * J + A * K, I = T * J + B * K, z = R * -K + z * J, A = S * -K + A * J, B = T * -K + B * J, W = U * -K + W * J, R = G, S = H, T = I),
                                    X = s.rotationY = Math.atan2(z, N),
                                X && (L = w > X || X > x, J = Math.cos( - X), K = Math.sin( - X), G = N * J - z * K, H = O * J - A * K, I = P * J - B * K, A = O * K + A * J, B = P * K + B * J, W = Q * K + W * J, N = G, O = H, P = I),
                                    X = s.rotation = Math.atan2(O, S),
                                X && (M = w > X || X > x, J = Math.cos( - X), K = Math.sin( - X), N = N * J + R * K, H = O * J + S * K, S = O * -K + S * J, T = P * -K + T * J, O = H),
                                    M && Y ? s.rotation = s.rotationX = 0 : M && L ? s.rotation = s.rotationY = 0 : L && Y && (s.rotationY = s.rotationX = 0),
                                    s.scaleX = (0 | Math.sqrt(N * N + O * O) * v + .5) / v,
                                    s.scaleY = (0 | Math.sqrt(S * S + A * A) * v + .5) / v,
                                    s.scaleZ = (0 | Math.sqrt(T * T + B * B) * v + .5) / v,
                                    s.skewX = 0,
                                    s.perspective = W ? 1 / (0 > W ? -W: W) : 0,
                                    s.x = C,
                                    s.y = E,
                                    s.z = F
                            }
                        } else if (! (wb && !d && f.length && s.x === f[4] && s.y === f[5] && (s.rotationX || s.rotationY) || void 0 !== s.x && "none" === V(a, "display", b))) {
                            var Z = f.length >= 6,
                                $ = Z ? f[0] : 1,
                                _ = f[1] || 0,
                                ab = f[2] || 0,
                                bb = Z ? f[3] : 1;
                            s.x = f[4] || 0,
                                s.y = f[5] || 0,
                                k = Math.sqrt($ * $ + _ * _),
                                l = Math.sqrt(bb * bb + ab * ab),
                                m = $ || _ ? Math.atan2(_, $) : s.rotation || 0,
                                n = ab || bb ? Math.atan2(ab, bb) + m: s.skewX || 0,
                                o = k - Math.abs(s.scaleX || 0),
                                p = l - Math.abs(s.scaleY || 0),
                            Math.abs(n) > Math.PI / 2 && Math.abs(n) < 1.5 * Math.PI && (t ? (k *= -1, n += 0 >= m ? Math.PI: -Math.PI, m += 0 >= m ? Math.PI: -Math.PI) : (l *= -1, n += 0 >= n ? Math.PI: -Math.PI)),
                                q = (m - s.rotation) % Math.PI,
                                r = (n - s.skewX) % Math.PI,
                            (void 0 === s.skewX || o > u || -u > o || p > u || -u > p || q > w && x > q && !1 | q * v || r > w && x > r && !1 | r * v) && (s.scaleX = k, s.scaleY = l, s.rotation = m, s.skewX = n),
                            wb && (s.rotationX = s.rotationY = s.z = 0, s.perspective = parseFloat(g.defaultTransformPerspective) || 0, s.scaleZ = 1)
                        }
                        s.zOrigin = y;
                        for (h in s) u > s[h] && s[h] > -u && (s[h] = 0);
                        return c && (a._gsTransform = s),
                            s
                    },
                    yb = function(a) {
                        var b, c, d = this.data,
                            e = -d.rotation,
                            f = e + d.skewX,
                            g = 1e5,
                            h = (0 | Math.cos(e) * d.scaleX * g) / g,
                            i = (0 | Math.sin(e) * d.scaleX * g) / g,
                            j = (0 | Math.sin(f) * -d.scaleY * g) / g,
                            k = (0 | Math.cos(f) * d.scaleY * g) / g,
                            l = this.t.style,
                            m = this.t.currentStyle;
                        if (m) {
                            c = i,
                                i = -j,
                                j = -c,
                                b = m.filter,
                                l.filter = "";
                            var n, p, q = this.t.offsetWidth,
                                r = this.t.offsetHeight,
                                s = "absolute" !== m.position,
                                v = "progid:DXImageTransform.Microsoft.Matrix(M11=" + h + ", M12=" + i + ", M21=" + j + ", M22=" + k,
                                w = d.x,
                                x = d.y;
                            if (null != d.ox && (n = (d.oxp ? .01 * q * d.ox: d.ox) - q / 2, p = (d.oyp ? .01 * r * d.oy: d.oy) - r / 2, w += n - (n * h + p * i), x += p - (n * j + p * k)), s) n = q / 2,
                                p = r / 2,
                                v += ", Dx=" + (n - (n * h + p * i) + w) + ", Dy=" + (p - (n * j + p * k) + x) + ")";
                            else {
                                var y, z, A, B = 8 > o ? 1 : -1;
                                for (n = d.ieOffsetX || 0, p = d.ieOffsetY || 0, d.ieOffsetX = Math.round((q - ((0 > h ? -h: h) * q + (0 > i ? -i: i) * r)) / 2 + w), d.ieOffsetY = Math.round((r - ((0 > k ? -k: k) * r + (0 > j ? -j: j) * q)) / 2 + x), ob = 0; 4 > ob; ob++) z = _[ob],
                                    y = m[z],
                                    c = -1 !== y.indexOf("px") ? parseFloat(y) : W(this.t, z, parseFloat(y), y.replace(t, "")) || 0,
                                    A = c !== d[z] ? 2 > ob ? -d.ieOffsetX: -d.ieOffsetY: 2 > ob ? n - d.ieOffsetX: p - d.ieOffsetY,
                                    l[z] = (d[z] = Math.round(c - A * (0 === ob || 2 === ob ? 1 : B))) + "px";
                                v += ", sizingMethod='auto expand')"
                            }
                            l.filter = -1 !== b.indexOf("DXImageTransform.Microsoft.Matrix(") ? b.replace(E, v) : v + " " + b,
                            (0 === a || 1 === a) && 1 === h && 0 === i && 0 === j && 1 === k && (s && -1 === v.indexOf("Dx=0, Dy=0") || u.test(b) && 100 !== parseFloat(RegExp.$1) || -1 === b.indexOf("gradient(") && l.removeAttribute("filter"))
                        }
                    },
                    zb = function() {
                        var a, b, c, d, e, f, g, h, i, j, k, l, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C = this.data,
                            D = this.t.style,
                            E = C.rotation,
                            F = C.scaleX,
                            G = C.scaleY,
                            H = C.scaleZ;
                        if (m && (z = D.top ? "top": D.bottom ? "bottom": parseFloat(V(this.t, "top", null, !1)) ? "bottom": "top", v = V(this.t, z, null, !1), A = parseFloat(v) || 0, B = v.substr((A + "").length) || "px", C._ffFix = !C._ffFix, D[z] = (C._ffFix ? A + .05 : A - .05) + B), E || C.skewX) t = Math.cos(E),
                            u = Math.sin(E),
                            a = t,
                            e = u,
                        C.skewX && (E -= C.skewX, t = Math.cos(E), u = Math.sin(E)),
                            b = -u,
                            f = t;
                        else {
                            if (!C.rotationY && !C.rotationX && 1 === H) return D[tb] = "translate3d(" + C.x + "px," + C.y + "px," + C.z + "px)" + (1 !== F || 1 !== G ? " scale(" + F + "," + G + ")": ""),
                                void 0;
                            a = f = 1,
                                b = e = 0
                        }
                        k = 1,
                            c = d = g = h = i = j = l = n = o = 0,
                            q = C.perspective,
                            p = q ? -1 / q: 0,
                            r = C.zOrigin,
                            s = 1e5,
                            E = C.rotationY,
                        E && (t = Math.cos(E), u = Math.sin(E), i = k * -u, n = p * -u, c = a * u, g = e * u, k *= t, p *= t, a *= t, e *= t),
                            E = C.rotationX,
                        E && (t = Math.cos(E), u = Math.sin(E), v = b * t + c * u, w = f * t + g * u, x = j * t + k * u, y = o * t + p * u, c = b * -u + c * t, g = f * -u + g * t, k = j * -u + k * t, p = o * -u + p * t, b = v, f = w, j = x, o = y),
                        1 !== H && (c *= H, g *= H, k *= H, p *= H),
                        1 !== G && (b *= G, f *= G, j *= G, o *= G),
                        1 !== F && (a *= F, e *= F, i *= F, n *= F),
                        r && (l -= r, d = c * l, h = g * l, l = k * l + r),
                            d = (v = (d += C.x) - (d |= 0)) ? (0 | v * s + (0 > v ? -.5 : .5)) / s + d: d,
                            h = (v = (h += C.y) - (h |= 0)) ? (0 | v * s + (0 > v ? -.5 : .5)) / s + h: h,
                            l = (v = (l += C.z) - (l |= 0)) ? (0 | v * s + (0 > v ? -.5 : .5)) / s + l: l,
                            D[tb] = "matrix3d(" + [(0 | a * s) / s, (0 | e * s) / s, (0 | i * s) / s, (0 | n * s) / s, (0 | b * s) / s, (0 | f * s) / s, (0 | j * s) / s, (0 | o * s) / s, (0 | c * s) / s, (0 | g * s) / s, (0 | k * s) / s, (0 | p * s) / s, d, h, l, q ? 1 + -l / q: 1].join(",") + ")"
                    },
                    Ab = function() {
                        var a, b, c, d, e, f, g, h, i, j = this.data,
                            k = this.t,
                            l = k.style;
                        m && (a = l.top ? "top": l.bottom ? "bottom": parseFloat(V(k, "top", null, !1)) ? "bottom": "top", b = V(k, a, null, !1), c = parseFloat(b) || 0, d = b.substr((c + "").length) || "px", j._ffFix = !j._ffFix, l[a] = (j._ffFix ? c + .05 : c - .05) + d),
                            j.rotation || j.skewX ? (e = j.rotation, f = e - j.skewX, g = 1e5, h = j.scaleX * g, i = j.scaleY * g, l[tb] = "matrix(" + (0 | Math.cos(e) * h) / g + "," + (0 | Math.sin(e) * h) / g + "," + (0 | Math.sin(f) * -i) / g + "," + (0 | Math.cos(f) * i) / g + "," + j.x + "," + j.y + ")") : l[tb] = "matrix(" + j.scaleX + ",0,0," + j.scaleY + "," + j.x + "," + j.y + ")"
                    };
                qb("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D", {
                    parser: function(a, b, c, d, f, g, h) {
                        if (d._transform) return f;
                        var i, j, k, l, m, n, o, p = d._transform = xb(a, e, !0, h.parseTransform),
                            q = a.style,
                            r = 1e-6,
                            s = sb.length,
                            t = h,
                            u = {};
                        if ("string" == typeof t.transform && tb) k = q.cssText,
                            q[tb] = t.transform,
                            q.display = "block",
                            i = xb(a, null, !1),
                            q.cssText = k;
                        else if ("object" == typeof t) {
                            if (i = {
                                    scaleX: db(null != t.scaleX ? t.scaleX: t.scale, p.scaleX),
                                    scaleY: db(null != t.scaleY ? t.scaleY: t.scale, p.scaleY),
                                    scaleZ: db(null != t.scaleZ ? t.scaleZ: t.scale, p.scaleZ),
                                    x: db(t.x, p.x),
                                    y: db(t.y, p.y),
                                    z: db(t.z, p.z),
                                    perspective: db(t.transformPerspective, p.perspective)
                                },
                                    o = t.directionalRotation, null != o) if ("object" == typeof o) for (k in o) t[k] = o[k];
                            else t.rotation = o;
                            i.rotation = eb("rotation" in t ? t.rotation: "shortRotation" in t ? t.shortRotation + "_short": "rotationZ" in t ? t.rotationZ: p.rotation * H, p.rotation, "rotation", u),
                            wb && (i.rotationX = eb("rotationX" in t ? t.rotationX: "shortRotationX" in t ? t.shortRotationX + "_short": p.rotationX * H || 0, p.rotationX, "rotationX", u), i.rotationY = eb("rotationY" in t ? t.rotationY: "shortRotationY" in t ? t.shortRotationY + "_short": p.rotationY * H || 0, p.rotationY, "rotationY", u)),
                                i.skewX = null == t.skewX ? p.skewX: eb(t.skewX, p.skewX),
                                i.skewY = null == t.skewY ? p.skewY: eb(t.skewY, p.skewY),
                            (j = i.skewY - p.skewY) && (i.skewX += j, i.rotation += j)
                        }
                        for (null != t.force3D && (p.force3D = t.force3D, n = !0), m = p.force3D || p.z || p.rotationX || p.rotationY || i.z || i.rotationX || i.rotationY || i.perspective, m || null == t.scale || (i.scaleZ = 1); --s > -1;) c = sb[s],
                            l = i[c] - p[c],
                        (l > r || -r > l || null != I[c]) && (n = !0, f = new mb(p, c, p[c], l, f), c in u && (f.e = u[c]), f.xs0 = 0, f.plugin = g, d._overwriteProps.push(f.n));
                        return l = t.transformOrigin,
                        (l || wb && m && p.zOrigin) && (tb ? (n = !0, c = vb, l = (l || V(a, c, e, !1, "50% 50%")) + "", f = new mb(q, c, 0, 0, f, -1, "transformOrigin"), f.b = q[c], f.plugin = g, wb ? (k = p.zOrigin, l = l.split(" "), p.zOrigin = (l.length > 2 && (0 === k || "0px" !== l[2]) ? parseFloat(l[2]) : k) || 0, f.xs0 = f.e = q[c] = l[0] + " " + (l[1] || "50%") + " 0px", f = new mb(p, "zOrigin", 0, 0, f, -1, f.n), f.b = k, f.xs0 = f.e = p.zOrigin) : f.xs0 = f.e = q[c] = l) : bb(l + "", p)),
                        n && (d._transformType = m || 3 === this._transformType ? 3 : 2),
                            f
                    },
                    prefix: !0
                }),
                    qb("boxShadow", {
                        defaultValue: "0px 0px 0px 0px #999",
                        prefix: !0,
                        color: !0,
                        multi: !0,
                        keyword: "inset"
                    }),
                    qb("borderRadius", {
                        defaultValue: "0px",
                        parser: function(a, b, c, f, g) {
                            b = this.format(b);
                            var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                                y = a.style;
                            for (p = parseFloat(a.offsetWidth), q = parseFloat(a.offsetHeight), h = b.split(" "), i = 0; x.length > i; i++) this.p.indexOf("border") && (x[i] = T(x[i])),
                                l = k = V(a, x[i], e, !1, "0px"),
                            -1 !== l.indexOf(" ") && (k = l.split(" "), l = k[0], k = k[1]),
                                m = j = h[i],
                                n = parseFloat(l),
                                s = l.substr((n + "").length),
                                t = "=" === m.charAt(1),
                                t ? (o = parseInt(m.charAt(0) + "1", 10), m = m.substr(2), o *= parseFloat(m), r = m.substr((o + "").length - (0 > o ? 1 : 0)) || "") : (o = parseFloat(m), r = m.substr((o + "").length)),
                            "" === r && (r = d[c] || s),
                            r !== s && (u = W(a, "borderLeft", n, s), v = W(a, "borderTop", n, s), "%" === r ? (l = 100 * (u / p) + "%", k = 100 * (v / q) + "%") : "em" === r ? (w = W(a, "borderLeft", 1, "em"), l = u / w + "em", k = v / w + "em") : (l = u + "px", k = v + "px"), t && (m = parseFloat(l) + o + r, j = parseFloat(k) + o + r)),
                                g = nb(y, x[i], l + " " + k, m + " " + j, !1, "0px", g);
                            return g
                        },
                        prefix: !0,
                        formatter: jb("0px 0px 0px 0px", !1, !0)
                    }),
                    qb("backgroundPosition", {
                        defaultValue: "0 0",
                        parser: function(a, b, c, d, f, g) {
                            var h, i, j, k, l, m, n = "background-position",
                                p = e || U(a, null),
                                q = this.format((p ? o ? p.getPropertyValue(n + "-x") + " " + p.getPropertyValue(n + "-y") : p.getPropertyValue(n) : a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0"),
                                r = this.format(b);
                            if ( - 1 !== q.indexOf("%") != ( - 1 !== r.indexOf("%")) && (m = V(a, "backgroundImage").replace(A, ""), m && "none" !== m)) {
                                for (h = q.split(" "), i = r.split(" "), L.setAttribute("src", m), j = 2; --j > -1;) q = h[j],
                                    k = -1 !== q.indexOf("%"),
                                k !== ( - 1 !== i[j].indexOf("%")) && (l = 0 === j ? a.offsetWidth - L.width: a.offsetHeight - L.height, h[j] = k ? parseFloat(q) / 100 * l + "px": 100 * (parseFloat(q) / l) + "%");
                                q = h.join(" ")
                            }
                            return this.parseComplex(a.style, q, r, f, g)
                        },
                        formatter: bb
                    }),
                    qb("backgroundSize", {
                        defaultValue: "0 0",
                        formatter: bb
                    }),
                    qb("perspective", {
                        defaultValue: "0px",
                        prefix: !0
                    }),
                    qb("perspectiveOrigin", {
                        defaultValue: "50% 50%",
                        prefix: !0
                    }),
                    qb("transformStyle", {
                        prefix: !0
                    }),
                    qb("backfaceVisibility", {
                        prefix: !0
                    }),
                    qb("margin", {
                        parser: kb("marginTop,marginRight,marginBottom,marginLeft")
                    }),
                    qb("padding", {
                        parser: kb("paddingTop,paddingRight,paddingBottom,paddingLeft")
                    }),
                    qb("clip", {
                        defaultValue: "rect(0px,0px,0px,0px)",
                        parser: function(a, b, c, d, f, g) {
                            var h, i, j;
                            return 9 > o ? (i = a.currentStyle, j = 8 > o ? " ": ",", h = "rect(" + i.clipTop + j + i.clipRight + j + i.clipBottom + j + i.clipLeft + ")", b = this.format(b).split(",").join(j)) : (h = this.format(V(a, this.p, e, !1, this.dflt)), b = this.format(b)),
                                this.parseComplex(a.style, h, b, f, g)
                        }
                    }),
                    qb("textShadow", {
                        defaultValue: "0px 0px 0px #999",
                        color: !0,
                        multi: !0
                    }),
                    qb("autoRound,strictUnits", {
                        parser: function(a, b, c, d, e) {
                            return e
                        }
                    }),
                    qb("border", {
                        defaultValue: "0px solid #000",
                        parser: function(a, b, c, d, f, g) {
                            return this.parseComplex(a.style, this.format(V(a, "borderTopWidth", e, !1, "0px") + " " + V(a, "borderTopStyle", e, !1, "solid") + " " + V(a, "borderTopColor", e, !1, "#000")), this.format(b), f, g)
                        },
                        color: !0,
                        formatter: function(a) {
                            var b = a.split(" ");
                            return b[0] + " " + (b[1] || "solid") + " " + (a.match(ib) || ["#000"])[0]
                        }
                    }),
                    qb("float,cssFloat,styleFloat", {
                        parser: function(a, b, c, d, e) {
                            var f = a.style,
                                g = "cssFloat" in f ? "cssFloat": "styleFloat";
                            return new mb(f, g, 0, 0, e, -1, c, !1, 0, f[g], b)
                        }
                    });
                var Bb = function(a) {
                    var b, c = this.t,
                        d = c.filter || V(this.data, "filter"),
                        e = 0 | this.s + this.c * a;
                    100 === e && ( - 1 === d.indexOf("atrix(") && -1 === d.indexOf("radient(") ? (c.removeAttribute("filter"), b = !V(this.data, "filter")) : (c.filter = d.replace(w, ""), b = !0)),
                    b || (this.xn1 && (c.filter = d = d || "alpha(opacity=" + e + ")"), -1 === d.indexOf("opacity") ? 0 === e && this.xn1 || (c.filter += " alpha(opacity=" + e + ")") : c.filter = d.replace(u, "opacity=" + e))
                };
                qb("opacity,alpha,autoAlpha", {
                    defaultValue: "1",
                    parser: function(a, b, c, d, f, g) {
                        var h = parseFloat(V(a, "opacity", e, !1, "1")),
                            i = a.style,
                            j = "autoAlpha" === c;
                        return b = parseFloat(b),
                        j && 1 === h && "hidden" === V(a, "visibility", e) && 0 !== b && (h = 0),
                            O ? f = new mb(i, "opacity", h, b - h, f) : (f = new mb(i, "opacity", 100 * h, 100 * (b - h), f), f.xn1 = j ? 1 : 0, i.zoom = 1, f.type = 2, f.b = "alpha(opacity=" + f.s + ")", f.e = "alpha(opacity=" + (f.s + f.c) + ")", f.data = a, f.plugin = g, f.setRatio = Bb),
                        j && (f = new mb(i, "visibility", 0, 0, f, -1, null, !1, 0, 0 !== h ? "inherit": "hidden", 0 === b ? "hidden": "inherit"), f.xs0 = "inherit", d._overwriteProps.push(f.n)),
                            f
                    }
                });
                var Cb = function(a, b) {
                        b && (a.removeProperty ? a.removeProperty(b.replace(y, "-$1").toLowerCase()) : a.removeAttribute(b))
                    },
                    Db = function(a) {
                        if (this.t._gsClassPT = this, 1 === a || 0 === a) {
                            this.t.className = 0 === a ? this.b: this.e;
                            for (var b = this.data,
                                     c = this.t.style; b;) b.v ? c[b.p] = b.v: Cb(c, b.p),
                                b = b._next;
                            1 === a && this.t._gsClassPT === this && (this.t._gsClassPT = null)
                        } else this.t.className !== this.e && (this.t.className = this.e)
                    };
                qb("className", {
                    parser: function(a, b, d, f, g, h, i) {
                        var j, k, l, m, n, o = a.className,
                            p = a.style.cssText;
                        if (g = f._classNamePT = new mb(a, d, 0, 0, g, 2), g.setRatio = Db, g.pr = -11, c = !0, g.b = o, k = Y(a, e), l = a._gsClassPT) {
                            for (m = {},
                                     n = l.data; n;) m[n.p] = 1,
                                n = n._next;
                            l.setRatio(1)
                        }
                        return a._gsClassPT = g,
                            g.e = "=" !== b.charAt(1) ? b: o.replace(RegExp("\\s*\\b" + b.substr(2) + "\\b"), "") + ("+" === b.charAt(0) ? " " + b.substr(2) : ""),
                        f._tween._duration && (a.className = g.e, j = Z(a, k, Y(a), i, m), a.className = o, g.data = j.firstMPT, a.style.cssText = p, g = g.xfirst = f.parse(a, j.difs, g, h)),
                            g
                    }
                });
                var Eb = function(a) {
                    if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration) {
                        if ("all" === this.e) return this.t.style.cssText = "",
                        this.t._gsTransform && delete this.t._gsTransform,
                            void 0;
                        for (var b, c = this.t.style,
                                 d = this.e.split(","), e = d.length, f = h.transform.parse; --e > -1;) b = d[e],
                        h[b] && (b = h[b].parse === f ? tb: h[b].p),
                            Cb(c, b)
                    }
                };
                for (qb("clearProps", {
                    parser: function(a, b, d, e, f) {
                        return f = new mb(a, d, 0, 0, f, 2),
                            f.setRatio = Eb,
                            f.e = b,
                            f.pr = -10,
                            f.data = e._tween,
                            c = !0,
                            f
                    }
                }), i = "bezier,throwProps,physicsProps,physics2D".split(","), ob = i.length; ob--;) rb(i[ob]);
                i = g.prototype,
                    i._firstPT = null,
                    i._onInitTween = function(a, b, h) {
                        if (!a.nodeType) return ! 1;
                        this._target = a,
                            this._tween = h,
                            this._vars = b,
                            j = b.autoRound,
                            c = !1,
                            d = b.suffixMap || g.suffixMap,
                            e = U(a, ""),
                            f = this._overwriteProps;
                        var i, m, o, p, q, r, s, t, u, w = a.style;
                        if (k && "" === w.zIndex && (i = V(a, "zIndex", e), ("auto" === i || "" === i) && (w.zIndex = 0)), "string" == typeof b && (p = w.cssText, i = Y(a, e), w.cssText = p + ";" + b, i = Z(a, i, Y(a)).difs, !O && v.test(b) && (i.opacity = parseFloat(RegExp.$1)), b = i, w.cssText = p), this._firstPT = m = this.parse(a, b, null), this._transformType) {
                            for (u = 3 === this._transformType, tb ? l && (k = !0, "" === w.zIndex && (s = V(a, "zIndex", e), ("auto" === s || "" === s) && (w.zIndex = 0)), n && (w.WebkitBackfaceVisibility = this._vars.WebkitBackfaceVisibility || (u ? "visible": "hidden"))) : w.zoom = 1, o = m; o && o._next;) o = o._next;
                            t = new mb(a, "transform", 0, 0, null, 2),
                                this._linkCSSP(t, null, o),
                                t.setRatio = u && wb ? zb: tb ? Ab: yb,
                                t.data = this._transform || xb(a, e, !0),
                                f.pop()
                        }
                        if (c) {
                            for (; m;) {
                                for (r = m._next, o = p; o && o.pr > m.pr;) o = o._next; (m._prev = o ? o._prev: q) ? m._prev._next = m: p = m,
                                    (m._next = o) ? o._prev = m: q = m,
                                    m = r
                            }
                            this._firstPT = p
                        }
                        return ! 0
                    },
                    i.parse = function(a, b, c, f) {
                        var g, i, k, l, m, n, o, p, q, r, s = a.style;
                        for (g in b) n = b[g],
                            i = h[g],
                            i ? c = i.parse(a, n, g, this, c, f, b) : (m = V(a, g, e) + "", q = "string" == typeof n, "color" === g || "fill" === g || "stroke" === g || -1 !== g.indexOf("Color") || q && x.test(n) ? (q || (n = hb(n), n = (n.length > 3 ? "rgba(": "rgb(") + n.join(",") + ")"), c = nb(s, g, m, n, !0, "transparent", c, 0, f)) : !q || -1 === n.indexOf(" ") && -1 === n.indexOf(",") ? (k = parseFloat(m), o = k || 0 === k ? m.substr((k + "").length) : "", ("" === m || "auto" === m) && ("width" === g || "height" === g ? (k = ab(a, g, e), o = "px") : "left" === g || "top" === g ? (k = X(a, g, e), o = "px") : (k = "opacity" !== g ? 0 : 1, o = "")), r = q && "=" === n.charAt(1), r ? (l = parseInt(n.charAt(0) + "1", 10), n = n.substr(2), l *= parseFloat(n), p = n.replace(t, "")) : (l = parseFloat(n), p = q ? n.substr((l + "").length) || "": ""), "" === p && (p = d[g] || o), n = l || 0 === l ? (r ? l + k: l) + p: b[g], o !== p && "" !== p && (l || 0 === l) && (k || 0 === k) && (k = W(a, g, k, o), "%" === p ? (k /= W(a, g, 100, "%") / 100, k > 100 && (k = 100), b.strictUnits !== !0 && (m = k + "%")) : "em" === p ? k /= W(a, g, 1, "em") : (l = W(a, g, l, p), p = "px"), r && (l || 0 === l) && (n = l + k + p)), r && (l += k), !k && 0 !== k || !l && 0 !== l ? void 0 !== s[g] && (n || "NaN" != n + "" && null != n) ? (c = new mb(s, g, l || k || 0, 0, c, -1, g, !1, 0, m, n), c.xs0 = "none" !== n || "display" !== g && -1 === g.indexOf("Style") ? n: m) : Q("invalid " + g + " tween value: " + b[g]) : (c = new mb(s, g, k, l - k, c, 0, g, j !== !1 && ("px" === p || "zIndex" === g), 0, m, n), c.xs0 = p)) : c = nb(s, g, m, n, !0, null, c, 0, f)),
                        f && c && !c.plugin && (c.plugin = f);
                        return c
                    },
                    i.setRatio = function(a) {
                        var b, c, d, e = this._firstPT,
                            f = 1e-6;
                        if (1 !== a || this._tween._time !== this._tween._duration && 0 !== this._tween._time) if (a || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6) for (; e;) {
                            if (b = e.c * a + e.s, e.r ? b = b > 0 ? 0 | b + .5 : 0 | b - .5 : f > b && b > -f && (b = 0), e.type) if (1 === e.type) if (d = e.l, 2 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2;
                            else if (3 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3;
                            else if (4 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4;
                            else if (5 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4 + e.xn4 + e.xs5;
                            else {
                                for (c = e.xs0 + b + e.xs1, d = 1; e.l > d; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                                e.t[e.p] = c
                            } else - 1 === e.type ? e.t[e.p] = e.xs0: e.setRatio && e.setRatio(a);
                            else e.t[e.p] = b + e.xs0;
                            e = e._next
                        } else for (; e;) 2 !== e.type ? e.t[e.p] = e.b: e.setRatio(a),
                            e = e._next;
                        else for (; e;) 2 !== e.type ? e.t[e.p] = e.e: e.setRatio(a),
                            e = e._next
                    },
                    i._enableTransforms = function(a) {
                        this._transformType = a || 3 === this._transformType ? 3 : 2,
                            this._transform = this._transform || xb(this._target, e, !0)
                    },
                    i._linkCSSP = function(a, b, c, d) {
                        return a && (b && (b._prev = a), a._next && (a._next._prev = a._prev), a._prev ? a._prev._next = a._next: this._firstPT === a && (this._firstPT = a._next, d = !0), c ? c._next = a: d || null !== this._firstPT || (this._firstPT = a), a._next = b, a._prev = c),
                            a
                    },
                    i._kill = function(b) {
                        var c, d, e, f = b;
                        if (b.autoAlpha || b.alpha) {
                            f = {};
                            for (d in b) f[d] = b[d];
                            f.opacity = 1,
                            f.autoAlpha && (f.visibility = 1)
                        }
                        return b.className && (c = this._classNamePT) && (e = c.xfirst, e && e._prev ? this._linkCSSP(e._prev, c._next, e._prev._prev) : e === this._firstPT && (this._firstPT = c._next), c._next && this._linkCSSP(c._next, c._next._next, e._prev), this._classNamePT = null),
                            a.prototype._kill.call(this, f)
                    };
                var Fb = function(a, b, c) {
                    var d, e, f, g;
                    if (a.slice) for (e = a.length; --e > -1;) Fb(a[e], b, c);
                    else for (d = a.childNodes, e = d.length; --e > -1;) f = d[e],
                        g = f.type,
                    f.style && (b.push(Y(f)), c && c.push(f)),
                    1 !== g && 9 !== g && 11 !== g || !f.childNodes.length || Fb(f, b, c)
                };
                return g.cascadeTo = function(a, c, d) {
                    var e, f, g, h = b.to(a, c, d),
                        i = [h],
                        j = [],
                        k = [],
                        l = [],
                        m = b._internals.reservedProps;
                    for (a = h._targets || h.target, Fb(a, j, l), h.render(c, !0), Fb(a, k), h.render(0, !0), h._enabled(!0), e = l.length; --e > -1;) if (f = Z(l[e], j[e], k[e]), f.firstMPT) {
                        f = f.difs;
                        for (g in d) m[g] && (f[g] = d[g]);
                        i.push(b.to(l[e], c, f))
                    }
                    return i
                },
                    a.activate([g]),
                    g
            },
            !0),
        function() {
            var a = window._gsDefine.plugin({
                    propName: "roundProps",
                    priority: -1,
                    API: 2,
                    init: function(a, b, c) {
                        return this._tween = c,
                            !0
                    }
                }),
                b = a.prototype;
            b._onInitAllProps = function() {
                for (var a, b, c, d = this._tween,
                         e = d.vars.roundProps instanceof Array ? d.vars.roundProps: d.vars.roundProps.split(","), f = e.length, g = {},
                         h = d._propLookup.roundProps; --f > -1;) g[e[f]] = 1;
                for (f = e.length; --f > -1;) for (a = e[f], b = d._firstPT; b;) c = b._next,
                    b.pg ? b.t._roundProps(g, !0) : b.n === a && (this._add(b.t, a, b.s, b.c), c && (c._prev = b._prev), b._prev ? b._prev._next = c: d._firstPT === b && (d._firstPT = c), b._next = b._prev = null, d._propLookup[a] = h),
                    b = c;
                return ! 1
            },
                b._add = function(a, b, c, d) {
                    this._addTween(a, b, c, c + d, b, !0),
                        this._overwriteProps.push(b)
                }
        } (),
        window._gsDefine.plugin({
            propName: "attr",
            API: 2,
            init: function(a, b) {
                var c;
                if ("function" != typeof a.setAttribute) return ! 1;
                this._target = a,
                    this._proxy = {};
                for (c in b) this._addTween(this._proxy, c, parseFloat(a.getAttribute(c)), b[c], c) && this._overwriteProps.push(c);
                return ! 0
            },
            set: function(a) {
                this._super.setRatio.call(this, a);
                for (var b, c = this._overwriteProps,
                         d = c.length; --d > -1;) b = c[d],
                    this._target.setAttribute(b, this._proxy[b] + "")
            }
        }),
        window._gsDefine.plugin({
            propName: "directionalRotation",
            API: 2,
            init: function(a, b) {
                "object" != typeof b && (b = {
                    rotation: b
                }),
                    this.finals = {};
                var c, d, e, f, g, h, i = b.useRadians === !0 ? 2 * Math.PI: 360,
                    j = 1e-6;
                for (c in b)"useRadians" !== c && (h = (b[c] + "").split("_"), d = h[0], e = parseFloat("function" != typeof a[c] ? a[c] : a[c.indexOf("set") || "function" != typeof a["get" + c.substr(3)] ? c: "get" + c.substr(3)]()), f = this.finals[c] = "string" == typeof d && "=" === d.charAt(1) ? e + parseInt(d.charAt(0) + "1", 10) * Number(d.substr(2)) : Number(d) || 0, g = f - e, h.length && (d = h.join("_"), -1 !== d.indexOf("short") && (g %= i, g !== g % (i / 2) && (g = 0 > g ? g + i: g - i)), -1 !== d.indexOf("_cw") && 0 > g ? g = (g + 9999999999 * i) % i - (0 | g / i) * i: -1 !== d.indexOf("ccw") && g > 0 && (g = (g - 9999999999 * i) % i - (0 | g / i) * i)), (g > j || -j > g) && (this._addTween(a, c, e, e + g, c), this._overwriteProps.push(c)));
                return ! 0
            },
            set: function(a) {
                var b;
                if (1 !== a) this._super.setRatio.call(this, a);
                else for (b = this._firstPT; b;) b.f ? b.t[b.p](this.finals[b.p]) : b.t[b.p] = this.finals[b.p],
                    b = b._next
            }
        })._autoCSS = !0,
        window._gsDefine("easing.Back", ["easing.Ease"],
            function(a) {
                var b, c, d, e = window.GreenSockGlobals || window,
                    f = e.com.greensock,
                    g = 2 * Math.PI,
                    h = Math.PI / 2,
                    i = f._class,
                    j = function(b, c) {
                        var d = i("easing." + b,
                            function() {},
                            !0),
                            e = d.prototype = new a;
                        return e.constructor = d,
                            e.getRatio = c,
                            d
                    },
                    k = a.register ||
                        function() {},
                    l = function(a, b, c, d) {
                        var e = i("easing." + a, {
                                easeOut: new b,
                                easeIn: new c,
                                easeInOut: new d
                            },
                            !0);
                        return k(e, a),
                            e
                    },
                    m = function(a, b, c) {
                        this.t = a,
                            this.v = b,
                        c && (this.next = c, c.prev = this, this.c = c.v - b, this.gap = c.t - a)
                    },
                    n = function(b, c) {
                        var d = i("easing." + b,
                            function(a) {
                                this._p1 = a || 0 === a ? a: 1.70158,
                                    this._p2 = 1.525 * this._p1
                            },
                            !0),
                            e = d.prototype = new a;
                        return e.constructor = d,
                            e.getRatio = c,
                            e.config = function(a) {
                                return new d(a)
                            },
                            d
                    },
                    o = l("Back", n("BackOut",
                        function(a) {
                            return (a -= 1) * a * ((this._p1 + 1) * a + this._p1) + 1
                        }), n("BackIn",
                        function(a) {
                            return a * a * ((this._p1 + 1) * a - this._p1)
                        }), n("BackInOut",
                        function(a) {
                            return 1 > (a *= 2) ? .5 * a * a * ((this._p2 + 1) * a - this._p2) : .5 * ((a -= 2) * a * ((this._p2 + 1) * a + this._p2) + 2)
                        })),
                    p = i("easing.SlowMo",
                        function(a, b, c) {
                            b = b || 0 === b ? b: .7,
                                null == a ? a = .7 : a > 1 && (a = 1),
                                this._p = 1 !== a ? b: 0,
                                this._p1 = (1 - a) / 2,
                                this._p2 = a,
                                this._p3 = this._p1 + this._p2,
                                this._calcEnd = c === !0
                        },
                        !0),
                    q = p.prototype = new a;
                return q.constructor = p,
                    q.getRatio = function(a) {
                        var b = a + (.5 - a) * this._p;
                        return this._p1 > a ? this._calcEnd ? 1 - (a = 1 - a / this._p1) * a: b - (a = 1 - a / this._p1) * a * a * a * b: a > this._p3 ? this._calcEnd ? 1 - (a = (a - this._p3) / this._p1) * a: b + (a - b) * (a = (a - this._p3) / this._p1) * a * a * a: this._calcEnd ? 1 : b
                    },
                    p.ease = new p(.7, .7),
                    q.config = p.config = function(a, b, c) {
                        return new p(a, b, c)
                    },
                    b = i("easing.SteppedEase",
                        function(a) {
                            a = a || 1,
                                this._p1 = 1 / a,
                                this._p2 = a + 1
                        },
                        !0),
                    q = b.prototype = new a,
                    q.constructor = b,
                    q.getRatio = function(a) {
                        return 0 > a ? a = 0 : a >= 1 && (a = .999999999),
                        (this._p2 * a >> 0) * this._p1
                    },
                    q.config = b.config = function(a) {
                        return new b(a)
                    },
                    c = i("easing.RoughEase",
                        function(b) {
                            b = b || {};
                            for (var c, d, e, f, g, h, i = b.taper || "none",
                                     j = [], k = 0, l = 0 | (b.points || 20), n = l, o = b.randomize !== !1, p = b.clamp === !0, q = b.template instanceof a ? b.template: null, r = "number" == typeof b.strength ? .4 * b.strength: .4; --n > -1;) c = o ? Math.random() : 1 / l * n,
                                d = q ? q.getRatio(c) : c,
                                "none" === i ? e = r: "out" === i ? (f = 1 - c, e = f * f * r) : "in" === i ? e = c * c * r: .5 > c ? (f = 2 * c, e = .5 * f * f * r) : (f = 2 * (1 - c), e = .5 * f * f * r),
                                o ? d += Math.random() * e - .5 * e: n % 2 ? d += .5 * e: d -= .5 * e,
                            p && (d > 1 ? d = 1 : 0 > d && (d = 0)),
                                j[k++] = {
                                    x: c,
                                    y: d
                                };
                            for (j.sort(function(a, b) {
                                return a.x - b.x
                            }), h = new m(1, 1, null), n = l; --n > -1;) g = j[n],
                                h = new m(g.x, g.y, h);
                            this._prev = new m(0, 0, 0 !== h.t ? h: h.next)
                        },
                        !0),
                    q = c.prototype = new a,
                    q.constructor = c,
                    q.getRatio = function(a) {
                        var b = this._prev;
                        if (a > b.t) {
                            for (; b.next && a >= b.t;) b = b.next;
                            b = b.prev
                        } else for (; b.prev && b.t >= a;) b = b.prev;
                        return this._prev = b,
                        b.v + (a - b.t) / b.gap * b.c
                    },
                    q.config = function(a) {
                        return new c(a)
                    },
                    c.ease = new c,
                    l("Bounce", j("BounceOut",
                        function(a) {
                            return 1 / 2.75 > a ? 7.5625 * a * a: 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
                        }), j("BounceIn",
                        function(a) {
                            return 1 / 2.75 > (a = 1 - a) ? 1 - 7.5625 * a * a: 2 / 2.75 > a ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : 2.5 / 2.75 > a ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375)
                        }), j("BounceInOut",
                        function(a) {
                            var b = .5 > a;
                            return a = b ? 1 - 2 * a: 2 * a - 1,
                                a = 1 / 2.75 > a ? 7.5625 * a * a: 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375,
                                b ? .5 * (1 - a) : .5 * a + .5
                        })),
                    l("Circ", j("CircOut",
                        function(a) {
                            return Math.sqrt(1 - (a -= 1) * a)
                        }), j("CircIn",
                        function(a) {
                            return - (Math.sqrt(1 - a * a) - 1)
                        }), j("CircInOut",
                        function(a) {
                            return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
                        })),
                    d = function(b, c, d) {
                        var e = i("easing." + b,
                            function(a, b) {
                                this._p1 = a || 1,
                                    this._p2 = b || d,
                                    this._p3 = this._p2 / g * (Math.asin(1 / this._p1) || 0)
                            },
                            !0),
                            f = e.prototype = new a;
                        return f.constructor = e,
                            f.getRatio = c,
                            f.config = function(a, b) {
                                return new e(a, b)
                            },
                            e
                    },
                    l("Elastic", d("ElasticOut",
                        function(a) {
                            return this._p1 * Math.pow(2, -10 * a) * Math.sin((a - this._p3) * g / this._p2) + 1
                        },
                        .3), d("ElasticIn",
                        function(a) {
                            return - (this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * g / this._p2))
                        },
                        .3), d("ElasticInOut",
                        function(a) {
                            return 1 > (a *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * g / this._p2) : .5 * this._p1 * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - this._p3) * g / this._p2) + 1
                        },
                        .45)),
                    l("Expo", j("ExpoOut",
                        function(a) {
                            return 1 - Math.pow(2, -10 * a)
                        }), j("ExpoIn",
                        function(a) {
                            return Math.pow(2, 10 * (a - 1)) - .001
                        }), j("ExpoInOut",
                        function(a) {
                            return 1 > (a *= 2) ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (2 - Math.pow(2, -10 * (a - 1)))
                        })),
                    l("Sine", j("SineOut",
                        function(a) {
                            return Math.sin(a * h)
                        }), j("SineIn",
                        function(a) {
                            return - Math.cos(a * h) + 1
                        }), j("SineInOut",
                        function(a) {
                            return - .5 * (Math.cos(Math.PI * a) - 1)
                        })),
                    i("easing.EaseLookup", {
                            find: function(b) {
                                return a.map[b]
                            }
                        },
                        !0),
                    k(e.SlowMo, "SlowMo", "ease,"),
                    k(c, "RoughEase", "ease,"),
                    k(b, "SteppedEase", "ease,"),
                    o
            },
            !0)
}),
    function(a) {
        "use strict";
        var b, c, d, e, f, g = a.GreenSockGlobals || a,
            h = function(a) {
                var b, c = a.split("."),
                    d = g;
                for (b = 0; c.length > b; b++) d[c[b]] = d = d[c[b]] || {};
                return d
            },
            i = h("com.greensock"),
            j = [].slice,
            k = function() {},
            l = {},
            m = function(b, c, d, e) {
                this.sc = l[b] ? l[b].sc: [],
                    l[b] = this,
                    this.gsClass = null,
                    this.func = d;
                var f = [];
                this.check = function(i) {
                    for (var j, k, n, o, p = c.length,
                             q = p; --p > -1;)(j = l[c[p]] || new m(c[p], [])).gsClass ? (f[p] = j.gsClass, q--) : i && j.sc.push(this);
                    if (0 === q && d) for (k = ("com.greensock." + b).split("."), n = k.pop(), o = h(k.join("."))[n] = this.gsClass = d.apply(d, f), e && (g[n] = o, "function" == typeof define && define.amd ? define((a.GreenSockAMDPath ? a.GreenSockAMDPath + "/": "") + b.split(".").join("/"), [],
                        function() {
                            return o
                        }) : "undefined" != typeof module && module.exports && (module.exports = o)), p = 0; this.sc.length > p; p++) this.sc[p].check()
                },
                    this.check(!0)
            },
            n = a._gsDefine = function(a, b, c, d) {
                return new m(a, b, c, d)
            },
            o = i._class = function(a, b, c) {
                return b = b ||
                    function() {},
                    n(a, [],
                        function() {
                            return b
                        },
                        c),
                    b
            };
        n.globals = g;
        var p = [0, 0, 1, 1],
            q = [],
            r = o("easing.Ease",
                function(a, b, c, d) {
                    this._func = a,
                        this._type = c || 0,
                        this._power = d || 0,
                        this._params = b ? p.concat(b) : p
                },
                !0),
            s = r.map = {},
            t = r.register = function(a, b, c, d) {
                for (var e, f, g, h, j = b.split(","), k = j.length, l = (c || "easeIn,easeOut,easeInOut").split(","); --k > -1;) for (f = j[k], e = d ? o("easing." + f, null, !0) : i.easing[f] || {},
                                                                                                                                           g = l.length; --g > -1;) h = l[g],
                    s[f + "." + h] = s[h + f] = e[h] = a.getRatio ? a: a[h] || new a
            };
        for (d = r.prototype, d._calcEnd = !1, d.getRatio = function(a) {
            if (this._func) return this._params[0] = a,
                this._func.apply(null, this._params);
            var b = this._type,
                c = this._power,
                d = 1 === b ? 1 - a: 2 === b ? a: .5 > a ? 2 * a: 2 * (1 - a);
            return 1 === c ? d *= d: 2 === c ? d *= d * d: 3 === c ? d *= d * d * d: 4 === c && (d *= d * d * d * d),
                1 === b ? 1 - d: 2 === b ? d: .5 > a ? d / 2 : 1 - d / 2
        },
                 b = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], c = b.length; --c > -1;) d = b[c] + ",Power" + c,
            t(new r(null, null, 1, c), d, "easeOut", !0),
            t(new r(null, null, 2, c), d, "easeIn" + (0 === c ? ",easeNone": "")),
            t(new r(null, null, 3, c), d, "easeInOut");
        s.linear = i.easing.Linear.easeIn,
            s.swing = i.easing.Quad.easeInOut;
        var u = o("events.EventDispatcher",
            function(a) {
                this._listeners = {},
                    this._eventTarget = a || this
            });
        d = u.prototype,
            d.addEventListener = function(a, b, c, d, g) {
                g = g || 0;
                var h, i, j = this._listeners[a],
                    k = 0;
                for (null == j && (this._listeners[a] = j = []), i = j.length; --i > -1;) h = j[i],
                    h.c === b && h.s === c ? j.splice(i, 1) : 0 === k && g > h.pr && (k = i + 1);
                j.splice(k, 0, {
                    c: b,
                    s: c,
                    up: d,
                    pr: g
                }),
                this !== e || f || e.wake()
            },
            d.removeEventListener = function(a, b) {
                var c, d = this._listeners[a];
                if (d) for (c = d.length; --c > -1;) if (d[c].c === b) return d.splice(c, 1),
                    void 0
            },
            d.dispatchEvent = function(a) {
                var b, c, d, e = this._listeners[a];
                if (e) for (b = e.length, c = this._eventTarget; --b > -1;) d = e[b],
                    d.up ? d.c.call(d.s || c, {
                        type: a,
                        target: c
                    }) : d.c.call(d.s || c)
            };
        var v = a.requestAnimationFrame,
            w = a.cancelAnimationFrame,
            x = Date.now ||
                function() {
                    return (new Date).getTime()
                },
            y = x();
        for (b = ["ms", "moz", "webkit", "o"], c = b.length; --c > -1 && !v;) v = a[b[c] + "RequestAnimationFrame"],
            w = a[b[c] + "CancelAnimationFrame"] || a[b[c] + "CancelRequestAnimationFrame"];
        o("Ticker",
            function(a, b) {
                var c, d, g, h, i, j = this,
                    l = x(),
                    m = b !== !1 && v,
                    n = function(a) {
                        y = x(),
                            j.time = (y - l) / 1e3;
                        var b, e = j.time - i; (!c || e > 0 || a === !0) && (j.frame++, i += e + (e >= h ? .004 : h - e), b = !0),
                        a !== !0 && (g = d(n)),
                        b && j.dispatchEvent("tick")
                    };
                u.call(j),
                    this.time = this.frame = 0,
                    this.tick = function() {
                        n(!0)
                    },
                    this.sleep = function() {
                        null != g && (m && w ? w(g) : clearTimeout(g), d = k, g = null, j === e && (f = !1))
                    },
                    this.wake = function() {
                        null !== g && j.sleep(),
                            d = 0 === c ? k: m && v ? v: function(a) {
                                return setTimeout(a, 0 | 1e3 * (i - j.time) + 1)
                            },
                        j === e && (f = !0),
                            n(2)
                    },
                    this.fps = function(a) {
                        return arguments.length ? (c = a, h = 1 / (c || 60), i = this.time + h, j.wake(), void 0) : c
                    },
                    this.useRAF = function(a) {
                        return arguments.length ? (j.sleep(), m = a, j.fps(c), void 0) : m
                    },
                    j.fps(a),
                    setTimeout(function() {
                            m && (!g || 5 > j.frame) && j.useRAF(!1)
                        },
                        1500)
            }),
            d = i.Ticker.prototype = new i.events.EventDispatcher,
            d.constructor = i.Ticker;
        var z = o("core.Animation",
            function(a, b) {
                if (this.vars = b = b || {},
                        this._duration = this._totalDuration = a || 0, this._delay = Number(b.delay) || 0, this._timeScale = 1, this._active = b.immediateRender === !0, this.data = b.data, this._reversed = b.reversed === !0, M) {
                    f || e.wake();
                    var c = this.vars.useFrames ? L: M;
                    c.add(this, c._time),
                    this.vars.paused && this.paused(!0)
                }
            });
        e = z.ticker = new i.Ticker,
            d = z.prototype,
            d._dirty = d._gc = d._initted = d._paused = !1,
            d._totalTime = d._time = 0,
            d._rawPrevTime = -1,
            d._next = d._last = d._onUpdate = d._timeline = d.timeline = null,
            d._paused = !1;
        var A = function() {
            x() - y > 2e3 && e.wake(),
                setTimeout(A, 2e3)
        };
        A(),
            d.play = function(a, b) {
                return arguments.length && this.seek(a, b),
                    this.reversed(!1).paused(!1)
            },
            d.pause = function(a, b) {
                return arguments.length && this.seek(a, b),
                    this.paused(!0)
            },
            d.resume = function(a, b) {
                return arguments.length && this.seek(a, b),
                    this.paused(!1)
            },
            d.seek = function(a, b) {
                return this.totalTime(Number(a), b !== !1)
            },
            d.restart = function(a, b) {
                return this.reversed(!1).paused(!1).totalTime(a ? -this._delay: 0, b !== !1, !0)
            },
            d.reverse = function(a, b) {
                return arguments.length && this.seek(a || this.totalDuration(), b),
                    this.reversed(!0).paused(!1)
            },
            d.render = function() {},
            d.invalidate = function() {
                return this
            },
            d._enabled = function(a, b) {
                return f || e.wake(),
                    this._gc = !a,
                    this._active = a && !this._paused && this._totalTime > 0 && this._totalTime < this._totalDuration,
                b !== !0 && (a && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)),
                    !1
            },
            d._kill = function() {
                return this._enabled(!1, !1)
            },
            d.kill = function(a, b) {
                return this._kill(a, b),
                    this
            },
            d._uncache = function(a) {
                for (var b = a ? this: this.timeline; b;) b._dirty = !0,
                    b = b.timeline;
                return this
            },
            d._swapSelfInParams = function(a) {
                for (var b = a.length,
                         c = a.concat(); --b > -1;)"{self}" === a[b] && (c[b] = this);
                return c
            },
            d.eventCallback = function(a, b, c, d) {
                if ("on" === (a || "").substr(0, 2)) {
                    var e = this.vars;
                    if (1 === arguments.length) return e[a];
                    null == b ? delete e[a] : (e[a] = b, e[a + "Params"] = c instanceof Array && -1 !== c.join("").indexOf("{self}") ? this._swapSelfInParams(c) : c, e[a + "Scope"] = d),
                    "onUpdate" === a && (this._onUpdate = b)
                }
                return this
            },
            d.delay = function(a) {
                return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), this._delay = a, this) : this._delay
            },
            d.duration = function(a) {
                return arguments.length ? (this._duration = this._totalDuration = a, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== a && this.totalTime(this._totalTime * (a / this._duration), !0), this) : (this._dirty = !1, this._duration)
            },
            d.totalDuration = function(a) {
                return this._dirty = !1,
                    arguments.length ? this.duration(a) : this._totalDuration
            },
            d.time = function(a, b) {
                return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(a > this._duration ? this._duration: a, b)) : this._time
            },
            d.totalTime = function(a, b, c) {
                if (f || e.wake(), !arguments.length) return this._totalTime;
                if (this._timeline) {
                    if (0 > a && !c && (a += this.totalDuration()), this._timeline.smoothChildTiming) {
                        this._dirty && this.totalDuration();
                        var d = this._totalDuration,
                            g = this._timeline;
                        if (a > d && !c && (a = d), this._startTime = (this._paused ? this._pauseTime: g._time) - (this._reversed ? d - a: a) / this._timeScale, g._dirty || this._uncache(!1), g._timeline) for (; g._timeline;) g._timeline._time !== (g._startTime + g._totalTime) / g._timeScale && g.totalTime(g._totalTime, !0),
                            g = g._timeline
                    }
                    this._gc && this._enabled(!0, !1),
                    this._totalTime !== a && this.render(a, b, !1)
                }
                return this
            },
            d.startTime = function(a) {
                return arguments.length ? (a !== this._startTime && (this._startTime = a, this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime
            },
            d.timeScale = function(a) {
                if (!arguments.length) return this._timeScale;
                if (a = a || 1e-6, this._timeline && this._timeline.smoothChildTiming) {
                    var b = this._pauseTime,
                        c = b || 0 === b ? b: this._timeline.totalTime();
                    this._startTime = c - (c - this._startTime) * this._timeScale / a
                }
                return this._timeScale = a,
                    this._uncache(!1)
            },
            d.reversed = function(a) {
                return arguments.length ? (a != this._reversed && (this._reversed = a, this.totalTime(this._totalTime, !0)), this) : this._reversed
            },
            d.paused = function(a) {
                if (!arguments.length) return this._paused;
                if (a != this._paused && this._timeline) {
                    f || a || e.wake();
                    var b = this._timeline,
                        c = b.rawTime(),
                        d = c - this._pauseTime; ! a && b.smoothChildTiming && (this._startTime += d, this._uncache(!1)),
                        this._pauseTime = a ? c: null,
                        this._paused = a,
                        this._active = !a && this._totalTime > 0 && this._totalTime < this._totalDuration,
                    a || 0 === d || 0 === this._duration || this.render(b.smoothChildTiming ? this._totalTime: (c - this._startTime) / this._timeScale, !0, !0)
                }
                return this._gc && !a && this._enabled(!0, !1),
                    this
            };
        var B = o("core.SimpleTimeline",
            function(a) {
                z.call(this, 0, a),
                    this.autoRemoveChildren = this.smoothChildTiming = !0
            });
        d = B.prototype = new z,
            d.constructor = B,
            d.kill()._gc = !1,
            d._first = d._last = null,
            d._sortChildren = !1,
            d.add = d.insert = function(a, b) {
                var c, d;
                if (a._startTime = Number(b || 0) + a._delay, a._paused && this !== a._timeline && (a._pauseTime = a._startTime + (this.rawTime() - a._startTime) / a._timeScale), a.timeline && a.timeline._remove(a, !0), a.timeline = a._timeline = this, a._gc && a._enabled(!0, !0), c = this._last, this._sortChildren) for (d = a._startTime; c && c._startTime > d;) c = c._prev;
                return c ? (a._next = c._next, c._next = a) : (a._next = this._first, this._first = a),
                    a._next ? a._next._prev = a: this._last = a,
                    a._prev = c,
                this._timeline && this._uncache(!0),
                    this
            },
            d._remove = function(a, b) {
                return a.timeline === this && (b || a._enabled(!1, !0), a.timeline = null, a._prev ? a._prev._next = a._next: this._first === a && (this._first = a._next), a._next ? a._next._prev = a._prev: this._last === a && (this._last = a._prev), this._timeline && this._uncache(!0)),
                    this
            },
            d.render = function(a, b, c) {
                var d, e = this._first;
                for (this._totalTime = this._time = this._rawPrevTime = a; e;) d = e._next,
                (e._active || a >= e._startTime && !e._paused) && (e._reversed ? e.render((e._dirty ? e.totalDuration() : e._totalDuration) - (a - e._startTime) * e._timeScale, b, c) : e.render((a - e._startTime) * e._timeScale, b, c)),
                    e = d
            },
            d.rawTime = function() {
                return f || e.wake(),
                    this._totalTime
            };
        var C = o("TweenLite",
            function(b, c, d) {
                if (z.call(this, c, d), this.render = C.prototype.render, null == b) throw "Cannot tween a null target.";
                this.target = b = "string" != typeof b ? b: C.selector(b) || b;
                var e, f, g, h = b.jquery || b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType),
                    i = this.vars.overwrite;
                if (this._overwrite = i = null == i ? K[C.defaultOverwrite] : "number" == typeof i ? i >> 0 : K[i], (h || b instanceof Array) && "number" != typeof b[0]) for (this._targets = g = j.call(b, 0), this._propLookup = [], this._siblings = [], e = 0; g.length > e; e++) f = g[e],
                    f ? "string" != typeof f ? f.length && f !== a && f[0] && (f[0] === a || f[0].nodeType && f[0].style && !f.nodeType) ? (g.splice(e--, 1), this._targets = g = g.concat(j.call(f, 0))) : (this._siblings[e] = N(f, this, !1), 1 === i && this._siblings[e].length > 1 && O(f, this, null, 1, this._siblings[e])) : (f = g[e--] = C.selector(f), "string" == typeof f && g.splice(e + 1, 1)) : g.splice(e--, 1);
                else this._propLookup = {},
                    this._siblings = N(b, this, !1),
                1 === i && this._siblings.length > 1 && O(b, this, null, 1, this._siblings); (this.vars.immediateRender || 0 === c && 0 === this._delay && this.vars.immediateRender !== !1) && this.render( - this._delay, !1, !0)
            },
            !0),
            D = function(b) {
                return b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType)
            },
            E = function(a, b) {
                var c, d = {};
                for (c in a) J[c] || c in b && "x" !== c && "y" !== c && "width" !== c && "height" !== c && "className" !== c && "border" !== c || !(!G[c] || G[c] && G[c]._autoCSS) || (d[c] = a[c], delete a[c]);
                a.css = d
            };
        d = C.prototype = new z,
            d.constructor = C,
            d.kill()._gc = !1,
            d.ratio = 0,
            d._firstPT = d._targets = d._overwrittenProps = d._startAt = null,
            d._notifyPluginsOfEnabled = !1,
            C.version = "1.10.2",
            C.defaultEase = d._ease = new r(null, null, 1, 1),
            C.defaultOverwrite = "auto",
            C.ticker = e,
            C.autoSleep = !0,
            C.selector = a.$ || a.jQuery ||
                function(b) {
                    return a.$ ? (C.selector = a.$, a.$(b)) : a.document ? a.document.getElementById("#" === b.charAt(0) ? b.substr(1) : b) : b
                };
        var F = C._internals = {},
            G = C._plugins = {},
            H = C._tweenLookup = {},
            I = 0,
            J = F.reservedProps = {
                ease: 1,
                delay: 1,
                overwrite: 1,
                onComplete: 1,
                onCompleteParams: 1,
                onCompleteScope: 1,
                useFrames: 1,
                runBackwards: 1,
                startAt: 1,
                onUpdate: 1,
                onUpdateParams: 1,
                onUpdateScope: 1,
                onStart: 1,
                onStartParams: 1,
                onStartScope: 1,
                onReverseComplete: 1,
                onReverseCompleteParams: 1,
                onReverseCompleteScope: 1,
                onRepeat: 1,
                onRepeatParams: 1,
                onRepeatScope: 1,
                easeParams: 1,
                yoyo: 1,
                immediateRender: 1,
                repeat: 1,
                repeatDelay: 1,
                data: 1,
                paused: 1,
                reversed: 1,
                autoCSS: 1
            },
            K = {
                none: 0,
                all: 1,
                auto: 2,
                concurrent: 3,
                allOnStart: 4,
                preexisting: 5,
                "true": 1,
                "false": 0
            },
            L = z._rootFramesTimeline = new B,
            M = z._rootTimeline = new B;
        M._startTime = e.time,
            L._startTime = e.frame,
            M._active = L._active = !0,
            z._updateRoot = function() {
                if (M.render((e.time - M._startTime) * M._timeScale, !1, !1), L.render((e.frame - L._startTime) * L._timeScale, !1, !1), !(e.frame % 120)) {
                    var a, b, c;
                    for (c in H) {
                        for (b = H[c].tweens, a = b.length; --a > -1;) b[a]._gc && b.splice(a, 1);
                        0 === b.length && delete H[c]
                    }
                    if (c = M._first, (!c || c._paused) && C.autoSleep && !L._first && 1 === e._listeners.tick.length) {
                        for (; c && c._paused;) c = c._next;
                        c || e.sleep()
                    }
                }
            },
            e.addEventListener("tick", z._updateRoot);
        var N = function(a, b, c) {
                var d, e, f = a._gsTweenID;
                if (H[f || (a._gsTweenID = f = "t" + I++)] || (H[f] = {
                        target: a,
                        tweens: []
                    }), b && (d = H[f].tweens, d[e = d.length] = b, c)) for (; --e > -1;) d[e] === b && d.splice(e, 1);
                return H[f].tweens
            },
            O = function(a, b, c, d, e) {
                var f, g, h, i;
                if (1 === d || d >= 4) {
                    for (i = e.length, f = 0; i > f; f++) if ((h = e[f]) !== b) h._gc || h._enabled(!1, !1) && (g = !0);
                    else if (5 === d) break;
                    return g
                }
                var j, k = b._startTime + 1e-10,
                    l = [],
                    m = 0,
                    n = 0 === b._duration;
                for (f = e.length; --f > -1;)(h = e[f]) === b || h._gc || h._paused || (h._timeline !== b._timeline ? (j = j || P(b, 0, n), 0 === P(h, j, n) && (l[m++] = h)) : k >= h._startTime && h._startTime + h.totalDuration() / h._timeScale + 1e-10 > k && ((n || !h._initted) && 2e-10 >= k - h._startTime || (l[m++] = h)));
                for (f = m; --f > -1;) h = l[f],
                2 === d && h._kill(c, a) && (g = !0),
                (2 !== d || !h._firstPT && h._initted) && h._enabled(!1, !1) && (g = !0);
                return g
            },
            P = function(a, b, c) {
                for (var d = a._timeline,
                         e = d._timeScale,
                         f = a._startTime,
                         g = 1e-10; d._timeline;) {
                    if (f += d._startTime, e *= d._timeScale, d._paused) return - 100;
                    d = d._timeline
                }
                return f /= e,
                    f > b ? f - b: c && f === b || !a._initted && 2 * g > f - b ? g: (f += a.totalDuration() / a._timeScale / e) > b + g ? 0 : f - b - g
            };
        d._init = function() {
            var a, b, c, d, e = this.vars,
                f = this._overwrittenProps,
                g = this._duration,
                h = e.immediateRender,
                i = e.ease;
            if (e.startAt) {
                if (this._startAt && this._startAt.render( - 1, !0), e.startAt.overwrite = 0, e.startAt.immediateRender = !0, this._startAt = C.to(this.target, 0, e.startAt), h) if (this._time > 0) this._startAt = null;
                else if (0 !== g) return
            } else if (e.runBackwards && e.immediateRender && 0 !== g) if (this._startAt) this._startAt.render( - 1, !0),
                this._startAt = null;
            else if (0 === this._time) {
                c = {};
                for (d in e) J[d] && "autoCSS" !== d || (c[d] = e[d]);
                return c.overwrite = 0,
                    this._startAt = C.to(this.target, 0, c),
                    void 0
            }
            if (this._ease = i ? i instanceof r ? e.easeParams instanceof Array ? i.config.apply(i, e.easeParams) : i: "function" == typeof i ? new r(i, e.easeParams) : s[i] || C.defaultEase: C.defaultEase, this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets) for (a = this._targets.length; --a > -1;) this._initProps(this._targets[a], this._propLookup[a] = {},
                this._siblings[a], f ? f[a] : null) && (b = !0);
            else b = this._initProps(this.target, this._propLookup, this._siblings, f);
            if (b && C._onPluginEvent("_onInitAllProps", this), f && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), e.runBackwards) for (c = this._firstPT; c;) c.s += c.c,
                c.c = -c.c,
                c = c._next;
            this._onUpdate = e.onUpdate,
                this._initted = !0
        },
            d._initProps = function(b, c, d, e) {
                var f, g, h, i, j, k;
                if (null == b) return ! 1;
                this.vars.css || b.style && b !== a && b.nodeType && G.css && this.vars.autoCSS !== !1 && E(this.vars, b);
                for (f in this.vars) {
                    if (k = this.vars[f], J[f]) k instanceof Array && -1 !== k.join("").indexOf("{self}") && (this.vars[f] = k = this._swapSelfInParams(k, this));
                    else if (G[f] && (i = new G[f])._onInitTween(b, this.vars[f], this)) {
                        for (this._firstPT = j = {
                            _next: this._firstPT,
                            t: i,
                            p: "setRatio",
                            s: 0,
                            c: 1,
                            f: !0,
                            n: f,
                            pg: !0,
                            pr: i._priority
                        },
                                 g = i._overwriteProps.length; --g > -1;) c[i._overwriteProps[g]] = this._firstPT; (i._priority || i._onInitAllProps) && (h = !0),
                        (i._onDisable || i._onEnable) && (this._notifyPluginsOfEnabled = !0)
                    } else this._firstPT = c[f] = j = {
                        _next: this._firstPT,
                        t: b,
                        p: f,
                        f: "function" == typeof b[f],
                        n: f,
                        pg: !1,
                        pr: 0
                    },
                        j.s = j.f ? b[f.indexOf("set") || "function" != typeof b["get" + f.substr(3)] ? f: "get" + f.substr(3)]() : parseFloat(b[f]),
                        j.c = "string" == typeof k && "=" === k.charAt(1) ? parseInt(k.charAt(0) + "1", 10) * Number(k.substr(2)) : Number(k) - j.s || 0;
                    j && j._next && (j._next._prev = j)
                }
                return e && this._kill(e, b) ? this._initProps(b, c, d, e) : this._overwrite > 1 && this._firstPT && d.length > 1 && O(b, this, c, this._overwrite, d) ? (this._kill(c, b), this._initProps(b, c, d, e)) : h
            },
            d.render = function(a, b, c) {
                var d, e, f, g = this._time;
                if (a >= this._duration) this._totalTime = this._time = this._duration,
                    this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1,
                this._reversed || (d = !0, e = "onComplete"),
                0 === this._duration && ((0 === a || 0 > this._rawPrevTime) && this._rawPrevTime !== a && (c = !0, this._rawPrevTime > 0 && (e = "onReverseComplete", b && (a = -1))), this._rawPrevTime = a);
                else if (1e-7 > a) this._totalTime = this._time = 0,
                    this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0,
                (0 !== g || 0 === this._duration && this._rawPrevTime > 0) && (e = "onReverseComplete", d = this._reversed),
                    0 > a ? (this._active = !1, 0 === this._duration && (this._rawPrevTime >= 0 && (c = !0), this._rawPrevTime = a)) : this._initted || (c = !0);
                else if (this._totalTime = this._time = a, this._easeType) {
                    var h = a / this._duration,
                        i = this._easeType,
                        j = this._easePower; (1 === i || 3 === i && h >= .5) && (h = 1 - h),
                    3 === i && (h *= 2),
                        1 === j ? h *= h: 2 === j ? h *= h * h: 3 === j ? h *= h * h * h: 4 === j && (h *= h * h * h * h),
                        this.ratio = 1 === i ? 1 - h: 2 === i ? h: .5 > a / this._duration ? h / 2 : 1 - h / 2
                } else this.ratio = this._ease.getRatio(a / this._duration);
                if (this._time !== g || c) {
                    if (!this._initted) {
                        if (this._init(), !this._initted) return;
                        this._time && !d ? this.ratio = this._ease.getRatio(this._time / this._duration) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                    }
                    for (this._active || !this._paused && this._time !== g && a >= 0 && (this._active = !0), 0 === g && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === this._duration) && (b || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || q))), f = this._firstPT; f;) f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s,
                        f = f._next;
                    this._onUpdate && (0 > a && this._startAt && this._startAt.render(a, b, c), b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || q)),
                    e && (this._gc || (0 > a && this._startAt && !this._onUpdate && this._startAt.render(a, b, c), d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[e] && this.vars[e].apply(this.vars[e + "Scope"] || this, this.vars[e + "Params"] || q)))
                }
            },
            d._kill = function(a, b) {
                if ("all" === a && (a = null), null == a && (null == b || b === this.target)) return this._enabled(!1, !1);
                b = "string" != typeof b ? b || this._targets || this.target: C.selector(b) || b;
                var c, d, e, f, g, h, i, j;
                if ((b instanceof Array || D(b)) && "number" != typeof b[0]) for (c = b.length; --c > -1;) this._kill(a, b[c]) && (h = !0);
                else {
                    if (this._targets) {
                        for (c = this._targets.length; --c > -1;) if (b === this._targets[c]) {
                            g = this._propLookup[c] || {},
                                this._overwrittenProps = this._overwrittenProps || [],
                                d = this._overwrittenProps[c] = a ? this._overwrittenProps[c] || {}: "all";
                            break
                        }
                    } else {
                        if (b !== this.target) return ! 1;
                        g = this._propLookup,
                            d = this._overwrittenProps = a ? this._overwrittenProps || {}: "all"
                    }
                    if (g) {
                        i = a || g,
                            j = a !== d && "all" !== d && a !== g && (null == a || a._tempKill !== !0);
                        for (e in i)(f = g[e]) && (f.pg && f.t._kill(i) && (h = !0), f.pg && 0 !== f.t._overwriteProps.length || (f._prev ? f._prev._next = f._next: f === this._firstPT && (this._firstPT = f._next), f._next && (f._next._prev = f._prev), f._next = f._prev = null), delete g[e]),
                        j && (d[e] = 1); ! this._firstPT && this._initted && this._enabled(!1, !1)
                    }
                }
                return h
            },
            d.invalidate = function() {
                return this._notifyPluginsOfEnabled && C._onPluginEvent("_onDisable", this),
                    this._firstPT = null,
                    this._overwrittenProps = null,
                    this._onUpdate = null,
                    this._startAt = null,
                    this._initted = this._active = this._notifyPluginsOfEnabled = !1,
                    this._propLookup = this._targets ? {}: [],
                    this
            },
            d._enabled = function(a, b) {
                if (f || e.wake(), a && this._gc) {
                    var c, d = this._targets;
                    if (d) for (c = d.length; --c > -1;) this._siblings[c] = N(d[c], this, !0);
                    else this._siblings = N(this.target, this, !0)
                }
                return z.prototype._enabled.call(this, a, b),
                    this._notifyPluginsOfEnabled && this._firstPT ? C._onPluginEvent(a ? "_onEnable": "_onDisable", this) : !1
            },
            C.to = function(a, b, c) {
                return new C(a, b, c)
            },
            C.from = function(a, b, c) {
                return c.runBackwards = !0,
                    c.immediateRender = 0 != c.immediateRender,
                    new C(a, b, c)
            },
            C.fromTo = function(a, b, c, d) {
                return d.startAt = c,
                    d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender,
                    new C(a, b, d)
            },
            C.delayedCall = function(a, b, c, d, e) {
                return new C(b, 0, {
                    delay: a,
                    onComplete: b,
                    onCompleteParams: c,
                    onCompleteScope: d,
                    onReverseComplete: b,
                    onReverseCompleteParams: c,
                    onReverseCompleteScope: d,
                    immediateRender: !1,
                    useFrames: e,
                    overwrite: 0
                })
            },
            C.set = function(a, b) {
                return new C(a, 0, b)
            },
            C.killTweensOf = C.killDelayedCallsTo = function(a, b) {
                for (var c = C.getTweensOf(a), d = c.length; --d > -1;) c[d]._kill(b, a)
            },
            C.getTweensOf = function(a) {
                if (null == a) return [];
                a = "string" != typeof a ? a: C.selector(a) || a;
                var b, c, d, e;
                if ((a instanceof Array || D(a)) && "number" != typeof a[0]) {
                    for (b = a.length, c = []; --b > -1;) c = c.concat(C.getTweensOf(a[b]));
                    for (b = c.length; --b > -1;) for (e = c[b], d = b; --d > -1;) e === c[d] && c.splice(b, 1)
                } else for (c = N(a).concat(), b = c.length; --b > -1;) c[b]._gc && c.splice(b, 1);
                return c
            };
        var Q = o("plugins.TweenPlugin",
            function(a, b) {
                this._overwriteProps = (a || "").split(","),
                    this._propName = this._overwriteProps[0],
                    this._priority = b || 0,
                    this._super = Q.prototype
            },
            !0);
        if (d = Q.prototype, Q.version = "1.10.1", Q.API = 2, d._firstPT = null, d._addTween = function(a, b, c, d, e, f) {
                var g, h;
                return null != d && (g = "number" == typeof d || "=" !== d.charAt(1) ? Number(d) - c: parseInt(d.charAt(0) + "1", 10) * Number(d.substr(2))) ? (this._firstPT = h = {
                    _next: this._firstPT,
                    t: a,
                    p: b,
                    s: c,
                    c: g,
                    f: "function" == typeof a[b],
                    n: e || b,
                    r: f
                },
                h._next && (h._next._prev = h), h) : void 0
            },
                d.setRatio = function(a) {
                    for (var b, c = this._firstPT,
                             d = 1e-6; c;) b = c.c * a + c.s,
                        c.r ? b = 0 | b + (b > 0 ? .5 : -.5) : d > b && b > -d && (b = 0),
                        c.f ? c.t[c.p](b) : c.t[c.p] = b,
                        c = c._next
                },
                d._kill = function(a) {
                    var b, c = this._overwriteProps,
                        d = this._firstPT;
                    if (null != a[this._propName]) this._overwriteProps = [];
                    else for (b = c.length; --b > -1;) null != a[c[b]] && c.splice(b, 1);
                    for (; d;) null != a[d.n] && (d._next && (d._next._prev = d._prev), d._prev ? (d._prev._next = d._next, d._prev = null) : this._firstPT === d && (this._firstPT = d._next)),
                        d = d._next;
                    return ! 1
                },
                d._roundProps = function(a, b) {
                    for (var c = this._firstPT; c;)(a[this._propName] || null != c.n && a[c.n.split(this._propName + "_").join("")]) && (c.r = b),
                        c = c._next
                },
                C._onPluginEvent = function(a, b) {
                    var c, d, e, f, g, h = b._firstPT;
                    if ("_onInitAllProps" === a) {
                        for (; h;) {
                            for (g = h._next, d = e; d && d.pr > h.pr;) d = d._next; (h._prev = d ? d._prev: f) ? h._prev._next = h: e = h,
                                (h._next = d) ? d._prev = h: f = h,
                                h = g
                        }
                        h = b._firstPT = e
                    }
                    for (; h;) h.pg && "function" == typeof h.t[a] && h.t[a]() && (c = !0),
                        h = h._next;
                    return c
                },
                Q.activate = function(a) {
                    for (var b = a.length; --b > -1;) a[b].API === Q.API && (G[(new a[b])._propName] = a[b]);
                    return ! 0
                },
                n.plugin = function(a) {
                    if (! (a && a.propName && a.init && a.API)) throw "illegal plugin definition.";
                    var b, c = a.propName,
                        d = a.priority || 0,
                        e = a.overwriteProps,
                        f = {
                            init: "_onInitTween",
                            set: "setRatio",
                            kill: "_kill",
                            round: "_roundProps",
                            initAll: "_onInitAllProps"
                        },
                        g = o("plugins." + c.charAt(0).toUpperCase() + c.substr(1) + "Plugin",
                            function() {
                                Q.call(this, c, d),
                                    this._overwriteProps = e || []
                            },
                            a.global === !0),
                        h = g.prototype = new Q(c);
                    h.constructor = g,
                        g.API = a.API;
                    for (b in f)"function" == typeof a[b] && (h[f[b]] = a[b]);
                    return g.version = a.version,
                        Q.activate([g]),
                        g
                },
                b = a._gsQueue) {
            for (c = 0; b.length > c; c++) b[c]();
            for (d in l) l[d].func || a.console.log("GSAP encountered missing dependency: com.greensock." + d)
        }
        f = !1
    } (window);
var Utils; !
    function(a) {
        var b = function() {
            function a(a, b, c, d, e, f) {
                "undefined" == typeof f && (f = !0),
                    this.oAssetData = {},
                    this.assetsLoaded = 0,
                    this.totalAssets = b.length,
                    this.ctx = c,
                    this.canvasWidth = d,
                    this.canvasHeight = e,
                    this.topLeftX = this.canvasWidth / 2 - d / 4,
                    this.topLeftY = this.canvasHeight / 2;
                for (var g = 0; g < b.length; g++) this.loadImage(b[g])
            }
            return a.prototype.loadImage = function(a) {
                var b = this,
                    c = new Image;
                c.onload = function() {
                    b.oAssetData[a.id] = {},
                        b.oAssetData[a.id].img = c,
                    void 0 != a.oData && (b.oAssetData[a.id].oData = a.oData),
                        ++b.assetsLoaded,
                        b.checkLoadComplete()
                },
                    c.src = a.file
            },
                a.prototype.checkLoadComplete = function() {
                    this.assetsLoaded == this.totalAssets && this.loadedCallback()
                },
                a.prototype.onReady = function(a) {
                    this.loadedCallback = a
                },
                a.prototype.getImg = function(a) {
                    return this.oAssetData[a].img
                },
                a.prototype.getData = function(a) {
                    return this.oAssetData[a]
                },
                a
        } ();
        a.AssetLoader = b
    } (Utils || (Utils = {}));
var Utils; !
    function(a) {
        var b = function() {
            function a(a, b, c, d) {
                this.x = 0,
                    this.y = 0,
                    this.rotation = 0,
                    this.radius = 10,
                    this.removeMe = !1,
                    this.frameInc = 0,
                    this.animType = "loop",
                    this.offsetX = 0,
                    this.offsetY = 0,
                    this.scaleX = 1,
                    this.scaleY = 1,
                    this.oImgData = a,
                    this.oAnims = this.oImgData.oData.oAnims,
                    this.fps = b,
                    this.radius = c,
                    this.animId = d
            }
            return a.prototype.changeSpriteSheet = function(a) {
                this.oImgData = a,
                    this.oAnims = this.oImgData.oData.oAnims,
                    this.resetAnim()
            },
                a.prototype.updateAnimation = function(a) {
                    this.frameInc += this.fps * a
                },
                a.prototype.resetAnim = function() {
                    this.frameInc = 0
                },
                a.prototype.setFrame = function(a) {
                    this.fixedFrame = a
                },
                a.prototype.setAnimType = function(a, b, c) {
                    switch ("undefined" == typeof c && (c = !0), this.animId = b, this.animType = a, c && this.resetAnim(), a) {
                        case "loop":
                            break;
                        case "once":
                            this.maxIdx = this.oAnims[this.animId].length - 1
                    }
                },
                a.prototype.render = function(a) {
                    if (null != this.animId) {
                        var b = this.oAnims[this.animId].length,
                            c = Math.floor(this.frameInc),
                            d = this.oAnims[this.animId][c % b],
                            e = d * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                            f = Math.floor(d / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                        if ("once" == this.animType && c > this.maxIdx) {
                            this.fixedFrame = this.oAnims[this.animId][b - 1],
                                this.animId = null,
                                this.animEndedFunc();
                            var e = this.fixedFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                                f = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight
                        }
                    } else var e = this.fixedFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                        f = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    a.drawImage(this.oImgData.img, e, f, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight)
                },
                a
        } ();
        a.AnimSprite = b
    } (Utils || (Utils = {}));
var Utils; !
    function(a) {
        var b = function() {
            function a(a, b) {
                this.x = 0,
                    this.y = 0,
                    this.rotation = 0,
                    this.radius = 10,
                    this.removeMe = !1,
                    this.offsetX = 0,
                    this.offsetY = 0,
                    this.scaleX = 1,
                    this.scaleY = 1,
                    this.oImgData = a,
                    this.radius = b
            }
            return a.prototype.setFrame = function(a) {
                this.frameNum = a
            },
                a.prototype.render = function(a) {
                    var b = this.frameNum * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                        c = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    a.drawImage(this.oImgData.img, b, c, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight)
                },
                a
        } ();
        a.BasicSprite = b
    } (Utils || (Utils = {}));
var Utils; !
    function(a) {
        var b = function() {
            function a(a, b) {
                var c = this;
                this.canvasX = 0,
                    this.canvasY = 0,
                    this.canvasScaleX = 1,
                    this.canvasScaleY = 1,
                    this.prevHitTime = 0,
                    this.pauseIsOn = !1,
                    this.isDown = !1,
                    this.isDetectingKeys = !1,
                    this.isBugBrowser = b,
                    a.addEventListener("touchstart",
                        function(a) {
                            for (var b = 0; b < a.changedTouches.length; b++) c.hitDown(a, a.changedTouches[0].pageX, a.changedTouches[0].pageY, a.changedTouches[0].identifier)
                        },
                        !1),
                    a.addEventListener("touchend",
                        function(a) {
                            for (var b = 0; b < a.changedTouches.length; b++) c.hitUp(a, a.changedTouches[0].pageX, a.changedTouches[0].pageY, a.changedTouches[0].identifier)
                        },
                        !1),
                    a.addEventListener("touchleave",
                        function(a) {
                            for (var b = 0; b < a.changedTouches.length; b++) c.leave(a, a.changedTouches[0].pageX, a.changedTouches[0].pageY, a.changedTouches[0].identifier)
                        },
                        !1),
                    a.addEventListener("touchmove",
                        function(a) {
                            for (var b = 0; b < c.aHitAreas.length; b++) c.move(a, a.changedTouches[0].pageX, a.changedTouches[0].pageY, a.changedTouches[0].identifier, !0)
                        },
                        !1),
                    a.addEventListener("mousedown",
                        function(a) {
                            c.isDown = !0,
                                c.hitDown(a, a.pageX, a.pageY, 1)
                        },
                        !1),
                    a.addEventListener("mouseup",
                        function(a) {
                            c.isDown = !1,
                                c.hitUp(a, a.pageX, a.pageY, 1)
                        },
                        !1),
                    a.addEventListener("mouseleave",
                        function(a) {
                            c.leave(a, a.pageX, a.pageY, 1)
                        },
                        !1),
                    a.addEventListener("mousemove",
                        function(a) {
                            c.move(a, a.pageX, a.pageY, 1, c.isDown)
                        },
                        !1),
                    this.aHitAreas = new Array,
                    this.aKeys = new Array
            }
            return a.prototype.setCanvas = function(a, b, c, d) {
                this.canvasX = a,
                    this.canvasY = b,
                    this.canvasScaleX = c,
                    this.canvasScaleY = d
            },
                a.prototype.hitDown = function(a, b, c, d) {
                    if (!this.pauseIsOn) {
                        var e = (new Date).getTime();
                        if (! (e - this.prevHitTime < 500 && isBugBrowser)) {
                            this.prevHitTime = e,
                                a.preventDefault(),
                                a.stopPropagation(),
                                b = (b - this.canvasX) * this.canvasScaleX,
                                c = (c - this.canvasY) * this.canvasScaleY;
                            for (var f = 0; f < this.aHitAreas.length; f++) if (this.aHitAreas[f].rect && b > this.aHitAreas[f].area[0] && c > this.aHitAreas[f].area[1] && b < this.aHitAreas[f].area[2] && c < this.aHitAreas[f].area[3]) {
                                this.aHitAreas[f].aTouchIdentifiers.push(d),
                                this.aHitAreas[f].oData.isDown || (this.aHitAreas[f].oData.isDown = !0, this.aHitAreas[f].callback(this.aHitAreas[f].id, this.aHitAreas[f].oData));
                                break
                            }
                        }
                    }
                },
                a.prototype.hitUp = function(a, b, c, d) {
                    if (!this.pauseIsOn) {
                        a.preventDefault(),
                            b = (b - this.canvasX) * this.canvasScaleX,
                            c = (c - this.canvasY) * this.canvasScaleY;
                        for (var e = 0; e < this.aHitAreas.length; e++) if (this.aHitAreas[e].rect && b > this.aHitAreas[e].area[0] && c > this.aHitAreas[e].area[1] && b < this.aHitAreas[e].area[2] && c < this.aHitAreas[e].area[3]) {
                            for (var f = 0; f < this.aHitAreas[e].aTouchIdentifiers.length; f++) this.aHitAreas[e].aTouchIdentifiers[f] == d && (this.aHitAreas[e].aTouchIdentifiers.splice(f, 1), f -= 1);
                            0 == this.aHitAreas[e].aTouchIdentifiers.length && (this.aHitAreas[e].oData.isDown = !1, this.aHitAreas[e].oData.multiTouch && this.aHitAreas[e].callback(this.aHitAreas[e].id, this.aHitAreas[e].oData))
                        }
                    }
                },
                a.prototype.move = function(a, b, c, d, e) {
                    if (!this.pauseIsOn && e) {
                        b = (b - this.canvasX) * this.canvasScaleX,
                            c = (c - this.canvasY) * this.canvasScaleY;
                        for (var f = 0; f < this.aHitAreas.length; f++) if (this.aHitAreas[f].rect) if (b > this.aHitAreas[f].area[0] && c > this.aHitAreas[f].area[1] && b < this.aHitAreas[f].area[2] && c < this.aHitAreas[f].area[3]) this.aHitAreas[f].oData.isDown || (this.aHitAreas[f].oData.isDown = !0, this.aHitAreas[f].aTouchIdentifiers.push(d), this.aHitAreas[f].oData.multiTouch && this.aHitAreas[f].callback(this.aHitAreas[f].id, this.aHitAreas[f].oData)),
                        this.aHitAreas[f].oData.isDraggable && (this.aHitAreas[f].oData.isBeingDragged = !0, this.aHitAreas[f].oData.posX = b, this.aHitAreas[f].oData.posY = c, this.aHitAreas[f].callback(this.aHitAreas[f].id, this.aHitAreas[f].oData), this.aHitAreas[f].oData.isBeingDragged = !1);
                        else if (this.aHitAreas[f].oData.isDown) {
                            for (var g = 0; g < this.aHitAreas[f].aTouchIdentifiers.length; g++) this.aHitAreas[f].aTouchIdentifiers[g] == d && (this.aHitAreas[f].aTouchIdentifiers.splice(g, 1), g -= 1);
                            0 == this.aHitAreas[f].aTouchIdentifiers.length && (this.aHitAreas[f].oData.isDown = !1, this.aHitAreas[f].oData.multiTouch && this.aHitAreas[f].callback(this.aHitAreas[f].id, this.aHitAreas[f].oData))
                        }
                    }
                },
                a.prototype.leave = function(a, b, c, d) {
                    if (!this.pauseIsOn) {
                        a.preventDefault(),
                            a.stopPropagation(),
                            this.isDown = !1;
                        for (var e = 0; e < this.aHitAreas.length; e++) if (this.aHitAreas[e].aTouchIdentifiers.length > 0) {
                            for (var f = 0; f < this.aHitAreas[e].aTouchIdentifiers.length; f++) this.aHitAreas[e].aTouchIdentifiers[f] == d && (this.aHitAreas[e].aTouchIdentifiers.splice(f, 1), f -= 1);
                            0 == this.aHitAreas[e].aTouchIdentifiers.length && (this.aHitAreas[e].oData.isDown = !1, this.aHitAreas[e].callback(this.aHitAreas[e].id, this.aHitAreas[e].oData));
                            break
                        }
                    }
                },
                a.prototype.keyDown = function(a) {
                    for (var b = 0; b < this.aKeys.length; b++) a.keyCode == this.aKeys[b].keyCode && (this.aKeys[b].oData.isDown = !0, this.aKeys[b].callback(this.aKeys[b].id, this.aKeys[b].oData))
                },
                a.prototype.keyUp = function(a) {
                    for (var b = 0; b < this.aKeys.length; b++) a.keyCode == this.aKeys[b].keyCode && (this.aKeys[b].oData.isDown = !1, this.aKeys[b].callback(this.aKeys[b].id, this.aKeys[b].oData))
                },
                a.prototype.addKey = function(a, b, c, d) {
                    var e = this;
                    this.isDetectingKeys || (window.addEventListener("keydown",
                        function(a) {
                            e.keyDown(a)
                        },
                        !1), window.addEventListener("keyup",
                        function(a) {
                            e.keyUp(a)
                        },
                        !1), this.isDetectingKeys = !0),
                    null == c && (c = new Object),
                        this.aKeys.push({
                            id: a,
                            callback: b,
                            oData: c,
                            keyCode: d
                        })
                },
                a.prototype.removeKey = function(a) {
                    for (var b = 0; b < this.aKeys.length; b++) this.aKeys[b].id == a && (this.aKeys.splice(b, 1), b -= 1)
                },
                a.prototype.addHitArea = function(a, b, c, d, e) {
                    "undefined" == typeof e && (e = !1),
                    null == c && (c = new Object),
                    e && this.removeHitArea(a);
                    var f = new Array;
                    switch (d.type) {
                        case "image":
                            d.oImageData.isSpriteSheet ? this.aHitAreas.push({
                                id: a,
                                aTouchIdentifiers: f,
                                callback: b,
                                oData: c,
                                rect: !0,
                                area: [d.aCentrePos[0] - d.oImageData.oData.spriteHeight / 2, d.aCentrePos[1] - d.oImageData.oData.spriteHeight / 2, d.aCentrePos[0] + d.oImageData.oData.spriteWidth / 2, d.aCentrePos[1] + d.oImageData.oData.spriteHeight / 2]
                            }) : this.aHitAreas.push({
                                id: a,
                                aTouchIdentifiers: f,
                                callback: b,
                                oData: c,
                                rect: !0,
                                area: [d.aCentrePos[0] - d.oImageData.img.width / 2, d.aCentrePos[1] - d.oImageData.img.height / 2, d.aCentrePos[0] + d.oImageData.img.width / 2, d.aCentrePos[1] + d.oImageData.img.height / 2]
                            });
                            break;
                        case "rect":
                            this.aHitAreas.push({
                                id:
                                a,
                                aTouchIdentifiers: f,
                                callback: b,
                                oData: c,
                                rect: !0,
                                area: d.aRect
                            })
                    }
                },
                a.prototype.removeHitArea = function(a) {
                    for (var b = 0; b < this.aHitAreas.length; b++) this.aHitAreas[b].id == a && (this.aHitAreas.splice(b, 1), b -= 1)
                },
                a
        } ();
        a.UserInput = b
    } (Utils || (Utils = {}));
var Utils; !
    function(a) {
        var b = function() {
            function a(a) {
                this.updateFreq = 10,
                    this.updateInc = 0,
                    this.frameAverage = 0,
                    this.display = 1,
                    this.log = "",
                    this.render = function(a) {
                        this.frameAverage += this.delta / this.updateFreq,
                        ++this.updateInc >= this.updateFreq && (this.updateInc = 0, this.display = this.frameAverage, this.frameAverage = 0),
                            a.textAlign = "left",
                            ctx.font = "10px Helvetica",
                            a.fillStyle = "#333333",
                            a.beginPath(),
                            a.rect(0, this.canvasHeight - 15, 40, 15),
                            a.closePath(),
                            a.fill(),
                            a.fillStyle = "#fff",
                            a.fillText(Math.round(1e3 / (1e3 * this.display)) + " fps " + this.log, 5, this.canvasHeight - 5)
                    },
                    this.canvasHeight = a
            }
            return a.prototype.update = function(a) {
                this.delta = a
            },
                a
        } ();
        a.FpsMeter = b
    } (Utils || (Utils = {}));
var Elements; !
    function(a) {
        var b = function() {
            function a(a, b, c) {
                this.x = 0,
                    this.y = 0,
                    this.targY = 0,
                    this.incY = 0,
                    this.oImgData = a,
                    this.canvasWidth = b,
                    this.canvasHeight = c
            }
            return a.prototype.startScroll = function(a) {
                this.targY -= 4 * a,
                    TweenLite.killTweensOf(this),
                    TweenLite.to(this, 4, {
                        y: this.targY,
                        ease: "Quad.easeOut"
                    })
            },
                a.prototype.updateScroll = function(a) {
                    this.incY += 5 * a,
                        this.x = this.x - 50 * Math.sin(this.incY / 10) * a,
                        this.y = this.y - 50 * a
                },
                a.prototype.render = function(a) {
                    this.x = this.x % this.canvasWidth,
                        this.y = this.y % this.canvasHeight,
                    this.x < 0 && (this.x += this.canvasWidth),
                    this.y < 0 && (this.y += this.canvasHeight),
                        a.drawImage(this.oImgData.img, this.x, this.y, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight)
                },
                a
        } ();
        a.Background = b
    } (Elements || (Elements = {}));
var Elements; !
    function(a) {
        var b = function() {
            function a(a, b, c, d, e) {
                this.incY = 0,
                    this.score = 0,
                    this.highestScore = 0,
                    this.posY = 0,
                    this.bgX = 0,
                    this.bgY = 0,
                    this.atmosX = 0,
                    this.atmosY = 0,
                    this.oButs = a,
                    this.oBgImgData = b,
                    this.oTitleImgData = c,
                    this.canvasWidth = d,
                    this.canvasHeight = e,
                    this.posY = -this.canvasHeight
            }
            return a.prototype.setRenderFunc = function(a) {
                switch (this.posY = -this.canvasHeight, a) {
                    case "start":
                        this.renderFunc = this.renderStartScreen,
                            TweenLite.to(this, .5, {
                                posY: 0
                            });
                        break;
                    case "help":
                        break;
                    case "end":
                }
            },
                a.prototype.render = function(a, b) {
                    this.renderFunc(a, b)
                },
                a.prototype.renderStartScreen = function(a, b) {
                    this.incY += 5 * b,
                        this.bgY -= 50 * b,
                        this.bgX -= 50 * Math.sin(this.incY / 10) * b;
                    var c = this.bgX % this.canvasWidth,
                        d = this.bgY % this.canvasHeight;
                    0 > c && (c += this.canvasWidth),
                    0 > d && (d += this.canvasHeight),
                        a.drawImage(this.oBgImgData.img, c, d, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight),
                        a.drawImage(this.oTitleImgData.img, 15 + this.posY, 60),
                        a.drawImage(this.oButs.play.imageData.img, this.oButs.play.pos[0] - this.oButs.play.imageData.img.width / 2, this.oButs.play.pos[1] - this.oButs.play.imageData.img.height / 2 - 5 * Math.sin(this.incY) - this.posY)
                },
                a
        } ();
        a.Screens = b
    } (Elements || (Elements = {}));
var Elements; !
    function(a) {
        var b = function() {
            function a(a, b, c) {
                this.inc = 0,
                    this.oSplashScreenImgData = a,
                    this.canvasWidth = b,
                    this.canvasHeight = c,
                    this.posY = -this.canvasHeight,
                    TweenLite.to(this, .5, {
                        posY: 0
                    })
            }
            return a.prototype.render = function(a, b) {
                this.inc += 5 * b,
                    a.drawImage(this.oSplashScreenImgData.img, 0, 0 - this.posY)
            },
                a
        } ();
        a.Splash = b
    } (Elements || (Elements = {}));
var Elements; !
    function(a) {
        var b = function() {
            function a(a, b, c, d, e, f, g) {
                this.timer = .3,
                    this.endTime = 0,
                    this.posY = 0,
                    this.numberSpace = 17,
                    this.incY = 0,
                    this.oPanelsImgData = a,
                    this.oThinNumbersImgData = b,
                    this.oFatNumbersImgData = c,
                    this.panelType = d,
                    this.aButs = e,
                    this.canvasWidth = f,
                    this.canvasHeight = g
            }
            return a.prototype.update = function(a) {
                this.incY += 5 * a
            },
                a.prototype.startTween = function() {
                    this.posY = 550,
                        TweenLite.to(this, .8, {
                            posY: 0,
                            ease: "Back.easeOut"
                        })
                },
                a.prototype.render = function(a) {
                    switch (this.panelType) {
                        case "start":
                            var b = 6,
                                c = b * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                                d = Math.floor(b / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                            a.drawImage(this.oPanelsImgData.img, c, d, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                            break;
                        case "gameOver":
                            var b = 5,
                                c = b * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                                d = Math.floor(b / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                            a.drawImage(this.oPanelsImgData.img, c, d, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                            for (var e = this.oScoreData.balloonsPopped,
                                     f = 0; f < e.toString().length; f++) {
                                b = parseFloat(e.toString().charAt(f));
                                var c = b * this.oFatNumbersImgData.oData.spriteWidth % this.oFatNumbersImgData.img.width,
                                    d = Math.floor(b / (this.oFatNumbersImgData.img.width / this.oFatNumbersImgData.oData.spriteWidth)) * this.oFatNumbersImgData.oData.spriteHeight;
                                a.drawImage(this.oFatNumbersImgData.img, c, d, this.oFatNumbersImgData.oData.spriteWidth, this.oFatNumbersImgData.oData.spriteHeight, this.canvasWidth / 2 + 25 * f - 25 * e.toString().length / 1.4, 235 + this.posY, this.oFatNumbersImgData.oData.spriteWidth, this.oFatNumbersImgData.oData.spriteHeight)
                            }
                            break;
                        case "tutorial0":
                            var b = parseFloat(this.panelType.charAt(this.panelType.length - 1)),
                                c = b * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                                d = Math.floor(b / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                            a.drawImage(this.oPanelsImgData.img, c, d, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                            break;
                        case "pause":
                            var b = 7,
                                c = b * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                                d = Math.floor(b / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                            a.drawImage(this.oPanelsImgData.img, c, d, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight)
                    }
                    for (var f = 0; f < this.aButs.length; f++) 0 == f % 2 ? a.drawImage(this.aButs[f].oImgData.img, this.aButs[f].aPos[0] - this.aButs[f].oImgData.img.width / 2 + this.posY, this.aButs[f].aPos[1] - this.aButs[f].oImgData.img.height / 2 - 5 * Math.sin(this.incY + 180)) : a.drawImage(this.aButs[f].oImgData.img, this.aButs[f].aPos[0] - this.aButs[f].oImgData.img.width / 2 - this.posY, this.aButs[f].aPos[1] - this.aButs[f].oImgData.img.height / 2 - 5 * Math.sin(this.incY))
                },
                a
        } ();
        a.Panel = b
    } (Elements || (Elements = {}));
var Elements; !
    function(a) {
        var b = function() {
            function a(a, b, c, d, e) {
                this.score = 0,
                    this.oHudImgData = a,
                    this.oThinNumbersImgData = b,
                    this.oFatNumbersImgData = c,
                    this.canvasWidth = d,
                    this.canvasHeight = e,
                    this.score = 0
            }
            return a.prototype.render = function(a, b) {
                a.drawImage(this.oHudImgData.img, 0, 0);
                for (var c = 0; c < this.score.toString().length; c++) {
                    var d = parseFloat(this.score.toString().charAt(c)),
                        e = d * this.oFatNumbersImgData.oData.spriteWidth % this.oFatNumbersImgData.img.width,
                        f = Math.floor(d / (this.oFatNumbersImgData.img.width / this.oFatNumbersImgData.oData.spriteWidth)) * this.oFatNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oFatNumbersImgData.img, e, f, this.oFatNumbersImgData.oData.spriteWidth, this.oFatNumbersImgData.oData.spriteHeight, 175 + 25 * c - 25 * this.score.toString().length / 2, 18, this.oFatNumbersImgData.oData.spriteWidth, this.oFatNumbersImgData.oData.spriteHeight)
                }
                for (var c = 0; c < b.toString().length; c++) {
                    var d = parseFloat(b.toString().charAt(c)),
                        e = d * this.oThinNumbersImgData.oData.spriteWidth % this.oThinNumbersImgData.img.width,
                        f = Math.floor(d / (this.oThinNumbersImgData.img.width / this.oThinNumbersImgData.oData.spriteWidth)) * this.oThinNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oThinNumbersImgData.img, e, f, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight, 31 + 17 * c - 17 * b.toString().length / 2, 22, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight)
                }
            },
                a.prototype.updateScore = function(a) {
                    this.score = a
                },
                a
        } ();
        a.Hud = b
    } (Elements || (Elements = {}));
var __extends = this.__extends ||
        function(a, b) {
            function c() {
                this.constructor = a
            }
            c.prototype = b.prototype,
                a.prototype = new c
        },
    Elements; !
    function(a) {
        var b = function(a) {
            function b(b, c, d, e, f, g) {
                a.call(this, b, 15, 15, "unSelected" + e),
                    this.canHit = !0,
                    this.selected = !1,
                    this.popDelay = -1,
                    this.oDotImgData = b,
                    this.oPopImgData = c,
                    this.id = d,
                    this.type = this.colour = e,
                    this.canvasWidth = f,
                    this.canvasHeight = g,
                    this.offsetY = 10,
                    this.frameInc = Math.ceil(20 * Math.random()),
                    this.animEndedFunc = this.burst
            }
            return __extends(b, a),
                b.prototype.fall = function() {
                    this.y = this.targY + 550,
                        this.x = this.targX,
                        TweenLite.to(this, .5, {
                            y: this.targY,
                            delay: .02 * this.id,
                            ease: "Quad.easeOut"
                        })
                },
                b.prototype.replaceWithExistingDot = function(a) {
                    this.y = a.targY,
                        this.type = a.type,
                        this.removeMe = !1,
                        this.canHit = !0,
                        this.x = this.targX,
                        this.changeSpriteSheet(this.oDotImgData),
                        this.frameInc = a.frameInc,
                        this.unSelect(),
                        TweenLite.to(this, .2, {
                            y: this.targY,
                            ease: "Quad.easeInOut"
                        })
                },
                b.prototype.replaceWithNewDot = function(a) {
                    this.y = this.targY + 550,
                        this.type = a,
                        this.removeMe = !1,
                        this.canHit = !0,
                        this.x = this.targX,
                        this.changeSpriteSheet(this.oDotImgData),
                        this.frameInc = Math.ceil(20 * Math.random()),
                        this.unSelect(),
                        TweenLite.to(this, .3, {
                            y: this.targY,
                            ease: "Quad.easeOut"
                        })
                },
                b.prototype.trySelect = function(a) {
                    var b = a.x - this.x,
                        c = a.targY - this.targY,
                        d = b * b + c * c;
                    return 8100 > d && (a.colour == this.colour || this.type >= 6 || 6 == a.type) ? (this.select(), this.type >= 7 && (this.colour = a.colour), this.prevDot = a, this) : a
                },
                b.prototype.select = function() {
                    this.selected || (this.setAnimType("loop", "selected" + this.type, !1), this.selected = !0)
                },
                b.prototype.unSelect = function() {
                    this.setAnimType("loop", "unSelected" + this.type, !1),
                        this.selected = !1,
                        this.colour = this.type
                },
                b.prototype.update = function(b) {
                    a.prototype.updateAnimation.call(this, b),
                    this.popDelay >= 0 && (this.popDelay += b, this.popDelay > this.popDelayTarg && this.pop())
                },
                b.prototype.hit = function(a) {
                    this.popDelay = 0,
                        this.popDelayTarg = .2 * a
                },
                b.prototype.pop = function() {
                    this.popDelay = -1,
                        this.changeSpriteSheet(this.oPopImgData),
                        this.canHit = !1,
                        this.setAnimType("once", "pop")
                },
                b.prototype.burst = function() {
                    this.removeMe = !0
                },
                b
        } (Utils.AnimSprite);
        a.Dot = b
    } (Elements || (Elements = {}));
var requestAnimFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(a) {
                window.setTimeout(a, 1e3 / 60, (new Date).getTime())
            }
    } (),
    previousTime,
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
canvas.width = 383,
    canvas.height = 550;
var canvasX, canvasY, canvasScaleX, canvasScaleY, div = document.getElementById("viewporter"),
    splash,
    splashTimer = 0,
    screens,
    assetLib,
    preAssetLib,
    rotatePause = !1,
    manualPause = !1,
    isMobile = !1,
    gameState = "loading",
    aLangs = new Array("EN"),
    curLang = "",
    isBugBrowser = !1,
    deviceAgent = navigator.userAgent.toLowerCase(); (deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/) || deviceAgent.match(/(iemobile)/) || deviceAgent.match(/iphone/i) || deviceAgent.match(/ipad/i) || deviceAgent.match(/ipod/i) || deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i)) && (isMobile = !0, deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent) && (isBugBrowser = !0));
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas();
window.onresize = function() {
    setTimeout(function() {
            resizeCanvas()
        },1)
},
window.addEventListener("load",
    function() {
        setTimeout(function() {
            resizeCanvas()
        },0),
        window.addEventListener("orientationchange",function() {resizeCanvas()}, !1)
    }
);
var panel, hud, background, gameScore, gameNum = 0,
    url = 'front/sh/campaign!activity?uid=m008',
    flag = Util.browser.getParameter('se'),
    cmpgnId = Util.browser.getParameter('cmpgnId'),
    flag = '1',
    cmpgnId = '20170223102254116959',
    givprzType,
    getScore,
    chnlId,
    saveUrl,
    aLevelUps, aTutorials = new Array({
        gameNum: 0,
        shown: !1,
        panelType: "tutorial0"
    }),
    panelFrame,
    aDots,
    lastSelectedDot,
    aSelected,
    blockTap = !1,
    removedDots,
    gameTime,
    begTime,
    endTime,
    balloonsPopped;
if(flag != '0' && cmpgnId){
    Util.ajax.postJsonAsync(url+"&cmpgnId=" + cmpgnId,'',function(json,status){
        if(status) {
            var bean = json.bean;
            $('title').text(bean.cmpgnNm + '-云营销'); //网页标题
            $('input[name="chnlId"]').val(bean.chnlId);
            givprzType = bean.givprzTypeCd; //活动类型
            getScore = bean.gameScore;
            chnlId = bean.chnlId;
            saveUrl = bean.givprzTypeCd == '01' ? 'front/sh/game!execute?uid=m007' : 'front/sh/game!execute?uid=m004';
        }
    });
    if(Util.isLogin.login()){
        if(sessionStorage.getItem("gameScore") && sessionStorage.getItem("gameScore") != ''){
            var loading = Util.layer.loading(10000);
            var param = {
                'cmpgnId':cmpgnId,
                'gameScore': sessionStorage.getItem("gameScore"),
                'bgnGameTime':sessionStorage.getItem("bgnGameTime"),
                'endGameTime':sessionStorage.getItem("endGameTime")
            };
            Util.ajax.postJsonAsync(saveUrl, param, function(json,status){
                if(status){
                    window.sessionStorage.removeItem('gameScore');
                    window.sessionStorage.removeItem('bgnGameTime');
                    window.sessionStorage.removeItem('endGameTime');
                    Util.layer.tips('分数保存成功',2);
                    Util.layer.close(loading);
                }else{
                    Util.layer.close(loading);
                }
            });
        }
    }
}