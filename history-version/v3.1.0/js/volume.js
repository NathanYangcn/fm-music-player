function Volume(){
    this.init();
    this.bind();
}
Volume.prototype = {
    init: function(){
        // 声音进度条
        this.$horn = $('.extra>.horn');
        this.$volumeBar = $('.extra>.volume-bar');
        this.$volumeBarNow =$('.extra .volume-bar-now');
    },
    bind: function(){
        var self = this;
        this.setVolume(0.7);
        // 点击音量条，设置音量
        this.$volumeBar.on('click', function (e) {
            var percent = self.setInit(self.$volumeBar, e);
            self.setVolume(percent);
            self.setBar(self.$volumeBar, self.$volumeBarNow, percent);
        });
        // 点击按钮，快速设置静音与默认音量
        this.$horn.on('click', function () {
            self.setHorn();
        });
    },
    // 设置音量大小
    setVolume: function (cent) {
        audioObject.volume = cent;
        this.setBar(this.$volumeBar, this.$volumeBarNow, cent);
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
    // 快速调整音量大小：0 或 70%
    setHorn: function () {
        if( this.$horn.hasClass('icon-horn') ){
            this.setVolume(0);
            this.$horn.css('color', '#fff')
        }else if( this.$horn.hasClass('icon-mute') ){
            this.setVolume(0.7);
            this.$horn.css('color', 'red')
        }
        this.$horn.toggleClass('icon-horn');
        this.$horn.toggleClass('icon-mute');
    }
}