(function (window) {
    function Progress($progressBar, $progressLine, $progressDot) {
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function ($progressBar, $progressLine, $progressDot) {
            this.$progressBar = $progressBar,
                this.progressBar = $progressBar.get(0),
                this.$progressLine = $progressLine,
                this.progressLine = $progressLine.get(0),
                this.$progressDot = $progressDot
            this.progressDot = $progressDot.get(0)
        },
        isMove : false,
        progressBarClick: function (callback) {
            var $this = this;
            this.$progressBar.on('click', function (e) {
                var left = $(this).offset().left;
                var clickLeft = e.pageX;
                var LineLeft = clickLeft - left + 'px';
                $this.$progressLine.css('width', LineLeft);

                var value = parseInt($this.$progressLine.css('width')) / parseInt($(this).css('width'));
                callback(value);
            });
        },
        progressDotMove: function (callback) {
            var $this = this;
            var barWidth = this.$progressBar.width();
            this.$progressDot.on('mousedown', function () {
                var left = $this.$progressLine.offset().left;
                $(document).on('mousemove', function (e) {
                    var clickLeft = e.pageX;
                    var LineLeft = 0;
                    LineLeft += clickLeft - left;
                    if( LineLeft >=0 && LineLeft <= barWidth){
                        $this.$progressLine.css('width', LineLeft + 'px');
                    }
                })
            });
            $(document).on('mouseup', function () {
                var value = parseInt($this.$progressLine.css('width')) / parseInt($this.$progressBar.css('width'));
                callback(value);
                $(document).off('mousemove');
            });
        },
        autoProgress : function(value){
            $('.song_ing').css('width', value +"%");
        }

    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)