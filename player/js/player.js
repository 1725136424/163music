$(function () {
    let songs = getHistory(sessionStorage, "playList");
    let ids = [];
    for (let i = songs.length - 1; i >= 0; i--) {
        ids.push(songs[i].id)
    }
    let idsStr = ids.join(",");
    let mySwiper = null;
    let volumeProgress = null;
    let isInitVolumeProgress = false;
    let isDrag = false;
    let isScroll = false;
    let lyricHeight = 0;
    let timer = null;
    let play = new Play($("audio"), "order");

    $(".default").click(function () {
        $(this).parents(".body").addClass("isLyric");
        if (!isInitVolumeProgress) {
            volumeProgress = initVolume();
            isInitVolumeProgress = true;
        }
    });

    $(".lyric-area").click(function () {
        $(this).parents(".body").removeClass("isLyric");
    });

    $(".header-left").click(function () {
        window.history.back();
    });

    let timeProgress = initTime();

    /*播放按钮的点击*/
    $(".play").click(function () {
        if (play.isSameSong) {
            $(this).parents(".body-box").toggleClass("playing");
            if ($(this).parents(".body-box").hasClass("playing")) {
                //播放
                play.audio.play();
            } else {
                //暂停
                play.audio.pause();
            }
        } else {
            if (!$(this).parents(".body-box").hasClass("playing")) {
                $(this).parents(".body-box").addClass("playing")
            }
            play.audio.play();
            play.isSameSong = true;
        }
    });

    //静音按钮的点击
    $(".volume-icon").click(function () {
        if (play.audio.volume > 0) {
            play.audio.volume = 0;
            volumeProgress.setProgress(0);
        } else {
            play.audio.volume = play.defaultVolume;
            volumeProgress.setProgress(play.defaultVolume);
        }
    });

    //上一首点击
    $(".pre").click(function () {
        mySwiper.swipeDirection = "prev";
        $(".default-top img").css({
            transform: "rotate(-30deg)"
        });
        mySwiper.slidePrev();
    });

    //下一首点击
    $(".next").click(function () {
        mySwiper.swipeDirection = "next";
        $(".default-top img").css({
            transform: "rotate(-30deg)"
        });
        mySwiper.slideNext();
    });

    //歌词界面歌词线的点击
    $(".lyric-time-line-left img").click(function (event) {
         let currentStr = $(this).parents(".lyric-time-line-left").siblings(".lyric-time-line-right").text();
         let timeArray = currentStr.split(":");
         let totalTime = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
         let rate = parseFloat((totalTime / play.durations).toFixed(2));
         play.audio.currentTime = play.durations * rate;
         timeProgress.setProgress(rate);
         if (!$(".body-box").hasClass("playing")) {

             $(".play").click();
         }
        play.isOptionProgress = true;
         event.stopPropagation();
    });

    //播放模式的点击
    $(".model").click(function () {
        if ($(this).hasClass("order")) {
            $(this).attr("class", "model random");
            $(".songList-top-left i").attr("class", "model random");
            $(".songList-top-left span").text("随机播放(" + songs.length + ")")
            play.model = "random";
        } else if ($(this).hasClass("random")) {
            $(this).attr("class", "model single");
            $(".songList-top-left i").attr("class", "model single");
            $(".songList-top-left span").text("单曲循环(" + songs.length + ")")
            play.model = "single";
        } else if ($(this).hasClass("single")) {
            $(this).attr("class", "model order");
            $(".songList-top-left i").attr("class", "model order");
            $(".songList-top-left span").text("列表循环(" + songs.length + ")")
            play.model = "order";
        }

    });

    //modalIScroll的创建
    let modalIScroll = new IScroll(".songList-center", {
        mouseWheel: false,
        scrollbars: true,
    });

    //菜单的点击
    $(".list").click(function () {
        if ($(".songList-center-IScroll li").length !== songs.length) {
            //载入菜单中的数据
            $(".songList-top-left span").text("列表循环(" + songs.length + ")");
            let html = template("modal", songs);
            $(".songList-center-IScroll").html(html);
            $(".songList-center-IScroll li").eq(mySwiper.realIndex)
                .addClass("playing")
                .siblings().removeClass("playing");

            //菜单歌曲的点击
            $(".songList-center-IScroll li").click(function () {
                $(this).addClass("playing").siblings().removeClass("playing");
                $(".default-top img").css({
                    transform: "rotate(-30deg)"
                });
                mySwiper.swipeDirection = "next";
                mySwiper.slideToLoop($(this).index());
            });

            //菜单删除的点击
            $(".songList-center-right img").click(function () {

                //移出数组中的数据
                songs.splice(songs.length - 1 - $(this).parents("li").index(), 1);

                //更新session
                clearHistory(sessionStorage, "playList");

                //判断歌曲是否全部清空
                if (!songs.length) {
                    $(".clearPlayList").click();
                    return;
                }
                songs.forEach(function (value) {
                    saveHistory(sessionStorage, value, "playList");
                });
                if (mySwiper.realIndex === $(this).parents("li").index()) {
                    setTimeout(function () {
                        $(".next").click();
                    }, 100)
                }

                //移出swiper
                mySwiper.removeSlide($(this).parents(".subLi").index());

                //UI界面的删除
                $(this).parents(".subLi").remove();
                return false;
            });
            modalIScroll.refresh();
        }
        $(".songList-modal").animate({
            height: "100%"
        }, 50, function () {
            $(".songList").animate({
                height: "46%"
            }, 200)
        });
    });

    //modal点击
    $(".temp-modal").click(function () {
        $(".songList-footer").click();
        return false;
    });

    //清空播放列表
    $(".clearPlayList").click(function () {
        clearHistory(sessionStorage, "playList");
        window.location.href = "./../home/home.html";
    });

    //关闭按钮的点击
    $(".songList-footer").click(function () {
        $(".songList").animate({
            height: "0%"
        }, 200, function () {
            $(".songList-modal").animate({
                height: "0%"
            }, 50);
        })
        return false;
    });

    //歌曲元数据加载完毕
    play.loadedMetaData(function (durations, formatTime) {
        $(".durations").text(formatTime);
    });

    //歌曲导入完成
    play.canPlay(function () {
        if (!play.isOptionProgress) {
            $(".play").click();
        }
    });

    //歌曲正在播放
    play.timeUpdate(function (currentTime, formatTime) {
        $(".current-time").text(formatTime);
        if (!isDrag) {
            let currentRate = parseFloat((currentTime / play.durations).toFixed(6));
            timeProgress.setProgress(currentRate);
        }
        let parseTime = parseInt(currentTime);
        let currentLyric = $(".lyric-center-in .lyric" + parseTime + "");
        if (currentLyric.length) {
            lyricHeight = parseFloat(currentLyric.css("height"));
            let offset = lyricHeight * currentLyric.index();
            currentLyric.addClass("active").siblings().removeClass("active");
            if (!isScroll) {
                lyricScroll.scrollTo(0, -offset, 300);
            }
        }
    });

    //歌曲播放完毕
    play.ended(function () {
        let modal = play.model;
        if (modal === "order") {
            //顺序播放
            $(".default-top img").css({
                transform: "rotate(-30deg)"
            });
            $(".next").click();
        } else if (modal === "single") {
            //单曲播放
            play.isSameSong = false;
            $(".play").click();
        } else if (modal === "random") {
            let random;
            let currentIndex = mySwiper.realIndex;
            for (; ;) {
                random = getRandomIntInclusive(0, 1);
                if (currentIndex !== random) break;
            }
            $(".default-top img").css({
                transform: "rotate(-30deg)"
            });
            mySwiper.swipeDirection = "next";
            mySwiper.slideToLoop(random);
        }
    });

    /*创建歌词IScroll*/
    let lyricScroll = new IScroll('.lyric-center', {
        mouseWheel: false,
        scrollbars: false,
        probeType: 2,
    });
    lyricScroll.on("scroll", function () {
        if (this.y <= 0) {
            let scrollY = Math.abs(this.y - lyricHeight / 4);
            let currentLyricIndex = Math.ceil(scrollY / lyricHeight + "");
            $(".lyric-center-in p").eq(currentLyricIndex - 1).addClass("hover").siblings().removeClass("hover");
            let currentTime = extractNum($(".lyric-center-in p").eq(currentLyricIndex - 1).attr("class"));
            let formatTime = formatDate("mm:ss", new Date(currentTime * 1000));
            $(".lyric-time-line-right").text(formatTime);
        }
        $(".lyric-time-line").css("display", "flex");
        isScroll = true;
    });
    lyricScroll.on("scrollEnd", function () {
            timer = setTimeout(function () {
            clearInterval(timer);
            $(".lyric-center-in p").removeClass("hover");
            $(".lyric-time-line").css("display", "none");
            isScroll = false;
        }, 2000);
    });

    //歌曲信息的获取
    MusicApis.getSongDetail(idsStr)
        .then(function (res) {
            let songData = res.data.songs;
            let firstSong = songData[0];
            let songId = firstSong.id;

            //初始化歌曲信息
            initSongUI(firstSong);

            //初始化音源
            initSongSource(songId);

            //初始化歌词
            initLyric(songId);

            /*初始化歌曲封面 swiper*/
            songData.forEach(value => {
                let $silder = $(` <div class="swiper-slide">
                                        <img alt="" class="disc" src="images/player-it666-disc.png">
                                        <img alt="" class="pic" src="${value.al.picUrl}">
                                    </div>`);
                $(".swiper-wrapper").append($silder);
            });

            //创建swiper
            mySwiper = new Swiper('.swiper-container', {
                loop: true, // 循环模式选项
                observer: true,
                observeParents: true,
                observeSlideChildren: true,
                on: {
                    slideChangeTransitionEnd: function () {
                        if (this.swipeDirection) {
                            $(".default-top img").css({
                                transform: ""
                            });
                            let activeIndex = this.realIndex;
                            $(".songList-center-IScroll .subLi").eq(activeIndex)
                                .addClass("playing")
                                .siblings().removeClass("playing");
                            let currentId = songs[songs.length - 1 - activeIndex].id;
                            //初始化歌曲信息
                            MusicApis.getSongDetail(currentId)
                                .then(function (res) {
                                    let songData = res.data.songs[0];
                                    initSongUI(songData);
                                })
                                .catch(function (e) {
                                    console.log(e);
                                });
                            initSongSource(currentId);
                            initLyric(currentId);
                        }
                    },
                }
            });

            //注册滑动事件
            $(".swiper-container").on("touchmove.wj", function () {
                $(".default-top img").css({
                    transform: "rotate(-30deg)"
                })
            });
        })
        .catch(function (e) {
            console.log(e);
        });


    /*初始化声音滚动条*/
    function initVolume() {
        /*创建进度条对象*/
        let progress = new Progress($(".volume-progress-bar"), $(".volume-progress"), $(".volume-dot"));

        //初始化默认音乐声音大小
        play.audio.volume = play.defaultVolume;
        progress.setProgress(play.defaultVolume);

        /*进度条的拖拽*/
        progress.dragProgress(function (rate) {
            //设置声音
            play.audio.volume = rate;
            play.defaultVolume = rate;
            progress.setProgress(rate);

        });

        /*进度条的点击*/
        progress.clickProgress(function (rate) {
            //设置声音
            play.audio.volume = rate;
            play.defaultVolume = rate;
            progress.setProgress(rate);
        });
        return progress;
    }

    /*初始化时间滚动条*/
    function initTime() {
        /*创建进度条对象*/
        let timeProgress = new Progress($(".time-progress-bar"), $(".time-progress"), $(".time-dot"));
        /*进度条的拖拽*/
        let rate;
        timeProgress.dragProgress(function (callbackRate) {
            isDrag = true;
            rate = callbackRate;
            timeProgress.setProgress(rate);
        }, function () {
            play.audio.currentTime = play.durations * rate;
            isDrag = false;
            play.isOptionProgress = true;
        });

        /*进度条的点击*/
        timeProgress.clickProgress(function (rate) {
            play.audio.currentTime = play.durations * rate;
            timeProgress.setProgress(rate);
            play.isOptionProgress = true;
        });
        return timeProgress;
    }

    //格式化歌词
    function formatLyric(lyric) {
        let lyrics = lyric.split("\n");
        let timeReg = /\[\d*:\d*\.\d*\]/g;
        let minReg = /\[\d*/;
        let secReg = /:\d*/;
        let formatLyric = {};
        lyrics.forEach(function (value) {
            let timeStr = value.match(timeReg);
            if (!timeStr) return;
            timeStr = timeStr[0];
            let min = parseInt(timeStr.match(minReg)[0].replace("[", ""));
            let sec = parseInt(timeStr.match(secReg)[0].replace(":", ""));
            let totalTime = min * 60 + sec;
            let lyricStr = value.replace(timeReg, "").trim();
            if (!lyricStr) return;
            formatLyric[totalTime] = lyricStr;
        });
        return formatLyric;
    }

    //确定歌词滚动的最大高度
    function refreshLyricIScroll() {
        lyricScroll.refresh();
        lyricScroll.maxScrollY -= $(".lyric-center").height() - $(".lyric-center-in p").eq(0).height();
    }

    //初始化歌曲界面信息
    function initSongUI(song) {
        /*初始化头部数据*/
        $(".song-name").text(song.name);
        let artists = song["ar"];
        let artistName = "";
        artists.forEach(value => {
            artistName += value.name;
        });
        $(".song-artist").text(artistName);
    }

    //初始化音源
    function initSongSource(id) {
        //歌曲的获取
        MusicApis.getSongURL(id)
            .then(function (res) {
                let song = res.data.data[0];
                if ($("audio source").length) {
                    $("audio source").remove();
                    play.audio.load();
                    play.isSameSong = false;
                    play.isOptionProgress = false;
                }
                //导入音源
                let $source = $(`<source src="${song.url}" type="audio/${song.type}">`);
                $("audio").append($source);
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    //初始化歌词
    function initLyric(id) {
        //歌词的获取
        MusicApis.getSongLyric(id)
            .then(function (res) {
                $(".lyric-center-in").html("");
                let lyric = res.data.lrc;
                let formatLyrics = formatLyric(lyric.lyric);
                for (let key in formatLyrics) {
                    let $p = $(`<p class="lyric${key}">${formatLyrics[key]}</p>`);
                    $(".lyric-center-in").append($p);
                }
                refreshLyricIScroll();
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    //提取字符串的中的数字
    function extractNum(str, modal) {
        let numReg = new RegExp("\\d+", modal);
        if (!str) return;
        let num = str.match(numReg);
        if (modal) {
            return num;
        } else {
            return num[0];
        }
    }
});