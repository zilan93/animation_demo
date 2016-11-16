/**
 * Created by Administrator on 2016/11/11.
 * 圣诞主题效果
 * @type {Object}
 */

/**
 * 切换页面
 * 模拟镜头效果
 * @return {[type]} [description]
 */
function changePage(element,effect,callback) {
    element
        .addClass(effect)
        .one("animationend webkitAnimationEnd",function () {
            callback && callback();
        })
}
/**
 * 中间调用
 */
var Christmas = function () {
    //页面容器元素
    var $pageA = $(".page-a");
    var $pageB = $(".page-b");
    var $pageC = $(".page-c");

    //构建第一个场景页面对象
    var pageAFun = new pageA($pageA);
    //观察者
    var observer = new Observer();
    //A场景页面
    pageAFun.run(function () {
        observer.publish("completeA");
    });
    //进入场景B
    observer.subscribe("pageB",function () {
        new pageB($pageB);
        observer.publish("completeB");
    });
    //进入场景C
    observer.subscribe("pageC",function () {
        new pageC($pageC);
    });
    //页面A-B切换
    observer.subscribe("completeA",function () {
        changePage($pageA,"effect-out",function () {
            observer.publish("pageB")
        })
    });
    //页面B-C切换
    observer.subscribe("completeB",function () {
        changePage($pageC,"effect-in",function () {
            observer.publish("page-c")
        })
    });
    /*//切换页面
    $("#choose").on("change",function (e) {
        var pageName = e.target.value;
        switch (pageName) {
            case "page-b":
                changePage($pageA,"effect-out",function () {
                    new pageB()
                });
                break;
            case "page-c":
                changePage($pageC,"effect-in",function () {
                    new pageC()
                });
                break;
        }
    })*/
};
$(function () {
    Christmas()
});

/**
 * 背景音乐
 * @param {[type]} url  [description]
 * @param {[type]} loop [description]
*/
function HTML5Audio(url,loop) {
    var audio = new Audio(url);
    audio.autoplay = true;
    audio.loop = loop || false;
    audio.play();
    return {
        end:function (callback) {
            audio.addEventListener("ended",function () {
                callback()
            },false);
        }
    }
}
/**
*自适应处理
*/
var doc = document;
var docE1 = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
        var clientWidth = docE1.clientWidth;
        if(!clientWidth) return;
        docE1.style.fontSize = 20 * (clientWidth / 320) + "px";
        document.body.style.height = clientWidth * (900/1440) + "px";
    };
    window.addEventListener(resizeEvt,recalc,false);
    doc.addEventListener('DOMContentLoaded',recalc,false);
