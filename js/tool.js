;(function (window) {
    /*函数防抖*/
    function debounce(fn, delay) {
        let timeId = null;
        return function (event) {
            let self = this;
            let arg = arguments;
            timeId && clearInterval(timeId);
            timeId = setTimeout(function () {
                fn.apply(self, arg)
            }, delay || 1000)
        }
    }

    /*函数节流*/
    function throttle(fn, delay) {
        let timeId = null;
        let flag = true;
        return function (event) {
            if (!flag) return;
            flag = false;
            let self = this;
            let arg = arguments;
            timeId && clearInterval(timeId);
            timeId = setTimeout(function () {
                fn.apply(self, arg)
                flag = true;
            }, delay || 1000)
        }
    }

    /*日期格式格式化*/
    function formatDate(format, date) {
        let obj = {
            "y+": date.getFullYear(),
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds()
        };
        for (let key in obj) {
            let currentReg = new RegExp(key);
            let matchStr = format.match(currentReg);
            if (!matchStr) continue;
            else matchStr = matchStr[0];
            let strLength = matchStr.length;
            if (matchStr.includes("y")) {
                //年份处理
                format = format.replace(matchStr, (obj[key] + "").substr(4 - strLength));
            } else {
                //其他处理
                if (strLength === 1) {
                    format = format.replace(matchStr, obj[key]);
                } else {
                    let length = (obj[key] + "").length;
                    format = format.replace(matchStr, ("00" + obj[key]).substr(length));
                }
            }
        }
        return format;
    }

    /*获取url参数*/
    function getQueryVariable(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] === variable) {
                return pair[1];
            }
        }
        return (false);
    }

    /*格式化次数*/
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

    /*保存历史数据*/
    function saveHistory(db, data, dataName) {
        let hasSame = false;
        if (data) {
            //保存历史数据
            let history = db.getItem(dataName);
            if (!history) {
                //第一次
                history = [];
            } else {
                //第二次
                history = JSON.parse(history);
            }
            for (let i = 0; i < history.length; i++) {
                if (JSON.stringify(history[i]) === JSON.stringify(data)) {
                    history.splice(i, 1);
                    break;
                }
            }
            history.push(data);
            db.setItem(dataName, JSON.stringify(history));
        }
    }

    /*获取历史数据*/
    function getHistory(db, dataName) {
        return JSON.parse(db.getItem(dataName));
    }

    /*删除历史数据*/
    function clearHistory(db, dataName) {
        db.removeItem(dataName);
    }


    /*得到一个两数之间的随机整数，包括两个数在内*/
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
    }

    window.getQueryVariable = getQueryVariable;
    window.formatDate = formatDate;
    window.throttle = throttle;
    window.debounce = debounce;
    window.saveHistory = saveHistory;
    window.getHistory = getHistory;
    window.clearHistory = clearHistory;
    window.formatNum = formatNum;
    window.getRandomIntInclusive = getRandomIntInclusive;
})(window);