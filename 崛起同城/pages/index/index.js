const app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },
  data: {
    nickname: '',
    page: 0,
    limit: 3,
    cid: 0,
    height: 400,
    text: '加载更多',
    /* 假数据 */
    banner: [],
    hospital: [],
    zhuzhi: false
  },
  onLoad: function (options) {
    this.getindex()
    this.getmore()
    this.hosheight()

  },
  // 首页接口
  getindex() {
    var that = this
    var url = app.globalData.url
    wx.request({
      url: url + 'api/index',
      method: "POST",
      success(res) {
        console.log(res.data)
        var banner = res.data.banner
        var category = res.data.category
        that.setData({
          banner: banner,
          category: category
        })
      }
    })
  },
  // 加载更多接口
  getmore() {
    var that = this
    var url = app.globalData.url
    wx.request({
      url: url + "api/gethospital",
      method: "POST",
      data: {
        page: that.data.page,
        limit: that.data.limit,
        cid: that.data.cid
      },
      success(res) {
        console.log(res.data)
        if (res.data.hospital.length < 5) {
          that.data.text = '没有更多了';
          that.data.zhuzhi = true;
        }
        that.data.hospital.push(...res.data.hospital);
        that.setData({
          hospital: that.data.hospital,
          page: ++that.data.page,
          text: that.data.text
        })
      },
      fail(res) {
        console.log("请稍后加载")
      }
    })
  },
  // 点击精选，汽车，房产
  qiehuan(e) {
    var cid = e.currentTarget.dataset.cid
    this.setData({
      cid: cid,
      page: 0,
      zhuzhi: false,
      hospital: []
    })
    this.getmore();
  },
  // 加载更多
  tolower() {
    console.log(111)
    var that = this
    if (that.data.zhuzhi) {
      return false;
    }
    that.getmore()
  },
  // 计算需要滚动的视口高度
  hosheight() {
    var that = this
    let query = wx.createSelectorQuery();
    query.select('.content').boundingClientRect(rect => {
      let height = rect.height;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            height: res.windowHeight - height - 10
          })
        }
      });
    }).exec();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  /* 详情 */
  go(e) {
    var itemid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../xiangqingye/xiangqingye?itemid=' + itemid,
    })
  }
})