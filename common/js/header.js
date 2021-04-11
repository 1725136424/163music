$(function () {
    /*头部输入按钮的点击*/
    $(".input-search").on("focus", function () {
        $(this).parents(".header").addClass("active");
        $(".main").css({
            display: "none",
        });
        $(".search-temp").css({
            display: "block"
        });
        searchIscroll.refresh();
    });

    /*取消按钮的点击*/
    $(".header-cancel").click(function () {
        $(this).parents(".header").removeClass("active");
        $(".input-search").val("");
        $(".main").css({
            display: "block",
        });
        $(".search-temp").css({
            display: "none"
        });
        $(".search-main").css("display", "block");
        $(".search-keyWord").css("display", "none");
    });

    /*朋友界面导航点击*/
    $(".friend-toolBar>span").click(function () {
        let currentIndex = $(this).index();
        let offset = $(this).width();
        $(this).addClass("active").siblings().removeClass("active");
        $(".friend-toolBar>i").animate({
            left: currentIndex * offset
        }, 100)
    });
});