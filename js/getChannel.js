/*
** FM 频道：获取频道、展示频道、切换频道
*/

// 频道
var $channelName = $('.infor .channel-cur'),
    $channel = $('.extra>.channel'),
    $channelsList = $('.channel-list'),
    $channelsUl = $('.channel-list>ul');

// 当前频道信息
var storageChannel = 'public_tuijian_spring';

// 请求频道数据
function getChannelData() {
    $.ajax({
        type: 'get',
        url: 'http://api.jirengu.com/fm/getChannels.php',
        dataType: 'jsonp',
        jsonp: 'callback'
    }).done(function (ret) {
        renderChannel(ret);
    }).fail(function () {
        console.log('数据获取失败！')
    })
}
// 拿到频道数据后，渲染频道列表
function renderChannel(data) {
    var htmls = '';
    $.each(data.channels, function (idx, val) {
        htmls += '<li channelId="'+val.channel_id+'">' + val.name + '</li>';
    });
    $channelsUl.empty();
    $(htmls).appendTo($channelsUl);
}

// 切换频道功能
function selectChannel(e) {
    if(e.target.tagName.toLowerCase() === 'li'){
        var $self = $(e.target);
        $channelName.text('频道：' + $self.text() );
        storageChannel = $self.attr('channelId');
        $self.siblings().removeClass('active');
        $self.addClass('active');
    }
}