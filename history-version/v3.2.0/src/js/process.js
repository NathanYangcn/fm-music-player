/*
 ** 声音进度条、音频进程进度条、音频时间展示
 */
var MusicInfor = require('./music-infor').MusicInfor;

function Process() {
    this.init();
    this.bind();
}
Process.prototype = {
    init: function () {
        this.$processBar = $('.process .process-bar');
        this.$processBarNow = $('.process .process-bar-now');
        this.$timeNow = $('.process .time-now');
        this.$timeTotal = $('.process .time-total');
    },
    bind: function () {
        var self = this;
        var isLocking = false;// 状态锁
        $(MusicInfor.audioObject).on('playing',function () {
            self.setTime(MusicInfor.audioObject.currentTime, self.$timeNow);
            self.setTime(MusicInfor.audioObject.duration, self.$timeTotal);
        });
        MusicInfor.audioObject.ontimeupdate = function(){
            if(isLocking) return;
            isLocking = true;
            var percent = Math.ceil(MusicInfor.audioObject.currentTime) / Math.ceil(MusicInfor.audioObject.duration);
            MusicInfor.showLyric();
            self.setTime(MusicInfor.audioObject.currentTime, self.$timeNow);
            self.setBar(self.$processBar, self.$processBarNow, percent);
            setTimeout(function(){
                isLocking = false
            }, 900)
        };
        // 点击音频进程条，设置音频进程
        this.$processBar.on('click', function (e) {
            var percent = self.setInit(self.$processBar, e);
            self.setProcess( percent );
            self.setBar(self.$processBar, self.$processBarNow, percent);
            MusicInfor.audioObject.play();
            MusicInfor.showLyric();
        });
    },
    // 设置音频进程
    setProcess: function (cent) {
        MusicInfor.audioObject.currentTime = cent * MusicInfor.audioObject.duration;
    },
    // 初始化进度条信息：计算要设置的百分比
    setInit: function ($node, e) {
        var totalWidth = $node[0].offsetWidth;
        var offsetWidth = e.offsetX;
        return (offsetWidth / totalWidth);
    },
    // 设置进度条长度
    setBar: function ($ct, $ele, cent) {
        var totalWidth = parseInt( $ct.css("width") );
        $ele.animate({
            "width": cent * totalWidth
        });
    },
    // 初始化时间后展示
    setTime: function (timer, $node) {
        var sec = Math.ceil(timer);
        var result = this.timeConver(sec);
        $node.text(result);
    },
    // 时间格式转换器
    timeConver: function (sec) {
        var secondsTotal = sec;
        var seconds = secondsTotal % 60 + '';
        var minutesTotal = Math.floor(secondsTotal / 60);
        var minutes = minutesTotal % 60 + '';
        var result = '';
        minutes = minutes.length==2 ? minutes : '0'+minutes;
        seconds = seconds.length==2 ? seconds : '0'+seconds;
        result = result + minutes + ':' + seconds;
        return result;
    }
};

module.exports.Process = Process;