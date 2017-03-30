/*
** 声音进度条、音频进程进度条、音频时间展示
*/

// 声音进度条
var $horn = $('.extra>.horn'),
    $volumeBar = $('.extra>.volume-bar'),
    $volumeBarNow =$('.extra .volume-bar-now');

// 歌曲进程进度条、时间
var $processBar = $('.process .process-bar'),
    $processBarNow = $('.process .process-bar-now'),
    $timeNow = $('.process .time-now'),
    $timeTotal = $('.process .time-total');

// 快速调整音量大小：0 或 70%
function setHorn() {
    if( $horn.hasClass('icon-horn') ){
        setVolume(0);
        $horn.css('color', '#fff')
    }else if( $horn.hasClass('icon-mute') ){
        setVolume(0.7);
        $horn.css('color', 'red')
    }
    $horn.toggleClass('icon-horn');
    $horn.toggleClass('icon-mute');
}

// 设置音量大小
function setVolume(cent) {
    audioObject.volume = cent;
    setBar($volumeBar, $volumeBarNow, cent);
}
// 设置音频进程
function setProcess(cent) {
    audioObject.currentTime = cent * audioObject.duration;
}

// 初始化进度条信息：计算要设置的百分比
function setInit($node, e) {
    var totalWidth = $node[0].offsetWidth;
    var offsetWidth = e.offsetX;
    return (offsetWidth / totalWidth);
}
// 设置进度条长度
function setBar($ct, $ele, cent) {
    var totalWidth = parseInt( $ct.css("width") );
    $ele.animate({
        "width": cent * totalWidth
    });
}

// 初始化时间后展示
function setTime(timer, $node) {
    var sec = Math.ceil(timer);
    var result = timeConver(sec);
    $node.text(result);
}
// 时间格式转换器
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