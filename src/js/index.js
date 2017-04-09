require('less/reset.less');
require('less/index.less');
require('less/channel.less');
require('less/process.less');
require('less/control.less');
require('less/infor.less');

var Channel = require('./channel').Channel;
var MusicInfor = require('./music-infor').MusicInfor;
var PannelCtrl = require('./pannel-ctrl').PannelCtrl;
var Process = require('./process').Process;
var Volume = require('./volume').Volume;

// 当前频道信息
var storageChannel = 'public_tuijian_spring';
module.exports.storageChannel = storageChannel;
// 首次进入页面：first enter
new PannelCtrl();
new Volume();
MusicInfor.getMusic();
new Process();
new Channel();
// 监听 audio 状态
$(MusicInfor.audioObject).on('ended', function () {
    MusicInfor.getMusic();
});