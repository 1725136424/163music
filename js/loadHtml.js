;(function (window) {
    function loadHeader() {
        $(".header-box").load("./../common/header.html", function () {
            /*导入头部js*/
            let script = document.createElement("script");
            script.src = "./../common/js/header.js";
            document.body.appendChild(script);
            let locate = getQueryVariable("locateName");
            if (!locate) {
                locate = "home"
            }
            /*同步home屏显示*/
            $(".header").removeClass().addClass("header " + locate);
        });
    }
    function loadFooter() {
        $(".footer-box").load("./../common/footer.html", function () {
            /*底部头部js*/
            let script = document.createElement("script");
            script.src = "./../common/js/footer.js";
            document.body.appendChild(script);

            let page = getQueryVariable("page");

            if (!page) {
                page = 0
            };
            /*同步底部动效*/
            $(".footer-nav>li").eq(page).addClass("active").siblings().removeClass("active");
        });
    }
    function loadSearch() {
        $(".search-temp").load("./../common/search.html", function () {
            /*导入头部js*/
            let script = document.createElement("script");
            script.src = "./../common/js/search.js";
            document.body.appendChild(script);
        });

    }
    window.loadHeader = loadHeader;
    window.loadFooter = loadFooter;
    window.loadSearch = loadSearch;
})(window);