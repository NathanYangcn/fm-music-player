function PannelCtrl() {
    this.init();
    this.bind();
}
PannelCtrl.prototype = {
    init: function () {
        this.$next = $('.control .next');// 音频控制按钮
        this.$status = $('.control .status');
        this.$more = $('.control .more');// 隐藏面板按钮
        this.$extra = $('.extra');
        this.$heart = $('.music-icon .heart');// 喜欢按钮
        this.$shrink = $('.music-icon .shrink');// 还原或缩小播放器
        this.$musicPlayer = $('.player');
        this.$musicShortcut = $('.shortcut');
        this.$musicBox = $('.music-box');
        this.$InforUl = $('.infor>ul');// 歌词按钮
        this.$lyric = $('.control .lyric');
        this.$channelsList = $('.channel-list'); // 频道按钮客串出场
        this.$channel = $('.extra>.channel');
    },
    bind: function () {
        var self = this;
        // 点击按钮，切换音频播放与暂停状态
        this.$status.on('click', function () {
            if(self.$status.hasClass('icon-play')){
                audioObject.play();
            }else if(self.$status.hasClass('icon-pause')){
                audioObject.pause();
            }
            self.$status.toggleClass('icon-play');
            self.$status.toggleClass('icon-pause');
        });
        // 点击按钮，切换并播放下一首音频
        this.$next.on('click', function () {
            MusicInfor.clearStatus();
            MusicInfor.getMusic();
        });
        // 点击歌词按钮时，打开或关闭歌词（切换展示歌词信息、歌曲基础信息）
        this.$lyric.on('click', function () {
            if(self.$InforUl.css('left') === '0px'){
                self.switchLyric();
            }else if(self.$InforUl.css('left') === '-470px'){
                self.switchInfor();
            }
        });
        // 点击按钮，打开或关闭：隐藏的控制面板
        this.$more.on('click', function () {
            self.$extra.slideToggle();
            self.$more.toggleClass('active');
            self.$channelsList.fadeOut();
            self.$channel.removeClass('active');
        });
        // 点击按钮，喜欢并收藏歌曲——收藏功能暂未实现，待后续扩展
        this.$heart.on('click', function () {
            self.$heart.toggleClass('active');
        });

        // 点击收缩按钮，播放器缩小为一个快捷图标——该图标暂时没有功能只能看
        this.$shrink.on('click', function () {
            self.$musicPlayer.animate({
                width: 0,
                height: 0
            },{
                complete: function() {
                    self.$musicShortcut.show();
                    self.$musicPlayer.hide();
                }
            })
        });
        // 点击快捷图标，播放器变大为原本大小的尺寸
        this.$musicShortcut.on('click', function () {
            self.$musicPlayer.show();
            self.$musicPlayer.animate({
                width: '470px',
                height: '310px'
            });
            self.$musicShortcut.hide();
        });
        // 实现拖动——bug：容器宽度固定没有变小、触发源相同，所以松开鼠标时会同时打开大窗口
        this.$musicShortcut.on('mousedown', function(e){
            var evtX = e.pageX - self.$musicBox.offset().left;   //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
            var evtY = e.pageY - self.$musicBox.offset().top;
            self.$musicShortcut.addClass('draggable');
            self.$musicBox.data('evtPos', {x:evtX, y:evtY}); //把事件到 dialog 边缘的距离保存下来
        }).on('mouseup', function(){
            self.$musicShortcut.removeClass('draggable');
            self.$musicBox.removeData('evtPos');
        });
        $('body').on('mousemove', function(e){
            // $('.draggable').length && $('.draggable').offset({
            //     top: e.pageY - $('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
            //     left: e.pageX - $('.draggable').data('evtPos').x
            // });
            if(self.$musicBox.data('evtPos')){ // 上下功能一样，但写法不一样，导致分不清楚就报错：表达式用的淋漓尽致
                self.$musicBox.offset({
                    top: e.pageY - self.$musicBox.data('evtPos').y,
                    left: e.pageX - self.$musicBox.data('evtPos').x
                });
            }
        });
    },
    // 打开歌词面板，展示歌词信心
    switchLyric: function () {
        this.$InforUl.animate({
            left: '-470px'
        });
        this.$lyric.css('color', 'red');
    },
    // 关闭歌词面板，展示歌曲基础信息
    switchInfor: function () {
        this.$InforUl.animate({
            left: 0
        });
        this.$lyric.css('color', '#000');
    }
}