/**
 * Created by Administrator on 2016/11/11.
 */
function pageB(element,pageComplete) {
    var $boy = element.find(".chri_boy");
    var $girl = element.find(".girl");
    var $carousel = element.find("#carousel");
    var animationEnd = "animationend webkitAnimationEnd";
    function n() {
        var e = $.Deferred();
        return function () {
            r(e)
        }.defer(500);
        e;
    }
    function r(e) {
        var t = o(),
            n = 1,
            r = t.numpics,
            s = function () {
                i(n,t,function () {
                    ++n;
                    a()
                })
            },
            a = function () {
                return n > r ? (t.destroy(),void function () {
                    e.resolve()
                }.defer(1000)) : void function () {
                    s()
                }.defer(1000)
            };
            s()
    }
    function i(e,t,n) {
        t.run(e);
        girlAction.choose(function() {
            t.selected(function () {
                t.playVideo({
                    load: function () {
                        girlAction.reset();
                        t.reset();
                        boyAction.strip(e);
                    },
                    complete: function () {
                        n()
                    }
                })
            })
        })
    }
    function o() {
        var e = new Carousel($carousel,{
            imgUrls: [
            "images/carousel/1.png",
            "images/carousel/2.png",
            "images/carousel/3.png"
        ],
            videoUrls: [
            "images/carousel/1.mp4",
            "images/carousel/2.mp4",
            "images/carousel/3.mp4"
        ]
        });
        return e;
    }
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
                "top":"4rem"
            },"4000ms","linear",function() {
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
    boyAction.walk()
        .then(function () {
            boyAction.stopWalk();
            return girlAction.standup();
        })
        .then(function () {
            return girlAction.girlWalk();
        })
        .then(function () {
            girlAction.girlStopWalk();
            return boyAction.unwrapp();
        })
        .then(function () {
            carousel = new Carousel($carousel,{imgUrls:imgUrls,videoUrls:videoUrls});

            girlAction.choose(function () {
                setTimeout(function () {
                    //carousel.run(1,carousel.palyVideo);
                    boyAction.strip(1);
                    alert(0);
                },1000);
                setTimeout(function () {
                    //carousel.run(2,carousel.palyVideo);
                    boyAction.strip(2);
                    alert(1);
                },2000);
                setTimeout(function () {
                    //carousel.run(3,carousel.palyVideo);
                    boyAction.strip(3);
                    alert(2);
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