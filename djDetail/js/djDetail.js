$(function () {
    let id = getQueryVariable("id");

    let isTarget = false;

    //导入底部
    loadFooter();

    //返回点击
    $(".header-left img").click(function () {
        window.history.back();
    });

    //获取数据
    DetailApis.getDjRadio(id)
        .then(function (res) {
            let djData = res.data.djRadio;
            $(".bg img").attr("src", djData.picUrl);
            let infoHtml = template("info", djData)
            $(".top-info").html(infoHtml);
            let commentHtml = template("comment", djData);
            $(".bottom-content").html(commentHtml);
            let mainIScroll = new IScroll(".main", {
                mouseWheel: false,
                scrollbars: false,
                probeType: 3,
            });
            let mainTopHeight = $(".main-top").height();
            let headerHeight = $(".header").height();
            let targetHeight = mainTopHeight - headerHeight;
            let infoHeight = $(".top-info").height();
            let fadeHeight = targetHeight - infoHeight;
            mainIScroll.on("scroll", function () {
                //固定
                if (this.y <= -targetHeight) {
                    if (!isTarget) {
                        isTarget = true;
                        $(".header-center span").text("RU电台");
                    }

                    //固定底部
                    let offset = this.y + targetHeight;
                    //固定导航栏
                    $(".bottom-nav").css("top", -offset);
                    $(".main-bottom").css("top", -offset);
                    //滚动底部内容
                    $(".bottom-content").css("top", offset);
                    $(".tool-bar").css("top", -offset);
                } else {
                    $(".main-bottom").css("top", 0);
                    $(".bottom-content").css("top", 0);
                    //固定导航栏
                    $(".bottom-nav").css("top", 0);
                    $(".tool-bar").css("top", 0);
                    if (isTarget) {
                        isTarget = false;
                        $(".header-center span").text("电台");
                    }
                }
                //消失
                if (this.y <= -fadeHeight) {
                    let offset = this.y + fadeHeight;
                    let fadeProgress = (-offset / 70);
                    if (fadeProgress >= 1) {
                        fadeProgress = 1;
                    }
                    $(".top-info").css({
                        opacity: (1 - fadeProgress)
                    })
                } else {
                    //还原默认
                    $(".top-info").css({
                        opacity: 1
                    })
                }
                //向下滚动
                if (this.y > 0) {
                    let scale = (mainTopHeight + this.y) / mainTopHeight * 100;
                    $(".bg img").css({
                        width: `${scale}%`,
                        filter: `blur(0rem)`,
                    });
                    $(".bg").css("top", -(this.y / 3));
                    $(".modal").css("top", -this.y);
                } else {
                    let blur = (-this.y / 30);
                    $(".bg img").css({
                        width: "100%",
                        filter: `blur(${blur / 100}rem)`,
                    });
                    $(".bg").css("top", 0);
                    $(".modal").css("top", 0);
                }
            });

            //初始化点击图标
            let initIconWidth = $(".nav-left").width();
            let initIconLeft = $(".nav-left").offset().left;
            $(".bottom-nav i").css({
                width: initIconWidth,
                left: initIconLeft
            });

            //tab选项卡的点击
            $(".bottom-nav>div").click(function () {
                let clickIconWidth = $(this).width();
                let clickIconLeft = $(this).offset().left;
                $(this).addClass("active").siblings().removeClass("active");
                $(this).parents(".bottom-content").find(".bottom-container>div")
                    .eq($(this).index())
                    .addClass("active")
                    .siblings().removeClass("active");
                $(".bottom-nav i").css({
                    width: clickIconWidth,
                }).animate({
                    left: clickIconLeft
                }, 200);
                if ($(".program>div").length === 0) {
                    getProgram(id, false)
                        .then(function () {
                            mainIScroll.refresh();
                            //全选按钮的显示
                            $(".all-selected").click(function () {
                                $(".tool-default").css("display", "none");
                                $(".tool-selected").css("display", "flex");
                                $(".num").css("display", "none");
                                $(".list-circle").css("display", "block");
                            });

                            //全选按钮的消失
                            $(".selected-right").click(function () {
                                $(".tool-default").css("display", "flex");
                                $(".tool-selected").css("display", "none");
                                $(".num").css("display", "block");
                                $(".list-circle").css("display", "none");
                            });

                            //单击和全选
                            $(".list-circle").click(function () {
                                $(this).parents(".sta").toggleClass("active");
                            });
                            $(".selected-left .circle").click(function () {
                                $(this).parents(".program").toggleClass("selected");

                                if (!$(this).parents(".program").hasClass("selected")) {
                                    $(this).parents(".program").find(".sta").removeClass("active");
                                } else {
                                    $(this).parents(".program").find(".sta").addClass("active");
                                }
                            });

                        })
                        .catch(function (e) {
                            console.log(e);
                        })
                }
                mainIScroll.refresh();
            });
        })
        .catch(function (e) {
            console.log(e);
        });

    //获取节目数据
    function getProgram(id, isSort) {
        return new Promise(function (resolve, reject) {
            DetailApis.getProgram(id, isSort)
                .then(function (res) {
                    let program = res.data;
                    $(res.data.programs).each(function (index, value) {
                        value.mainSong.formatDuration = formatDate("mm:ss", new Date(value.mainSong.duration))
                        value.formatCreateTime = formatDate("yyyy-MM-dd", new Date(value.createTime));
                        value.formatListenerCount = formatNum(value.listenerCount)
                    });
                    let programHtml = template("program", program);
                    $(".program").html(programHtml);
                    resolve();
                })
                .catch(function (e) {
                    reject(e)
                })
        })
    }
});