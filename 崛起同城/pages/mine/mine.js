const app = getApp()
Page({
  data: {
    userInfo: {},
    uid:0,
    phone: 1,
    stat:false
  },
  onLoad: function (options) {
    if(options.uid){
      this.data.uid = options.uid
    }
    console.log(this.data.uid)
    this.setData({
      userInfo:app.globalData.userInfo
    })
    console.log(this.data.userInfo)
  },
  doAuthorization: function (e) {
    var that = this;
    var http = app.globalData.url
    if (e.detail.userInfo == null) {
      console.log("用户拒绝授权");
    } else {
      //授权
      wx.login({
        success: function (res) {
          //发送请求
          wx.request({
            url: http + '/api/wxlogin', //接口地址
            method: 'POST',
            data: {
              code: res.code,
              nickName: e.detail.userInfo.nickName,
              gender: e.detail.userInfo.gender,
              avatarUrl: e.detail.userInfo.avatarUrl,
              uid:that.data.uid
            },
            success: function (res) {
              var res = res.data;
              app.globalData.userInfo = res.userinfo
              wx.setStorageSync('userInfo', app.globalData.userInfo)
              that.setData({
                userInfo: app.globalData.userInfo,
              });
            },
            fail: function (err) {
              console.log("record  失败", err);
            }
          })
        }
      })
    }
  },
  getPhoneNumber(e) {
    var that = this;
    var http = that.data.http;
    var token = wx.getStorageSync('token');
    console.log(e)
    var all = 'Bearer ' + token
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    var sessionk = this.data.session_key;
    wx.request({
      method: "POST",
      url: http + '/api/getphone',
      data: {
        session_key: sessionk,
        encryptedData: ency,
        iv: iv
      },
      header: {
        Authorization: all,
        Accept: 'application/json'
      },
      dataType: "json",
      success: function (res) {
        console.log("请求成功", res)
        that.setData({
          stat: false
        })
      },
      fail: function (res) {
        console.log("请求失败", res)
      }
    })
  },
  go(e) {
  if (!app.globalData.userInfo) {
    wx.showToast({
      title: '请登录',
      duration: 1500,
      icon: 'none'
    })
    return false
  }
  var url = e.currentTarget.dataset.url
  switch(url) {
    case 'san':
       this.scan()
       break;
    case 'logout':
       this.logout()
       break;
    default:
      wx.navigateTo({
        url: url
      })
  }   
  },
  scan() {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    var token = userInfo.api_token
    if (!token) {
      wx.showToast({
        title: '请登录',
        duration: 1500,
        icon: 'none'
      })
      return false
    }
    var all = 'Bearer ' + token
    var http = wx.getStorageSync('http')
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        wx.request({
          method: "POST",
          url: http + '/api/hexiao',
          data: {
            order: result
          },
          header: {
            Authorization: all,
            Accept: 'application/json'
          },
          dataType: "json",
          success: function (res) {
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          },
          fail: function (res) {}
        })
      }
    })
  },
  logout() {
    wx.clearStorage()
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})