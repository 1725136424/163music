;(function (window) {
    class Progress {
        constructor(bar, progress, dot) {
            this.$bar = bar;
            this.$progress = progress;
            this.$dot = dot;
            this.backgroundOffset = bar.offset().left;
            this.minimumOffset = 0;
            this.maximumOffset = bar.width() - dot.width() / 2;
        }

        /*进度条的拖拽*/
        dragProgress(callback, touchend) {
            let that = this;
            /*进度条的拖拽*/
            this.$dot.on("touchstart", function (event) {
                $("body").on("touchmove.progress", function (event) {
                    let currentTouch = event.targetTouches[0];
                    let pageX = currentTouch.pageX;
                    let currentOffset = pageX - that.backgroundOffset;
                    if (currentOffset >= that.minimumOffset && currentOffset <= that.maximumOffset) {
                        if (currentOffset <= that.minimumOffset + 1) currentOffset = 0;
                        if (currentOffset >= that.maximumOffset - 1) currentOffset = that.maximumOffset;
                        let rate = parseFloat((currentOffset / that.maximumOffset).toFixed(2));
                        callback(rate)
                    }
                });
                event.stopPropagation();
            });

            this.$dot.on("touchend", function () {
                touchend && touchend();
                $("body").off("touchmove.progress");
            });
        }

        /*进度条的点击*/
        clickProgress(callback) {
            let that = this;
            this.$bar.on("touchstart", function (event) {
                let currentTouch = event.targetTouches[0];
                let pageX = currentTouch.pageX;
                let currentOffset = pageX - that.backgroundOffset;
                let rate = parseFloat((currentOffset / that.maximumOffset).toFixed(2));
                callback(rate);
            })

        }
        /*进度条的设置*/
        setProgress(rate) {
            this.$progress.css("width", rate * this.maximumOffset);
        }
    }
    window.Progress = Progress;
})(window);