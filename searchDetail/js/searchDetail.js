$(function () {
    let keyword = decodeURI(getQueryVariable("keyword"));
    /*初始化IScroll定义数据*/
    let backMaxScroll = 0;
    let mainIScroll = null;
    let isTargetUp = false;
    let isRefresh = false;

    /*数据获取的条目*/
    let offset = 0;
    let limit = 30;
    let totalCount = 0;

    loadFooter();

    initInput();

    initNav();

    initMain();

    initEvent();

    initMainIScroll();

    initComposite();

    /*初始化头部输入框*/
    function initInput() {
        $(".header-right input").val(keyword);

        /*输入框点击事件*/
        $(".search-icon").click(function () {
            let keyword = $.trim($(this).siblings("input").val());
            if (keyword) {
                saveHistory(localStorage, keyword, "history");

                $(this).siblings("input").val("");

                EchoHistory();

                /*数据搜索*/
                window.location.href = "./../searchDetail/searchDetail.html?keyword=" + keyword + "";
            }
        });

        /*退回点击*/
        $(".header-left img").click(function () {
            window.history.back();
        });
        $(".search-close").click(function () {
            $(".header-left img").trigger("click");
        });
    }

    /*初始化综合界面*/
    function initComposite() {
        $(".pullUp .pullUpChild").css("display", $(".main-in .active").data("isExistPullUp"));
        getCompositeData(keyword, undefined, undefined, 1018);
    }

    /*初始化导航栏*/
    function initNav() {
        /*初始化导航栏*/
        let totalWidth = 0;
        let firstWidth = $(".nav-box li.active").width();
        let firstOffset = $(".nav-box li.active").position().left;
        let navWidth = $(".nav").width();
        $(".nav-box li").each(function (index, value) {
            totalWidth += value.offsetWidth;
        });
        $(".nav-box").css({
            width: totalWidth,
        });
        $(".nav-box i").css({
            width: firstWidth,
            left: firstOffset
        });

        /*内容区域*/
        /*初始化导航IScroll*/
        let navIScroll = new IScroll(".nav", {
            mouseWheel: false,
            scrollbars: false,
            scrollX: true,
            scrollY: false,
        });
        /*导航栏的点击*/
        $(".nav-box li").click(function () {
            let currentLiOffset = $(this).position().left;
            let currentLiWidth = $(this).width();
            $(this).addClass("active").siblings().removeClass("active");
            $(".nav-box i").animate({
                left: currentLiOffset,
                width: currentLiWidth,
            }, 200);

            /*同步导航栏动效*/
            if (currentLiOffset + currentLiWidth / 2 >= navWidth / 2) {
                let offset = (navWidth / 2) - (currentLiOffset + currentLiWidth / 2);
                if (offset <= navIScroll.maxScrollX) {
                    navIScroll.scrollTo(navIScroll.maxScrollX, 0, 200);
                } else {
                    navIScroll.scrollTo(offset, 0, 200);
                }

            } else {
                navIScroll.scrollTo(0, 0, 200);
            }
            let name = $(this).data("name");

            $("." + name).addClass("active").siblings().removeClass("active");
            mainIScroll.refresh();
            backMaxScroll = mainIScroll.maxScrollY;
            /*开始加载本页面数据*/

            /*判断*/
            mainIScroll.scrollTo(0, $("." + name).data("scrollEnd"));
            $(".pullUp .pullUpChild").css("display", $("." + name).data("isExistPullUp"));
            if (!$("." + name + " .list li").length) {
                let type = $("." + name).data("id");
                offset = 0;
                mainIScroll.on("scroll", function () {
                    let scrollType = $(".main-in .active").data("id");
                    if (scrollType === 1) {
                        let offsetY = this.y;
                        if (offsetY <= 0) {
                            $(".tool").css({
                                top: -offsetY,
                            });
                        } else {
                            $(".tool").css({
                                top: 0,
                            });
                        }
                    }
                });
                getData(keyword, offset, limit, type);
            }
        });
    }

    /*初始化主体内容*/
    function initMain() {
        /*初始化主体内容高度*/
        let mainHeight = $("body").height() - $(".header").height() - $(".nav").height();

        $(".main").css({
            height: mainHeight
        });
    }

    /*初始化事件*/
    function initEvent() {

        $(".tool-right").click(function () {
            $(this).parents(".song").toggleClass("selected");
        });

        /*全选按钮的点击*/
        $(".circle").click(function () {
            $(this).parents(".song").toggleClass("click");
        });

        /*li标签的点击*/
        $(".song").on("click", ".list li", function () {
            let songId = $(this).data("musicId");
            let songName = $(this).data("musicName");
            let songArtist = $(this).data("musicArtist");
            let song = {
                id: songId,
                name: songName,
                artist: songArtist
            };
            saveHistory(sessionStorage, song, "playList");
            window.location.href = "./../player/player.html";
        });


        $(".list").on("click", "li .button", function (event) {
            $(this).parents(".sta").toggleClass("click");
            return false;
        });

        //播放全部点击
        $(".tool-left .normal").click(function () {
            let selectedLi = null;
            if ($(".main-in .song").hasClass("click")) {
                selectedLi = $(".song .list li");
            } else {
                selectedLi = $(".song .list li.click");
            }
            selectedLi.each(function (index, value) {
                let songId = $(value).data("musicId");
                let songName = $(value).data("musicName");
                let songArtist = $(value).data("musicArtist");
                let song = {
                    id: songId,
                    name: songName,
                    artist: songArtist
                };
                saveHistory(sessionStorage, song, "playList");
                window.location.href = "./../player/player.html";
            })

        });

        //综合界面事件
        $(".list").on("click", ".compositeList", function () {
            let liClass = $(this).attr("class").replace("compositeList", "")
                .replace("Composite", "")
                .trim();
            let currentNav = $(".nav-box #" + liClass);
            if (currentNav.length) {
                currentNav.click();
            }

        })

        //主播电台点击
        $(".djRadio").on("click", ".list>li", function () {
            let djId = $(this).data("djId")
            window.location.href = "./../djDetail/djDetail.html?id="+djId;
        })
    }

    /*初始化内容IScroll*/
    function initMainIScroll() {
        mainIScroll = new IScroll(".main", {
            mouseWheel: false,
            scrollbars: false,
            probeType: 3,
        });
        /*主体内容IScroll滚动*/
        let pullUpHeight = $(".pullUp").height();
        backMaxScroll = mainIScroll.maxScrollY;
        mainIScroll.on("scroll", function () {
            let offsetY = this.y;
            let targetHeight = backMaxScroll - pullUpHeight;
            if (!($(".main-in .active").data("isExistPullUp") === "none")) {
                if (offsetY <= targetHeight) {
                    if (!isTargetUp) {
                        $(".pullUp span").text("松手加载更多");
                        this.maxScrollY = targetHeight;
                        isTargetUp = true;
                    }
                }
            }
        });

        /*结束滚动*/
        mainIScroll.on("scrollEnd", function () {
            $(".main-in>.active").data("scrollEnd", this.y);
            /*下拉加载数据*/
            if (isTargetUp && !isRefresh) {
                isRefresh = true;
                $(".pullUp span").text("加载中...");
                let currentType = $(".main-in>.active").data("id");
                getData(keyword, offset, limit, currentType)
            }
        });
    }

    /*获取网络数据*/
    function getData(keyword, start, end, type) {
        SearchApis.getSearch(keyword, start, end, type)
            .then(function (res) {
                if (offset !== 0) {
                    mainIScroll.maxScrollY = backMaxScroll;
                    isTargetUp = false;
                    isRefresh = false;
                    $(".pullUp span").text("上拉加载更多");
                }
                let data = res.data.result;
                /*数据越界处理*/
                if (data["songCount"]) {
                    totalCount = data["songCount"];
                } else if (data["artistCount"]) {
                    totalCount = data["artistCount"];
                } else if (data["albumCount"]) {
                    totalCount = data["albumCount"];
                } else if (data["playlistCount"]) {
                    totalCount = data["playlistCount"];
                } else if (data["djRadioCount"]) {
                    totalCount = data["djRadioCount"];
                } else if (data["userprofileCount"]) {
                    totalCount = data["userprofileCount"];
                }
                if (offset >= totalCount) {
                    $(".pullUp .pullUpChild").css("display", "none");
                    $(".main-in .active").data("isExistPullUp", "none");
                    mainIScroll.scrollTo(0, backMaxScroll, 200);
                    return 0;
                }
                offset += limit;
                /*视频数据单独处理*/
                if (data["videos"]) {
                    $.each(data["videos"], function (index, value) {
                        value.formatPlayTime = formatNum(value.playTime);
                        value.formatDurationms = formatDate("mm:ss", new Date(value.durationms));
                    });
                }
                /*专辑数据处理*/
                if (data["albums"]) {
                    $.each(data["albums"], function (index, value) {
                        value.formatPublishTime = formatDate("yyyy-MM-dd", new Date(value.publishTime));
                    });
                }
                /*歌单界面处理*/
                if (data["playlists"]) {
                    $.each(data["playlists"], function (index, value) {
                        value.formatPlayCount = formatNum(value.playCount);
                    });
                }
                let currentActive = $(".main-in .active").attr("class").replace("active", "").trim();
                let html = template(currentActive + "Data", data);
                let musicListHtml = $(".main-in .active .list").html();
                musicListHtml += html;
                $(".main-in .active .list").html(musicListHtml);
                if (totalCount <= limit) {
                    $(".pullUp .pullUpChild").css("display", "none");
                    $(".main-in .active").data("isExistPullUp", "none");
                }
                mainIScroll.refresh();
                backMaxScroll = mainIScroll.maxScrollY;
            })
            .catch(function (e) {
                console.log(e);
            })
    }

    /*获取综合界面数据*/
    function getCompositeData(keyword, start, end, type) {
        SearchApis.getSearch(keyword, start, end, type)
            .then(function (res) {
                let compositeData = res.data.result;
                let flagIndex = 0;
                /*处理数据*/
                compositeData["formatOrder"] = [];
                $.each(compositeData["order"], function (index, value) {
                    if (value !== "mlog" && value !== "talk") {
                        compositeData["formatOrder"][flagIndex++] = value;
                    }
                });
                $.each(compositeData.song.songs, function (indx, value) {
                    value.artists = value.ar;
                    value.album = value.al;
                });
                compositeData.playList.playlists = compositeData.playList.playLists;
                compositeData.user.userprofiles = compositeData.user.users;
                let html = template("compositeData", compositeData);
                $(".composite .list").html(html);
                /*添加内容模板*/
                $.each(compositeData["formatOrder"], function (index, value) {
                    let currentData = compositeData[value];
                    let currentTemplateStr = value + "Data";
                    if (currentTemplateStr === "artistData")
                        currentTemplateStr = "singerData";
                    let currentHtml = template(currentTemplateStr, currentData);
                    $("#" + value + "Composite").html(currentHtml);
                });
                mainIScroll.refresh();
                backMaxScroll = mainIScroll.maxScrollY;
            })
            .catch(function (e) {
                console.log(e);
            })
    }

    /*回显历史数据*/
    function EchoHistory() {
        if (getHistory(localStorage, "history")) {
            $(".history").css("display", "block");
            //回显历史数据
            $(".history-body").empty();
            $.each(getHistory(localStorage, "history"), function (index, value) {
                let $li = $("<li>" + value + "</li>");
                $(".history-body").append($li);
            })
        } else {
            $(".history").css("display", "none")
        }

    }

});