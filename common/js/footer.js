$(function () {
    let footArray = ["home", "video", "me", "friend", "account"];
    /*底部导航栏点击*/
    $(".footer-nav li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        let currentName = footArray[$(this).index()];
        window.location.href = `./../${currentName}/${currentName}.html?locateName=${currentName}&page=${$(this).index()}`;
        //同步顶部
        $(".header").removeClass().addClass("header " + currentName);
    });
});