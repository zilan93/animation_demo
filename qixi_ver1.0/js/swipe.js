/**
 * Created by Administrator on 2016/10/20.
 * 在Swipe函数里定义一个swipe对象，给该对象绑定一个scrollTo方法，并返回该对象。
 * 需要页面滚动时，只用调用该对象的方法，传入参数即可。
 */
function Swipe(contanier) {
    //获取包裹li容器对象
    var element = contanier.find(":first");
    //滑动对象
    var swipe = {};
    //获取li
    var slides = element.children("li");
    //获取外层容器的宽高
    var width = contanier.width();
    var heigth = contanier.height();
    //设置ul容器的宽高
    element.css({
        "width" : width * slides.length + "px",
        "height" : heigth + "px"
    });
    //设置li滑块容器的宽高
    $.each(slides,function (index) {
        var slide = slides.eq(index);
        slide.css({
            "width" : width + "px",
            "height" : heigth + "px"
        });
    });
    //监控完成与移动
    swipe.scrollTo = function(x, speed) {
        //执行动画移动
        element.css({
            "transform":"translate3d(-" + x + "px,0,0)",
            "transition":"all linear " + speed + "ms"
        });
        return this;
    };
    return swipe;
}


