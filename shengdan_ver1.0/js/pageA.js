/**
 * Created by Administrator on 2016/11/11.
 */
function pageA(element) {
    this.$root = element;
    this.$boy = element.find(".boy");
    this.run();
}
/**
 * 运行下一个动画
 * @return {Function} [description]
 */
pageA.prototype.next = function (options) {
    var dfd = $.Deferred();
    this.$boy.addClass("boy_run");
    this.$boy.transition(options.style,options.time,'linear',function () {
        dfd.resolve()
    });
    return dfd;
};
/**
 * 停止走路
 */
pageA.prototype.stopWalk = function () {
    this.$boy.removeClass("boy_run")
};
/**
 * 路径
 * @type {any}
 */
pageA.prototype.run = function (callback) {
    var that = this;
    var next = function () {
        return this.next.apply(this,arguments)
    }.bind(this);

    next({
        "time":1000,
        "style":{
            "top":"4rem",
            "right":"16rem",
            "scale":"1"
        }
    }).then(function () {
            return next({
                "time":500,
                "style":{
                    "rotateY":"-180",
                    "scale":"1.5"
                }
            })
        }).then(function () {
            return next({
                "time":700,
                "style":{
                    "top":"7.5rem",
                    "right":"1rem",
                    "scale":"1"
                }
            })
        }).then(function () {
            that.stopWalk();
        })
};

