const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTapCurrent: 0,
    showModal: false,
    resa: '',
    starts: 1,
    page: 0,
    limit: 10,
    pagelist:["未参加","已参加","已过期"]
  },
  onLoad: function (options) {
    this.gethd()
    // wx.getSystemInfo({
    //   success: function (res) {
    //     // 获取可视区宽度与高度
    //     console.log(res.windowWidth);
    //     console.log(res.windowHeight);
    //   },
    // })
  },
  gethd() {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    var http = app.globalData.url
    var token = userInfo.api_token
    var all = 'Bearer ' + token
    wx.request({
      method: "POST",
      url: http + '/api/bmlist',
      data: {
        starts: this.data.starts,
        page: this.data.page,
        limit: this.data.limit
      },
      header: {
        Authorization: all,
        Accept: 'application/json'
      },
      dataType: "json",
      success: function (res) {
        console.log("请求成功", res)
        var res = res.data
        console.log(res)
        that.setData({
          res: res
        })
      },
      fail: function (res) {
        console.log("请求失败", res)
      }
    })
  },
  menuTap: function (e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      menuTapCurrent: current
    });

  },
  preventTouchMove: function () {},
  btn: function () {
    this.setData({
      showModal: true
    })
  },
  // 弹出层里面的弹窗
  ok: function () {
    this.setData({
      showModal: false,
    })
  },
})