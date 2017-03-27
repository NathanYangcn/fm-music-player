// Get variables
var inforTitle = document.querySelector('.infor>.title');
    inforAuthor = document.querySelector('.infor>.author'),
    timeNow = document.querySelector('.process>.time-now'),
    timeTotal = document.querySelector('.process>.time-total'),
    next = document.querySelector('.btn>.next'),
    last = document.querySelector('.btn>.last'),
    play = document.querySelector('.btn .play'),
    pause = document.querySelector('.btn .pause'),
    horn = document.querySelector('.volume>.horn'),
    volumeBar = document.querySelector('.volume-bar'),
    volumeBarNow =document.querySelector('.volume-bar-now'),
    processBar = document.querySelector('.process-bar'),
    processBarNow = document.querySelector('.process-bar-now'),
    list = document.querySelector('.list'),
    channelsP = document.querySelector('.channels>p'),
    channelsCt = document.querySelector('.channels>ul');
var channelData;
var isLocking = true;
var audioObject = new Audio();

// first enter
setVolume(0.7);
getJsonpData();
audioObject.play();

// change music time
audioObject.addEventListener('playing', function () {
    setTime(audioObject.duration, timeTotal);
});
// set process time
audioObject.ontimeupdate = function(){
    if(isLocking) {
        isLocking = false;
        var percent = Math.ceil(audioObject.currentTime) / Math.ceil(audioObject.duration);
        setTime(audioObject.currentTime, timeNow);
        setBar(processBar, processBarNow, percent);
        setTimeout(function(){
            isLocking = true
        }, 1000)
    }
};
// set musicList play loop
audioObject.addEventListener('ended', function () {
    getJsonpData();
});

// change music status btn
next.addEventListener('click', function () {
    getJsonpData();
});
last.addEventListener('click', function () {
    getJsonpData();
});
// set music switch btn
play.addEventListener('click', function () {
    audioObject.play();
    statusSwitch();
});
pause.addEventListener('click', function () {
    audioObject.pause();
    statusSwitch();
});
// set volume-bar
volumeBar.addEventListener('click', function (e) {
    var percent = init(volumeBar, e);
    setVolume(percent);
});
horn.addEventListener('click', function () {
    setHorn();
});
// set process-bar
processBar.addEventListener('click', function (e) {
    var percent = init(processBar, e);
    setProcess(percent);
    setBar(processBar, processBarNow, percent);
});
// get channels Data
list.addEventListener('click', function () {
    getChannelData();
});
channelsCt.addEventListener('click', function (e) {
    if(e.target.tagName.toLowerCase() === 'li'){
        channelsP.innerText = e.target.innerText;
        channelData = e.target.getAttribute('channelId');
        getJsonpData();
    }
});

function getJsonpData() { // Get music JSONP Data
    var script = document.createElement('script');
    script.src = 'http://api.jirengu.com/fm/getSong.php?channel='+channelData+'&callback=getSong';
    document.head.appendChild(script);
    document.head.removeChild(script);
}
function getSong(data) { // set music infor
    audioObject.src = data.song[0].url;
    inforTitle.innerText = data.song[0].title;
    inforAuthor.innerText = data.song[0].artist;
    lrcSid = data.song[0].sid; // 存储歌词信息
    statusFixed();
}
function statusFixed() {
    //getLyricData(); // 展示歌词
    audioObject.play();
    play.classList.add('active');
    pause.classList.remove('active');
    setTime(0, timeNow);
    setTime(0, timeTotal);
}
function statusSwitch() {
    play.classList.toggle('active');
    pause.classList.toggle('active');
}
function setTime(attri, node) {
    var sec = Math.ceil(attri);
    var result = timeConver(sec);
    node.innerText = result;
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
    setBar(volumeBar, volumeBarNow, cent);
}
function setHorn() {
    if(horn.classList.contains('icon-volume')){
        setVolume(0);
    }else if(horn.classList.contains('icon-mute')){
        setVolume(0.7);
    }
    horn.classList.toggle('icon-volume');
    horn.classList.toggle('icon-mute');
}
function setProcess(cent) {
    var timeLen = cent * audioObject.duration;
    audioObject.currentTime = timeLen;
    setTime(timeLen, timeNow);
}
function init(node, e) {
    var width = node.offsetWidth;
    var widthClick = e.offsetX;
    var percent = widthClick / width;
    return percent;
}
function setBar(ct, ele, cent) {
    var width = ct.offsetWidth;
    ele.style.width = cent * width + 'px';
}
function getChannelData() {
    var script = document.createElement('script');
    script.src = 'http://api.jirengu.com/fm/getChannels.php?callback=getChannel';
    document.head.appendChild(script);
    document.head.removeChild(script);
}
function getChannel(data) {
    var arrData = data.channels;
    var htmls = '';
    for(var i = 0; i < arrData.length; i++){
        htmls += '<li channelId="' + arrData[i].channel_id + '">' + arrData[i].name + '</lichannelId>';
    }
    channelsCt.innerHTML = htmls;
    // for(var j = 0; j < arrData.length; j++){
    //     var lis = document.querySelectorAll('.channels>ul>li');
    //     lis[j].setAttribute('channelId', arrData[j].channel_id);
    // }
}

/*
// get music lrc 歌词部分
var lyricCt = document.querySelector('.lyric');
var lrcSid;
function getLyricData() {
    var script = document.createElement('script');
    script.src = 'http://jirenguapi.applinzi.com/fm/getLyric.php?sid=' + lrcSid;
    document.head.appendChild(script);
    document.head.removeChild(script);
}
function getLyc(data) {
    lyricCt.innerHTML = JSON.parse(data).name;
    lyricCt.innerHTML = JSON.parse(data).lyric;
}
*/