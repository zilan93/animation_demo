/**
 * Created by Administrator on 2016/11/11.
 */
function pageB(element,pageComplete) {
    var $boy = element.find(".chri_boy");
    var $girl = element.find(".girl");
    var animationEnd = "animationend webkitAnimationEnd";
    /**
     * 小男孩动作
     */
    var boyAction = {
        //走路
        walk:function () {
            var dfd = $.Deferred();
            $boy.addClass("chri_boy_walk").transition({
                "right":"4.5rem"
            },"4000ms","linear",function () {
                dfd.resolve();
            });
            return dfd;
        },
        //停止走路
        stopWalk:function () {
            $boy.removeClass("chri_boy_walk").addClass("chri_boy_stop");
        },
        //解开包裹
        unwrapp:function (callback) {
            var dfd = $.Deferred();
            $boy.removeClass(".chri_boy_stop").addClass("chri_boy_gift");
            $boy.one(animationEnd,function () {
                callback();
                dfd.resolve();
            });
            return dfd;
        },
        //脱衣动作
        strip:function (count) {
            $boy.addClass("boy_strip_" + count).removeClass("chri_boy_gift");
        },
        //拥抱
        hug:function () {
            $boy.addClass("chri_boy_walk_to_girl").one(animationEnd,function () {
                $(".chri_boy_head").show();
            })
        }
        };
    /**
     * 小女孩动作
     */
    var girlAction = {
        //起立
        standup:function () {
            var dfd = $.Deferred();
            $girl.addClass("girl_stand").one(animationEnd,function () {
                dfd.resolve();
            });
            return dfd;
        },
        //走路
        girlWalk:function (callback) {
            var dfd = $.Deferred();
            $girl.removeClass("girl_stand").addClass("girl_walk");
            $girl.transition({
                "left":"4.5rem",
                "top":"4rem"
            },"4000ms","linear",function() {
                callback();
                dfd.resolve();
            });
            return dfd;
        },
        //停止走路
        girlStopWalk:function () {
            $girl.removeClass("girl_walk").addClass("girl_stop");
        },
        //选择
        choose:function (callback) {
            $girl.addClass("girl_hangup").one(animationEnd,function () {
                callback();
            });
        },
        //泪奔
        weepWalk:function (callback) {
            $girl.addClass("girl_weep").transition({
                "left":"7rem"
            },1000,"linear",function () {
                $girl.removeClass("girl_weep").addClass("girl_stop");
                callback();
            });
        },
        //拥抱
        hug:function () {
            $girl.addClass("girl_hug");
        }
    };
     /* 旋转木马*/
    var carousel;
    var $carousel = element.find("#carousel");
    var imgUrls = [
            "images/carousel/1.png",
            "images/carousel/2.png",
            "images/carousel/3.png"
        ];
    var videoUrls = [
        "images/carousel/1.mp4",
        "images/carousel/2.mp4",
        "images/carousel/3.mp4"
    ];
    boyAction.walk()
        .then(function () {
            boyAction.stopWalk();
            return girlAction.standup();
        })
        .then(function () {
            return girlAction.girlWalk(girlAction.girlStopWalk);
        })
        .then(function () {
            return boyAction.unwrapp(function () {
                carousel = new Carousel($carousel,{imgUrls:imgUrls,videoUrls:videoUrls});
            });
        })
        .then(function () {
            girlAction.choose(function () {
                setTimeout(function () {
                    carousel.run(1,carousel.palyVideo);
                    boyAction.strip(1)
                },1000);
                setTimeout(function () {
                    carousel.run(2,carousel.palyVideo);
                    boyAction.strip(2)
                },2000);
                setTimeout(function () {
                    carousel.run(3,carousel.palyVideo);
                    boyAction.strip(3)
                },3000);
                setTimeout(function () {
                    girlAction.weepWalk(function () {
                        boyAction.hug();
                        girlAction.hug();
                    })
                },4000)
            });
        })
}