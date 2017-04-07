var audioObject = new Audio(); // 新建 audio 对象
var storageChannel = 'public_tuijian_spring'; // 当前频道信息
// 首次进入页面：first enter
new PannelCtrl();
new Volume();
MusicInfor.getMusic();
new Process();
new Channel();
// 监听 audio 状态
$(audioObject).on('ended', function () {
    MusicInfor.getMusic();
});