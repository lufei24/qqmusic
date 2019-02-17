(function (window) {
    function Play($audio) {
        return new Play.prototype.init($audio);
    }
    Play.prototype = {
        constructor: Play,
        musicList: [],
        showMusic: function () {
            console.log(this.musicList);
        },
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        count: -1,
        prevMusic: function () {
            var index = this.count - 1;
            if (index < 0) {
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextMusic: function () {
            var index = this.count + 1;
            if (index >= this.musicList.length) {
                index = 0;
            }
            return index;
        },
        playMusic: function (index, music) {
            if (this.count == index) {
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                this.$audio.attr('src', music.link_url);
                this.audio.play();
                this.count = index;
            }
        },
        removeMusic: function (index) {
            this.musicList.splice(index, 1);
            if (index < this.count) {
                this.count = this.count - 1;
            }
        },
        musicTimeUpdate: function (callback) {
            var $this = this;
            this.$audio.on('timeupdate', function () {
                setTimeout(function () {
                    var duration = $this.audio.duration;
                    var current = $this.audio.currentTime;
                    var timeStr = $this.durationOrCurrent(duration, current);
                    callback(duration, current, timeStr);
                }, 50);
            })
        },
        durationOrCurrent: function (duration, current) {
            var allMin = parseInt(duration / 60);
            var allSec = parseInt(duration % 60);
            var curMin = parseInt(current / 60);
            var curSec = parseInt(current % 60);
            if (allMin < 10) {
                allMin = '0' + allMin;
            }
            if (allSec < 10) {
                allSec = '0' + allSec;
            }
            if (curMin < 10) {
                curMin = '0' + curMin;
            }
            if (curSec < 10) {
                curSec = '0' + curSec;
            }
            
            return curMin + ':' + curSec + ' / ' + allMin + ':' + allSec;
        },
        musicTeekTo : function(value){
            if(isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVolumeStop : function(value){
            if(isNaN(value)) return;
            
            this.audio.volume = value; 
        }
    }
    Play.prototype.init.prototype = Play.prototype;
    window.Play = Play;
})(window);