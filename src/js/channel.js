/*
 ** FM 频道：获取频道、展示频道、切换频道
 */
var StorageChannel = require('./index.js');
var MusicInfor = require('./music-infor').MusicInfor;

function Channel() {
    this.init();
    this.bind();
}
Channel.prototype = {
    init: function () {
        // 频道
        this.$channelName = $('.infor .channel-cur');
        this.$channel = $('.extra>.channel');
        this.$channelsList = $('.channel-list');
        this.$channelsUl = $('.channel-list>ul');
    },
    bind: function () {
        var self = this;
        this.$channelName.text( '频道：漫步春天' );
        this.getChannelData();
        // 点击按钮，展示频道列表
        this.$channel.on('click', function () {
            self.getChannelData();
            self.$channelsList.fadeToggle();
            self.$channel.toggleClass('active');
        });
        // 切换频道
        this.$channelsUl.on('click', 'li', function (e) {
            if( e.target.tagName.toLowerCase() === 'li' ) {
                self.selectChannel(e);  // 展示当前频道名称
                MusicInfor.clearStatus();
                MusicInfor.getMusic();
            }
        });
    },
    getChannelData: function () {
        var self = this;
        $.ajax({
            type: 'get',
            url: 'http://api.jirengu.com/fm/getChannels.php',
            dataType: 'jsonp',
            jsonp: 'callback'
        }).done(function (ret) {
            self.renderChannel(ret);
        }).fail(function () {
            console.log('数据获取失败！')
        })
    },
    // 拿到频道数据后，渲染频道列表
    renderChannel: function (data) {
        var htmls = '';
        $.each(data.channels, function (idx, val) {
            htmls += '<li channelId="'+val.channel_id+'">' + val.name + '</li>';
        });
        this.$channelsUl.empty();
        $(htmls).appendTo(this.$channelsUl);
    },
    selectChannel: function (e) {
        var self = this;
        if(e.target.tagName.toLowerCase() === 'li'){
            var $cur = $(e.target);
            self.$channelName.text('频道：' + $cur.text() );
            StorageChannel.storageChannel = $cur.attr('channelId');
            $cur.siblings().removeClass('active');
            $cur.addClass('active');
        }
    }
};

module.exports.Channel = Channel;