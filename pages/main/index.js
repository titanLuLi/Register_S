// pages/main/index.js
var QR = require("../../utils/qrcode.js");
var fun_base64 = require('../../utils/base64.js');
var util = require('../../utils/util.js');

var obj_base64 = new fun_base64.Base64();
var obj_base642 = new fun_base64.Base64();


Page({
  data: {
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    placeholder: '学生姓名+生日+家长姓名'
  },
  onLoad: function(options) {},
  onReady: function() {},
  onShow: function() { },
  onHide: function() {},
  onUnload: function() {},
  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;
      var width = res.windowWidth / scale;
      var height = width;
      size.w = width;
      size.h = height;
    } catch (e) {
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

  
  //base64加密


  formSubmit: function(e) {
    var localvar = e.detail.value.url;
    this.setData({
      imagePath: ''
    });
    if (isFormatOk(localvar)) {
      var text = replaceSpace(localvar);
      var that = this;
      console.log(text);
      var cryText = obj_base64.encode(text);
      //base64解密 
      console.log(cryText);
      that.setData({
        maskHidden: false,
      });    
      var o_data = obj_base642.decode(cryText);
      console.log("o_data:" + o_data);
      wx.showToast({
        title: '生成中...',
        icon: 'loading',
        duration: 3000
      });
      var st = setTimeout(function() {
        wx.hideToast()
        var size = that.setCanvasSize();
        that.createQrCode(cryText, "mycanvas", size.w, size.h);
        that.setData({
          maskHidden: true
        });
        clearTimeout(st);
      }, 3000)
    }
  }
})

function isFormatOk(txt) {
  var vals = txt.split('+');
  if (txt == '' || vals.length < 3) {
    wx.showModal({
      title: '提示',
      content: '缺少信息 "张三+2014-09-28+张二"',
      success: function(sm) {
        return 'false';
      }
    })
  } else {
    if (vals[2] == '') {
      wx.showModal({
        title: '提示',
        content: '缺少信息 "张三+2014-09-28+张一"',
        success: function(sm) {
          return 'false';
        }
      })
    } else {
      return true;
    }
  }
}

function replaceSpace(txt) {
  var vals = txt.split('+');
  var val1 = vals[0].trim();
  var val2 = vals[1].trim();
  var val3 = vals[2].trim();
  var id = util.hashCode(val1 + val2);
  return id+'+'+ val1 + '+' + val2 + '+' + val3;}

