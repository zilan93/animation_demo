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
            },"4000","linear",function () {
                dfd.resolve();
            });
            return dfd;
        },
        //停止走路
        stopWalk:function () {
            $boy.removeClass("chri_boy_walk").addClass("chri_boy_stop");
        },
        //解开包裹
        unwrapp:function () {
            var dfd = $.Deferred();
            $boy.removeClass(".chri_boy_stop").addClass("chri_boy_gift");
            $boy.one(animationEnd,function () {
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
        girlWalk:function () {
            var dfd = $.Deferred();
            $girl.removeClass("girl_stand").addClass("girl_walk");
            $girl.transition({
                "left":"4.5rem",
                "top":$boy.offset().top + 0.46
            },4000,"linear",function () {
                dfd.resolve();
            });
            return dfd;
        },
        girlStopWalk:function () {
            $girl.removeClass("girl_walk").addClass("girl_stop");
        },
        girlHangUp:function () {
            var dfd = $.Deferred();
            $girl.addClass("girl_hangup").one(animationEnd,function () {
                dfd.resolve();
            });
            return dfd;
        },
        girlHug:function () {
            var dfd = $.Deferred();
            $girl.addClass("girl_hug").one(animationEnd,function () {
                dfd.resolve();
            });
            return dfd;
        }
    };
     /* 旋转木马*/

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
        }).then(function () {
            return girlAction.girlWalk();
        }).then(function () {
            girlAction.girlStopWalk();
            return boyAction.unwrapp();
        }).then(function () {
            setTimeout(function () {
                carousel = new Carousel($carousel,{imgUrls:imgUrls,videoUrls:videoUrls});
            },500);
            return girlAction.girlHangUp();
        })
        .then(function () {
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
                girlAction.girlHug();
                boyAction.hug()
            },4000)
        })
}