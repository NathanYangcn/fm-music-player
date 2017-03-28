// Get variables
var $channelsP = $('.header>p'),
    $channels = $('.header>.channels'),
    $channelsList = $('.header>.channels-list'),
    $channelsUl = $('.header>.channels-list>ul'),
    $musicTitle = $('.main>.infor>.title'),
    $musicAuthor = $('.main>.infor>.author'),
    $volumeBar = $('.volume-bar'),
    $volumeBarNow =$('.volume-bar-now'),
    $horn = $('.volume>.horn'),
    $next = $('.btn>.next'),
    $last = $('.btn>.last'),
    $play = $('.btn .play'),
    $pause = $('.btn .pause'),
    $timeNow = $('.process>.time-now'),
    $timeTotal = $('.process>.time-total'),
    $processBar = $('.process-bar'),
    $processBarNow = $('.process-bar-now'),
    $lyricUl = $('.lyric>ul');
var storageChannel = 'public_tuijian_spring',
    isLoading = false,
    isLocking = false,
    musicSid,
    lyricArr = [];
var audioObject = new Audio();

// 第一次进入
firstEnter();
function firstEnter() {
    $channelsP.text( '漫步春天' );
    getMusic();
    setVolume(0.7);
    getChannelData();
}

// 监听 audio 状态
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

// 监听元素功能
$channels.on('click', function () {
    getChannelData();   // 获取频道数据
    showtoggle($channelsList); // 频道列表-展示、隐藏
});
$channelsUl.on('click', 'li', function (e) {
    if( e.target.tagName.toLowerCase() === 'li' ) {
        showChannel(e);  // 展示当前频道名称
        getMusic();
    }
});
$horn.on('click', function () {
    setHorn();
});
$volumeBar.on('click', function (e) {
    var percent = setInit($volumeBar, e);
    setVolume(percent);
    setBar($volumeBar, $volumeBarNow, percent);
});
$processBar.on('click', function (e) {
    var percent = setInit($processBar, e);
    setProcess( percent );
    setBar($processBar, $processBarNow, percent);
});
$play.on('click', function () {
    audioObject.play();
    statusToggle();
});
$pause.on('click', function () {
    audioObject.pause();
    statusToggle();
});
$next.on('click', function () {
    clearStatus();
    getMusic();
});
$last.on('click', function () {
    clearStatus();
    getMusic();
});

// 向后台请求数据
function getChannelData() {
    $.ajax({
        type: 'get',
        url: 'http://api.jirengu.com/fm/getChannels.php',
        dataType: 'jsonp',
        jsonp: 'callback'
    }).done(function (ret) {
        renderChannel(ret);
    }).fail(function () {
        alert('数据获取失败！')
    })
}
function getMusic() {
    if( isLoading ) return;
    isLoading = true;
    $.ajax({
        url: 'http://api.jirengu.com/fm/getSong.php',
        type: 'get',
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
            channel: storageChannel
        }
    }).done(function (ret) {
        getMusicInfor(ret);
    }).fail(function () {
        alert('系统异常！')
    });
    setTimeout(function(){
        isLoading = false
    }, 300)
}
function getLyric() {
    $.ajax({
        url: 'http://api.jirengu.com/fm/getLyric.php',
        type: 'post',
        dataType: 'json',
        jsonp: 'callback',
        data: {
            sid: musicSid
        }
    }).done(function (ret) {
        dealLrc(ret.lyric);
        renderLyric();
    }).fail(function () {
        alert('暂无歌词');
    })
}

// 各个功能函数体
function renderChannel(data) {
    var htmls = '';
    $.each(data.channels, function (idx, val) {
        htmls += '<li channelId="'+val.channel_id+'">' + val.name + '</li>';
    });
    $channelsUl.empty();
    $(htmls).appendTo($channelsUl);
}
function showChannel(e) {
    if(e.target.tagName.toLowerCase() === 'li'){
        var $self = $(e.target);
        $channelsP.text( $self.text() );
        storageChannel = $self.attr('channelId');
    }
}
function showtoggle($ele) {
    $ele.toggleClass('active');
}
function getMusicInfor(data) {
    $musicTitle.text(data.song[0].title);
    $musicAuthor.text(data.song[0].artist);
    audioObject.src = data.song[0].url;
    musicSid = data.song[0].sid;
    getLyric();
    audioObject.play();
}
function setHorn() {
    if( $horn.hasClass('icon-volume') ){
        setVolume(0);
        $horn.css('color', '#666')
    }else if( $horn.hasClass('icon-mute') ){
        setVolume(0.7);
        $horn.css('color', 'red')
    }
    $horn.toggleClass('icon-volume');
    $horn.toggleClass('icon-mute');
}
function statusToggle() {
    $play.toggleClass('active');
    $pause.toggleClass('active');
}
function clearStatus() {
    audioObject.pause();
    $play.addClass('active');
    $pause.removeClass('active');
    setTime(0, $timeNow);
    setTime(0, $timeTotal);
}
function setTime(timer, $node) {
    var sec = Math.ceil(timer);
    var result = timeConver(sec);
    $node.text(result);
}
function timeConver(sec) {
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
function setVolume(cent) {
    audioObject.volume = cent;
    setBar($volumeBar, $volumeBarNow, cent);
}
function setProcess(cent) {
    audioObject.currentTime = cent * audioObject.duration;
}
function setInit($node, e) {
    var totalWidth = $node[0].offsetWidth;
    var offsetWidth = e.offsetX;
    return (offsetWidth / totalWidth);
}
function setBar($ct, $ele, cent) {
    var totalWidth = parseInt( $ct.css("width") );
    $ele.css({
        "width": cent * totalWidth
    });
}
function dealLrc(lyric) {
    if(lyric){
        var lines = lyric.split('\n');
        var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;
        var result = [];
        if(lines != ''){
            for(var i in lines){
                var time = lines[i].match(timeReg);
                var value = lines[i].replace(timeReg, '');
                for(var y in time){
                    var t = time[y].slice(1, -1).split(':');
                    var timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]);
                    result.push([timeArr, value]);
                }
            }
        }
    }
    result.sort(function (a, b) {
        return a[0] - b[0];
    });
    lyricArr = result;
}
function renderLyric() {
    var lyrHtmls = '';
    for(var i = 0; i < lyricArr.length; i++){
        if( lyricArr[i][1] === '') continue;
        lyrHtmls += '<li data-time="' + lyricArr[i][0] + '">' + lyricArr[i][1] + '</li>';
    }
    $lyricUl.empty();
    $(lyrHtmls).appendTo($lyricUl);
}
function showLyric() {
    var $lyricLis = $('.lyric>ul>li');
    for(var i = 0; i < lyricArr.length; i++){
        var curT =  $lyricLis.eq(i).attr("data-time");
        var nextT =  $lyricLis.eq(i+1).attr("data-time");
        var curTime = audioObject.currentTime;
        if( (curTime > curT) && (curTime < nextT) ){
            var liH = 0;
            for(var j = 0; j <= i; j++){
                liH += $lyricLis.eq(j).outerHeight(true);
            }
            $lyricLis.removeClass("active");
            $lyricLis.eq(i).addClass("active");
            $('.lyric>ul').css({
                "top": 50-liH
            });
        }
    }
}