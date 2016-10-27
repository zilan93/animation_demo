/**
 * Created by Administrator on 2016/10/26.
 */
function swipe() {
    //获取窗口的宽度
    var container = $("#container");
    var bgObj = container.children("ul");
    var bgLists = bgObj.children("li");
    var visualWidth = container.width();
    var visualHeight = container.height();
    //设置背景元素的宽高
    bgLists.css({
        "width":visualWidth + "px"
    });
    bgObj.css({
        "width":visualWidth * bgLists.length + "px",
        "height":visualHeight
    });
    //背景滑动
    function scrollTo(dis,time) {
        bgObj.css({
            "transform":"translate3d(-" + dis + "px,0,0)",
            "transition":"all linear " + time +"ms"
        });
    }
    return {
        scrollToFun:function (dis,time) {
            scrollTo(dis,time);
        }
    }
}