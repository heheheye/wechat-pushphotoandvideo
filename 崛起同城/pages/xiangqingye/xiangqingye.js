const time = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xiangqing: [],
    is_show: false,
    star_time: '',
    itemid: 0
  },
  onLoad: function (options) {
    this.gethd(options)
  },
  gethd(options) {
    var that = this
    var url = app.globalData.url
    wx.request({
      url: url + '/api/gethospitalxq/' + options.itemid,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        var xiangqing = res.data
        var time1 = res.data.star_time
        var star_time = time.formatTimeTwo(time1, 'Y-M-D h:m:s')
        var stat = res.data.is_show
        var hid = res.data.id
        app.globalData.starts = res.data.starts
        that.setData({
          xiangqing: xiangqing,
          star_time: star_time,
          stat: stat,
          hid: hid
        })
      }
    })
  },
  lijibaoming() {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showModal({
        title: "提示",
        // 还未登录，暂无权限,是否登录
        content: '还未登录，暂无权限,是否登录',
        duration: 3000,
        icon: 'none',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../mine/mine',
            })
          } else {
            console.log('用户点击取消')
          }
        }
      })
      
      return false
    }
   
    var url = app.globalData.url
    var token = userInfo.api_token
    var hid = that.data.hid
    var all = 'Bearer ' + token
    wx.request({
      url: url + '/api/baoming',
      method: "POST",
      header: {
        Authorization: all,
        Accept: 'application/json'
      },
      data: {
        hid: hid
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../baomingjilu/baomingjilu',
          })
        }
      }
    })
  }

})