// pages/wjxpyq/wjxpyq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phzt: false,
    ph: [],
    bq: ['游戏', '摄影', 'cosplay', '美食图', '甜美风', '漫画', '可爱圈']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  addphoto() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.data.ph.push(...res.tempFilePaths)
        /* console.log(that.data.ph) */
        that.setData({
          ph: that.data.ph,
          phzt: true
        })
      }
    })
  },
  cancel(e) {
    var sp_id = e.currentTarget.dataset.id
    var ph = this.data.ph
    ph.splice(sp_id, 1)
    this.setData({
      ph: ph
    })
  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})