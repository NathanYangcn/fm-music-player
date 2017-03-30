// 歌曲信息
var $musicTitle = $('.infor .title'),
    $musicAuthor = $('.infor .author'),
    $musicPic = $('.infor .infor-pic'),
    $InforUl = $('.infor>ul'),
// 背景图片
    $background = $('.background'),
// 歌词
    $lyricUl = $('.infor-lyric>.lyric-list>ul'),
    $lyric = $('.control .lyric');

var isLoading = false, // 状态锁
    musicSid, // 歌曲ID
    lyricArr = []; // 歌词数组

// 请求音频数据
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
        getLyric();
        audioObject.play();
    }).fail(function () {
        $musicTitle.text('系统异常！请稍后再试。')
    });
    setTimeout(function(){
        isLoading = false
    }, 300)
}
// 请求歌词数据
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
        $lyricUl.append('<li>本歌曲暂无歌词</li>');
    })
}

// 拿到音频数据后，设置该音频相关信息
function getMusicInfor(data) {
    $musicTitle.text(data.song[0].title);
    $musicAuthor.text(data.song[0].artist);
    $musicPic.html('<img src="'+data.song[0].picture+'">');
    $background.css(
        'background-image', 'url('+data.song[0].picture+')'
    );
    audioObject.src = data.song[0].url;
    musicSid = data.song[0].sid;
}

// 拿到歌词数据后，初始化：提取歌词信息[ ["秒数","歌词"], [...]... ]
function dealLrc(lyric) {
    if(lyric){
        var lines = lyric.split('\n');
        var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;
        var result = [];
        if(lines != ''){
            for(var i in lines){
                var time = lines[i].match(timeReg);
                var value = lines[i].replace(timeReg, '');
                for(var j in time){
                    var t = time[j].slice(1, -1).split(':');
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

// 渲染歌词信息
function renderLyric() {
    var lyrHtmls = '';
    for(var i = 0; i < lyricArr.length; i++){
        // if( lyricArr[i][1] === '') continue; // 清除空文本内容
        lyrHtmls += '<li data-time="' + lyricArr[i][0] + '">' + lyricArr[i][1] + '</li>';
    }
    $lyricUl.empty();
    $(lyrHtmls).appendTo($lyricUl);
}

// 实现歌词滚动展示
function showLyric() {
    var $lyricLis = $('.infor-lyric>.lyric-list>ul>li');
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
            $('.infor-lyric>.lyric-list>ul').css({
                "top": 60-liH
            });
        }
    }
}