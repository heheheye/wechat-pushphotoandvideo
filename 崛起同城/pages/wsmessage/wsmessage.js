/* const time = require('../../utils/util.js') */
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    real_name: '',
    mark: '',
    sex: '',
  },
  onLoad: function (options) {
    var that = this
    wx.getStorageSync('http')
    console.log(wx.getStorageSync('http'))
    var url = wx.getStorageSync('http')
    that.setData({
      http: url
    })
  },
  sub(e) {
    var that = this;
    var url = wx.getStorageSync('http')
    var http = that.data.http;
    var token = wx.getStorageSync('token');
    var all = 'Bearer ' + token
    that.setData({
      http: url
    })
    console.log(http + '/api/upuser')
    wx.request({
      method: "POST",
      url: http + '/api/upuser',
      data: this.data,
      header: {
        Authorization: all,
        Accept: 'application/json'
      },
      dataType: "json",
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log("请求失败", res)
      }
    })
  },
  onReady: function () {},
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  }
})