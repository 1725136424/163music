$(function () {

    /*回显历史数据*/
    EchoHistory();

    /*关闭按钮的点击*/
    $(".close").click(function () {
        $(this).parents(".ad").remove();
    });

    /*搜索按钮的点击*/
    $(".search-icon").click(function () {
        let keyword = $.trim($(this).siblings("input").val());
        if (keyword) {
            /*数据搜索*/
            skipWindow(keyword);
        }
    });

    /*清空按钮的点击*/
    $(".delete").click(function () {
        clearHistory(localStorage, "history");
        $(".history-body").empty();
        $(".history").css("display", "none")
    });

    /*联想词汇的点击*/
    $(".search-association").on("click", "li", function () {
        let keyword = $(this).text().trim();
        skipWindow(keyword);
    });

    /*历史数据的点击*/
    $(".history-body li").click(function () {
        let keyword = $(this).text().trim();
        skipWindow(keyword);
    });

    /*热搜排行榜的点击*/
    $(".hot-history-body").on("click", "li", function () {
        let keyword = $(this).find(".song-name").text().trim();
        skipWindow(keyword);
    });

    /*获取热搜数据*/
    SearchHttp.getHotSearch()
        .then(function (res) {
            let hotSearchData = res.data;
            let html = template("hotSearch", hotSearchData)
            $(".hot-history-body").html(html);
            initSearchIScroll();
        })
        .catch(function (e) {
            console.log(e);
        });

    $(".input-search").on("input", throttle(function () {
        $(".search-main").css("display", "none");
        $(".search-keyWord").css("display", "block");
        let keyword = $.trim($(this).val());
        if (keyword) {
            SearchHttp.getHomeSearchSuggest(keyword)
                .then(function (res) {
                    let association = res.data.result;
                    $(".search-content").text(`搜索"${keyword}"`);
                    if (!association.allMatch) return;
                    let html = template("search-association", association);
                    $(".search-association").html(html);
                })
                .catch(function (e) {
                    throw new Error(e);
                })
        }
    }, 1000));

    function initSearchIScroll() {
        window.searchIscroll = new IScroll(".search-main", {
            mouseWheel: false,
            scrollbars: false,
        })
    }

    function skipWindow(keyword) {
        saveHistory(localStorage, keyword, "history");

        $(".search input").val("");

        EchoHistory();
        window.location.href = "./../searchDetail/searchDetail.html?keyword=" + keyword + "";
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