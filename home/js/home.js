$(function () {

    loadHeader();

    loadSearch();


    loadFooter();

    /*获取banner中的数据*/
    HomeHttp.getBanner()
        .then(function (res) {
            let bannerData = res.data;
            let bannerHtml = template("banner", bannerData);
            $(".swiper-wrapper").html(bannerHtml);
            /*初始化swiper*/
            let bannerSwiper = new Swiper('.swiper-container', {
                loop: true, // 循环模式选项

                autoplay: true,
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',

                    bulletClass: 'my-bullet',//需设置.my-bullet样式

                    bulletActiveClass: 'my-bullet-active',
                },

            });
        })
        .catch(function (e) {
            console.log(e);
        });

    /*设置导航栏当前时间*/
    $(".now").text(new Date().getDate());


    let backMaxScroll = 0;
    initIScroll();

    /*获取推荐歌单数据*/
    function getRecommend() {
        return new Promise(function (resolve, reject) {
            HomeHttp.getRecommend()
                .then(function (res) {
                    let recommendDate = res.data;
                    res.data.title = "推荐歌单";
                    res.data.subTitle = "歌单广场";
                    $.each(res.data.result, function (index, value) {
                        let formatPlayCount = formatNum(value.playCount);
                        value.formatPlayCount = formatPlayCount;
                        value.width = "30%";
                    });
                    let html = template("category", recommendDate);
                    resolve($(".recommend").html(html));
                })
                .catch(function (e) {
                    reject(e);
                });
        })
    }

    function getExclusive() {
        return new Promise(function (resolve, reject) {
            HomeHttp.getExclusive()
                .then(function (res) {
                    let exclusiveData = res.data;
                    exclusiveData.title = "独家放送";
                    exclusiveData.subTitle = "网易出品";
                    $.each(exclusiveData.result, function (index, value) {
                        if (index < exclusiveData.result.length - 1) {
                            value.width = "45%";
                        } else {
                            value.width = "100%";
                        }
                    });
                    let html = template("category", exclusiveData);
                    resolve($(".exclusive").html(html));
                })
                .catch(function (e) {
                    reject(e);
                })
        })
    }

    function getAlbum() {
        return new Promise(function (resolve, reject) {
            HomeHttp.getAlbum()
                .then(function (res) {
                    let albumData = res.data;
                    albumData.title = "新碟新歌";
                    albumData.subTitle = "更多新碟";
                    albumData.result = albumData.albums;
                    $.each(albumData.result, function (index, value) {
                        value.width = "30%";
                        value.flag = "singer-desc"
                    });
                    let html = template("category", albumData);
                    resolve($(".album").html(html));
                })
                .catch(function (e) {
                    reject(e);
                })
        })
    }

    function getMv() {
        return new Promise(function (resolve, reject) {
            HomeHttp.getMv()
                .then(function (res) {
                    let mvDate = res.data;
                    mvDate.title = "推荐MV";
                    mvDate.subTitle = "更多MV";
                    $.each(mvDate.result, function (index, value) {
                        value.width = "45%";
                        value.flag = "singer-desc"
                    });
                    let html = template("category", mvDate);
                    resolve($(".mv").html(html));
                })
                .catch(function (e) {
                    reject(e);
                });
        })
    }

    function getDj() {
        return new Promise(function (resolve, reject) {
            HomeHttp.getDj()
                .then(function (res) {
                    let djDate = res.data;
                    djDate.title = "主播电台";
                    djDate.subTitle = "更多主播";
                    $.each(djDate.result, function (index, value) {
                        value.width = "30%";
                    });
                    let html = template("category", djDate);
                    resolve($(".dj").html(html));
                })
                .catch(function (e) {
                    reject(e);
                });
        })
    }

    getDataAfterOption();

    function getDataAfterOption() {
        Promise.all([getRecommend(),
            getExclusive(),
            getAlbum(),
            getMv(),
            getDj()])
            .then(function () {
                let descArray = $(".category-desc");
                let singerArray = $(".category-singer,.singer-desc");
                $(descArray).each(function (index, value) {
                    $clamp(value, {clamp: 2});
                });

                $(singerArray).each(function (index, value) {
                    $clamp(value, {clamp: 1});
                });
                setTimeout(function () {
                    mainScroll.refresh();
                    backMaxScroll = mainScroll.maxScrollY;
                }, 200)
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    /*初始化内容区域的iscroll*/
    function initIScroll() {
        window.mainScroll = new IScroll('.main', {
            mouseWheel: false,
            scrollbars: false,
            probeType: 3,
        });
        /*初始化下拉刷新*/
        let logLength = $("#refreshLogo").get(0).getTotalLength();
        $("#refreshLogo").attr("stroke-dasharray", logLength).attr("stroke-dashoffset", logLength);

        /*iscroll滚动*/
        let pullDownHeight = $(".pullDown").height();
        let pullUpHeight = $(".pullUp").height();
        let isTargetDown = false;
        let isTargetUp = false;
        let isRefresh = false;
        /*开始滚动*/
        mainScroll.on("scroll", function () {
            let y = parseInt(this.y);
            /*下拉*/
            if (y >= pullDownHeight) {
                if (!isTargetDown) {
                    let offset = logLength - (y - pullDownHeight) * 3.5;
                    if (offset <= 0) {
                        isTargetDown = true;
                        offset = 0;
                        mainScroll.minScrollY = 150;
                    }
                    $("#refreshLogo").attr("stroke-dashoffset", offset);
                }
            } else if (!isTargetDown) {
                $("#refreshLogo").attr("stroke-dashoffset", logLength);
            }
            /*上拉*/
            let targetHeight = backMaxScroll - pullUpHeight;
            if (y <= targetHeight) {
                if (!isTargetUp) {
                    $(".pullUp span").text("松手加载更多");
                    this.maxScrollY = targetHeight;
                    isTargetUp = true;
                }
            }
        });
        /*结束滚动*/
        mainScroll.on("scrollEnd", function () {
            /*上拉加载数据*/
            if (isTargetDown && !isRefresh) {
                isRefresh = true;
                getDataDown();
            }
            /*下拉加载数据*/
            if (isTargetUp && !isRefresh) {
                isRefresh = true;
                $(".pullUp span").text("加载中...");
                getDataUp();
            }
        });

        function getDataDown() {
            setTimeout(function () {
                console.log("获取数据");
                mainScroll.scrollTo(0, 0);
                mainScroll.minScrollY = 0;
                $("#refreshLogo").attr("stroke-dashoffset", logLength);
                isTargetDown = false;
                isRefresh = false;
                tip();
            }, 20);
        }

        function getDataUp() {
            setTimeout(function () {
                console.log("获取数据");
                mainScroll.scrollTo(0, backMaxScroll);
                mainScroll.maxScrollY = backMaxScroll;
                isTargetUp = false;
                isRefresh = false;
                tip();
            }, 1000);
        }

        return mainScroll;
    }

    function formatNum(num) {
        let res = 0;
        if (num / 100000000 > 1) {
            let temp = num / 100000000 + "";
            if (temp.indexOf(".") === -1) {
                res = num / 100000000 + "亿";
            } else {
                res = (num / 100000000).toFixed(1) + "亿";
            }
        } else if (num / 10000 > 1) {
            let temp = num / 10000 + "";
            if (temp.indexOf(".") === -1) {
                res = num / 10000 + "万";
            } else {
                res = (num / 10000).toFixed(1) + "万";
            }
        } else {
            res = num;
        }
        return res;
    }

    //tip弹出显示的方法
    function tip() {
        setTimeout(function () {
            $(".tip").animate({
                top: 110 / 100 + "rem",
                opacity: "show",
            }, 500, function () {
                setTimeout(function () {
                    $(".tip").animate({
                        top: 24 / 100 + "rem",
                        opacity: "hide",
                    })
                }, 1000)
            });
        }, 300)
    }
});