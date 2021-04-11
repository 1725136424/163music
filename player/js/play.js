;(function (window) {
    class Play {
        constructor(audio, modal) {
            this.$audio = audio;
            this.audio = audio.get(0);
            this.durations = 0;
            this.isOptionProgress = false;
            this.isSameSong = true;
            this.model = modal;
            this.defaultVolume = 0.5;
        }

        //元数据加载完毕
        loadedMetaData (callback) {
            let that = this;
            this.$audio.on("loadedmetadata", function () {
                that.durations = this.duration;
                let formatDurations = formatDate("mm:ss", new Date(that.durations * 1000));
                callback(that.durations, formatDurations);
            });
        }

        //视频是否能够播放
        canPlay(callback) {
            let that = this;
            this.$audio.on("canplay", function () {
                callback();
            })
        }

        //视频正在播放
        timeUpdate(callback) {
            let that = this;
            this.$audio.on("timeupdate", function () {
                let currentTime = this.currentTime;
                let currentTimeStr = formatDate("mm:ss", new Date(currentTime * 1000));
                callback(currentTime, currentTimeStr)
            })
        }

        //视频播放结束
        ended(callback) {
            let that = this;
            this.$audio.on("ended", function () {
                callback();
            })
        }

    }

    window.Play = Play;
})(window);