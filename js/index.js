// 音频控制按钮
var $next = $('.control .next'),
    $status = $('.control .status'),
// 隐藏面板按钮
    $more = $('.control .more'),
    $extra = $('.extra'),
// 喜欢按钮
    $heart = $('.music-icon .heart'),
// 还原或缩小播放器
    $shrink = $('.music-icon .shrink'),
    $musicPlayer = $('.player'),
    $musicShortcut = $('.shortcut');
// 状态锁
var isLocking = false;
// 新建 audio 对象
var audioObject = new Audio();

// 首次进入页面
function firstEnter() {
    $channelName.text( '频道：漫步春天' );
    getMusic();
    setVolume(0.7);
    getChannelData();
}

// 二、监听 audio 状态
$(audioObject).on('playing',function () {
    setTime(audioObject.currentTime, $timeNow);
    setTime(audioObject.duration, $timeTotal);
});
$(audioObject).on('ended', function () {
    getMusic();
});
audioObject.ontimeupdate = function(){
    if(isLocking) return;
    isLocking = true;
    var percent = Math.ceil(audioObject.currentTime) / Math.ceil(audioObject.duration);
    showLyric();
    setTime(audioObject.currentTime, $timeNow);
    setBar($processBar, $processBarNow, percent);
    setTimeout(function(){
        isLocking = false
    }, 900)
};

// 点击音频进程条，设置音频进程
$processBar.on('click', function (e) {
    var percent = setInit($processBar, e);
    setProcess( percent );
    setBar($processBar, $processBarNow, percent);
    audioObject.play();
    showLyric();
});
// 点击音量条，设置音量
$volumeBar.on('click', function (e) {
    var percent = setInit($volumeBar, e);
    setVolume(percent);
    setBar($volumeBar, $volumeBarNow, percent);
});
// 点击按钮，快速设置静音与默认音量
$horn.on('click', function () {
    setHorn();
});

// 点击按钮，切换音频播放与暂停状态
$status.on('click', function () {
    if($status.hasClass('icon-play')){
        audioObject.play();
    }else if($status.hasClass('icon-pause')){
        audioObject.pause();
    }
    $status.toggleClass('icon-play');
    $status.toggleClass('icon-pause');
});
// 点击按钮，切换并播放下一首音频
$next.on('click', function () {
    clearStatus();
    getMusic();
});

// 点击按钮，展示频道列表
$channel.on('click', function () {
    getChannelData();
    $channelsList.toggle();
    $channel.toggleClass('active');
});
// 切换频道
$channelsUl.on('click', 'li', function (e) {
    if( e.target.tagName.toLowerCase() === 'li' ) {
        selectChannel(e);  // 展示当前频道名称
        clearStatus();
        getMusic();
    }
});

// 点击歌词按钮时，打开或关闭歌词（切换展示歌词信息、歌曲基础信息）
$lyric.on('click', function () {
    if($InforUl.css('left') === '0px'){
        switchLyric();
    }else if($InforUl.css('left') === '-470px'){
        switchInfor();
    }
});

// 点击按钮，打开或关闭：隐藏的控制面板
$more.on('click', function () {
    $extra.toggle();
    $more.toggleClass('active');
    $channelsList.hide();
    $channel.removeClass('active');
});
// 点击按钮，喜欢并收藏歌曲——收藏功能暂未实现，待后续扩展
$heart.on('click', function () {
    $heart.toggleClass('active');
});

// 点击收缩按钮，播放器缩小为一个快捷图标——该图标暂时没有功能只能看
$shrink.on('click', function () {
    $musicPlayer.animate({
        width: 0,
        height: 0
    },{
        complete: function() {
            $musicShortcut.show();
            $musicPlayer.hide();
        }
    })
});
// 点击快捷图标，播放器变大为原本大小的尺寸
$musicShortcut.on('click', function () {
    $musicPlayer.show();
    $musicPlayer.animate({
        width: '470px',
        height: '310px'
    });
    $musicShortcut.hide();
});

// 更换下一首音频时，设置播放器默认状态
function clearStatus() {
    audioObject.pause();
    $status.removeClass('icon-play');
    $status.addClass('icon-pause');
    setTime(0, $timeNow);
    setTime(0, $timeTotal);
}

// 打开歌词面板，展示歌词信心
function switchLyric() {
    $InforUl.animate({
        left: '-470px'
    });
    $lyric.css('color', 'red');
}
// 关闭歌词面板，展示歌曲基础信息
function switchInfor() {
    $InforUl.animate({
        left: 0
    });
    $lyric.css('color', '#000');
}