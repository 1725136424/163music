;(function (window) {
    axios.defaults.baseURL = 'http://music.it666.com:3666';
    axios.defaults.timeout = 4000;

    class WHttp {

        /*get请求*/
        static get(url = "", data = {}) {
            return new Promise(function (resolve, reject) {
                axios.get(url, {
                    params: data
                })
                    .then(function (res) {
                        resolve(res);
                    })
                    .catch(function (e) {
                        reject(e)
                    })
            })
        }

        /*post请求*/
        static post(url = "", data = {}) {
            return new Promise(function (resolve, reject) {
                axios.post(url, {
                    params: data
                })
                    .then(function (res) {
                        resolve(res);
                    })
                    .catch(function (e) {
                        reject(e);
                    })
            })
        }
    }

    class HomeHttp {
        static getBanner() {
            return WHttp.get("banner", {type: 2})
        }

        static getRecommend() {
            return WHttp.get("/personalized", {offset: 0, limit: 6});
        }

        static getExclusive() {
            return WHttp.get("/personalized/privatecontent");
        }

        static getAlbum() {
            return WHttp.get("/top/album", {offset: 0, limit: 6});
        }

        static getMv() {
            return WHttp.get("/personalized/mv");
        }

        static getDj() {
            return WHttp.get("/personalized/djprogram");
        }
    }

    class SearchHttp {
        static getHotSearch() {
            return WHttp.get("/search/hot/detail");
        }

        static getHomeSearchSuggest(keywords) {
            return WHttp.get("/search/suggest?keywords=" + keywords + "&type=mobile");
        }
    }

    class SearchApis {
        /*
        keywords: 需要搜索的内容
        offset: 从什么地方开始获取数据
        [1, 2, 3, 4, 5, 6, 7, 8 ,9, 10]
        limit: 从指定的位置开始取多少条数据
        type:
        // 1: 单曲,
        // 10: 专辑,
        // 100: 歌手,
        // 1000: 歌单,
        // 1002: 用户,
        // 1004: MV,
        // 1006: 歌词,
        // 1009: 电台,
        // 1014: 视频,
        // 1018:综合
        * */
        static getSearch(keywords = "", offset = 0, limit = 30, type = 1) {
            return WHttp.get("/search", {
                keywords: keywords,
                offset: offset,
                limit: limit,
                type: type
            });
        }
    }

    class MusicApis{
        static getSongDetail(ids){
            return WHttp.get("/song/detail", {
                ids: ids
            });
        }
        static getSongURL(id){
            return WHttp.get("/song/url", {
                id: id
            });
        }
        static getSongLyric(id){
            return WHttp.get("/lyric", {
                id: id
            });
        }
    }

    class DetailApis{

        static getDjRadio(id){
            return WHttp.get("/dj/detail", {
                rid: id
            });
        }
        /*
        asc: false返回的数据从新到旧
        asc: true返回的数据从旧到新
        * */
        static getProgram(id, asc=false){
            return WHttp.get("/dj/program", {
                rid: id,
                asc: asc
            });
        }
    }

    window.WHttp = WHttp;
    window.HomeHttp = HomeHttp;
    window.SearchHttp = SearchHttp;
    window.SearchApis = SearchApis;
    window.MusicApis = MusicApis;
    window.DetailApis = DetailApis;
})(window);