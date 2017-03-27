var musicBox = [ //歌曲库
    {
        src: 'http://cloud.hunger-valley.com/music/玫瑰.mp3',
        song: '玫瑰',
        singer: '伍佰'
    },{
        src: 'http://cloud.hunger-valley.com/music/ifyou.mp3',
        song: 'IF YOU',
        singer: 'Big Bang'
    }
];

var $lastBtn = $('.last'),
    $nextBtn = $('.next'),
    $status = $('.status'),
    $song = $('.song'),
    $singer = $('.singer'),
    $time = $('.time'),
    $processBg = $('.bar'),
    $processBar = $('.bar-now'),
    $soundBg = $('.sound-bg'),
    $soundBar = $('.sound-bar');
var musicIndex = 0; // 当前歌曲ID
var isUpdating = false; // timeupdate 时间锁

// 第一次进入
var audioObject = new Audio();
audioObject.autoplay = true; // 自动播放
//audioObject.loop = true;  // 单曲循环
getMusecInfo(musicBox[musicIndex]);
setSound(0.75);
setStatus();

audioObject.ontimeupdate = function () { //跟随播放时间改变
    if(isUpdating){
        return
    }
    getTime();
    getBarChange();
    isUpdating = true;
    setTimeout(function(){
        isUpdating = false
    }, 800);
};
$(audioObject).on('ended', function () { //列表循环播放
    getNextMusic();
    $playBtn.show();
    $pauseBtn.hide();
});

$nextBtn.on('click', function () {
    getNextMusic();
});
$lastBtn.on('click', function () {
    getLastMusic();
});
$status.on('click', function () {
    setStatus();
});
$processBg.on('click', function (e) {
    setProcessBar(e);
});
$soundBg.on('click',function (e) {
    getSoundChange(e);
});

function getMusecInfo(info) { //获取并展示歌曲库中的音乐信息
    audioObject.src = info.src;
    $song.text(info.song);
    $singer.text(info.singer);
}
function getNextMusic() { //获取下一首
    musicIndex++;
    //用算法解决歌曲两端无法继续点击的问题
    musicIndex = (musicIndex + musicBox.length) % musicBox.length;
    getMusecInfo(musicBox[musicIndex]);
    $status.removeClass('icon-play');
    $status.addClass('icon-pause');
}
function getLastMusic() { //获取上一首
    musicIndex--;
    musicIndex = (musicIndex + musicBox.length) % musicBox.length;
    getMusecInfo(musicBox[musicIndex]);
    $status.removeClass('icon-play');
    $status.addClass('icon-pause');
}
function setStatus() { // 展示播放或暂停按钮
    if( $status.hasClass('icon-play') ){
        audioObject.play();
        $status.removeClass('icon-play');
        $status.addClass('icon-pause');
    }else if( $status.hasClass('icon-pause') ){
        audioObject.pause();
        $status.removeClass('icon-pause');
        $status.addClass('icon-play');
    }
}
function getTime() { //获取并展示当前歌曲进程时间
    var hours = parseInt(audioObject.currentTime / (60*60) ) + '';
    var minutes = parseInt(audioObject.currentTime / 60) + '';
    var seconds = parseInt(audioObject.currentTime % 60) + '';
    var timeText;
    hours = hours==0 ? '' : hours;
    minutes = minutes.length==2 ? minutes : '0'+minutes;
    seconds = seconds.length==2 ? seconds : '0'+seconds;
    if(hours == 0){
        timeText = minutes + ':' + seconds;
    }else if(hours != 0){
        timeText = hours + ':' + minutes + ':' + seconds;
    }
    $time.text(timeText);
}
function setProcessBar(e) { // 点击音乐进度条，改变音乐播放进程
    // 1. 获取点击位置x坐标——offsetX:设置或检索指针相对于触发事件的对象的位置的x坐标
    // 2. 设置并改变歌曲进程百分比——小数可以乘以秒数，但百分数不可以【可能与‘%’有关】
    var width = parseInt($processBg.css('width'));
    var precent = e.offsetX / width;
    audioObject.currentTime = precent * audioObject.duration;
    $processBar.animate({
        width: precent * 100 + '%'
    });
}
function getBarChange() { // 播放音乐时进度条的改变
    /*方法一：宽度赋值为计算后的像素值
     var precent = (audioObject.currentTime / audioObject.duration);
     var width = parseInt($processBg.css('width'));
     var barNowWidth = precent * width;
     $processBar.animate({
     width: barNowWidth
     });
     */
    //方法二：宽度赋值为计算后的百分比
    var precent = (audioObject.currentTime / audioObject.duration) * 100 + '%';
    $processBar.animate({
        width: precent
    });
}
function getSoundChange(e) { //计算声音值和进度条
    var width = parseInt($soundBg.css('width'));
    var present = e.offsetX / width;
    setSound(present)
}
function setSound(value) { //改变声音大小值和声音进度条
    audioObject.volume = value;
    $soundBar.animate({
        width: value * 100 + '%'
    });
}