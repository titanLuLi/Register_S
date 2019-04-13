// pages/main/index.js
var QR = require("../../utils/qrcode.js");
var version = '#version1';
Page({
  data: {
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    placeholder: '学生姓名生日. (张三+2000-09-28)'

  },
  onLoad: function(options) {
    var size = this.setCanvasSize();
    var initUrl = this.data.placeholder;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },
  onReady: function() {

  },
  onShow: function() {

    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },

  onUnload: function() {
    // 页面关闭

  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function(url, canvasId, cavW, cavH) {
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);

  },

  canvasToTempImage: function() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  previewImg: function(e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },
  formSubmit: function(e) {
    var that = this;
    var text = replaceSpace(e.detail.value.url);
    console.log(text);
    that.setData({
      maskHidden: false,
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 4000
    });
    var st = setTimeout(function() {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(text, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
    }, 3000)
  }
})

function replaceSpace(txt) {
  var vals = txt.split('+');
  var val1 = vals[0].trim().replace(/\s+/g, '_');
  var val2 = vals[1].replace(/\s+/g, '');
  return val1 + '+' + val2 + version;

}