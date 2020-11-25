// pages/menulist/menulist.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ph: [],
    tempFilePaths: [],
    zt: false,
    list: ['选择分类', '服饰配件', '家用电器', '居家自用', '手机电脑'],
    choose: ['全新', '不讲价', '仅自提'],
    phzt: false,
    hidden: true,
    flag: false,
    x: 0,
    y: 0,
    uploadPicKind: '',
    imgnum: 9,
    elements: [],
    isStopBodyScroll: false
  },
  onLoad: function (options) {
    that = this;
  },
  choose(e) {
    console.log(e.currentTarget.dataset.id)
  },
  fenlei() {
    this.setData({
      zt: true
    })
  },
  choosefenlei() {
    this.setData({
      zt: false
    })
  },
  // 上传图片
 
  // 

  // 照片张数计算(和计算每张图片的位置,如果需要计算位置nodes=false,否则为true)
  getNumPic() {
    var num = that.data.tempFilePaths.length;
    var title = '上传照片（' + num + '）张';
    wx.setNavigationBarTitle({
      title: title
    });

  },

  // 获取图片的信息（位置信息）
  getElements() {
    var query = wx.createSelectorQuery();
    var nodesRef = query.selectAll(".uploadPic-li-pic");
    nodesRef.fields({
      dataset: true,
      rect: true
    }, (result) => {
      for (var i = 0; i < result.length; i++) {
        result[i].dataset['index'] = i
      }
      that.setData({
        elements: result
      });
    }).exec();
  },

  /*****
   * 上传图片
   ********/
  uploadpic: function (e) {
    var tempFilePaths = that.data.tempFilePaths;
    let num = that.data.imgnum - that.data.tempFilePaths.length;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var path = res.tempFiles;
        for (var i in res.tempFiles) {
          /**** 这里如果换为了服务器的，这里的 upload_percent 就得写为0，土武器上传完毕会改为对应的进度****/
          path[i]['upload_percent'] = 100;
          path[i]['src'] = '';
          path[i]['iserror'] = 0;
          path[i]['errormsg'] = '';
          tempFilePaths.push(path[i]);
        }
        console.log(
          tempFilePaths
        )
        if (tempFilePaths.length > 9) {
          var chazhi = tempFilePaths.length - 9
          wx.showModal({
            title: "提示",
            content: "最多分享9张照片",
            duration: 3000,
            success: function (res) {
              that.data.tempFilePaths.splice(8, chazhi)
              console.log(that.data.tempFilePaths)
              that.setData({
                tempFilePaths: that.data.tempFilePaths
              })
            }
          })
          return false
        }
        that.setData({
          tempFilePaths: tempFilePaths
        }, () => {
          // 等赋值完毕后，再统计照片张数
          that.getNumPic();
          // 图片位置信息
          that.getElements();

        });

        // 上传服务器 （图片不能一次上传多张，需要一张一张上传，用了一个循环）
        for (var j in tempFilePaths) {
          if (tempFilePaths[j]['upload_percent'] == 0) {
            // that.upload_file_server(j)
          }
        }
      }
    })
  },
  // 上传服务器
  upload_file_server: function (j) {
    var keyinfo = that.data.tempFilePaths[j];
    var key = "tempFilePaths[" + j + "]";
    var upload_task = wx.uploadFile({
      // 这里是图片上传的图片服务器地址
      url: common.config.Sever_uploadImg,
      filePath: keyinfo['path'],
      name: 'file',
      success: function (res) {
        var returndata;
        if (typeof res.data == 'string') {
          returndata = JSON.parse(res.data)
        }
        if (res.statusCode != 200) {
          keyinfo['iserror'] = 1;
          keyinfo['errormsg'] = '网络错误';
        } else {
          if (returndata.code) {
            keyinfo['src'] = returndata.data;
            keyinfo['iserror'] = 0;
            keyinfo['errormsg'] = '成功';
          } else {
            keyinfo['iserror'] = 1;
            keyinfo['errormsg'] = returndata.msg;
          }
        }

        // 只是改变其中的某项
        that.setData({
          [key]: keyinfo,
        });
      }
    });
    upload_task.onProgressUpdate((res) => {
      keyinfo['upload_percent'] = res.progress
      that.setData({
        [key]: keyinfo,
      });
    })
  },

  /*** 删除图片***/
  delimg: function (e) {
    var datalist = that.data.tempFilePaths;
    var thiskey = e.currentTarget.dataset.keyindex;
    datalist.splice(thiskey, 1);
    that.setData({
      tempFilePaths: datalist
    }, () => {
      // 照片张数统计
      that.getNumPic();
    });
  },
  // 提交按钮
  uploadPicFinshed() {
    // 点击完成后的动作
    var tempFilePaths = that.data.tempFilePaths;

  },

  // 拖拽逻辑
  //长按
  _longtap: function (e) {
  
  },
  //触摸开始
  touchs: function (e) {
    console.log(e)
    var maskImg = e.currentTarget.dataset.img
    this.setData({
      maskImg: maskImg
    });
    this.setData({
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })
    this.setData({
      hidden: false,
      flag: true
    })
    this.setData({
      beginIndex: e.currentTarget.dataset.index
    })
  },
  //触摸结束
  touchend: function (e) {
    if (!this.data.flag) {
      return;
    }
    const x = e.changedTouches[0].pageX
    const y = e.changedTouches[0].pageY
    console.log(x, y)
    const list = this.data.elements;
    let data = this.data.tempFilePaths
    /*  console.log(this.data.isStopBodyScroll)
     this.data.isStopBodyScroll=true */
    this.data.isStopBodyScroll = false
    for (var j = 0; j < list.length; j++) {
      const item = list[j];
      if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
        const endIndex = item.dataset.index;
        const beginIndex = this.data.beginIndex;
        //向后移动
        if (beginIndex < endIndex) {
          let tem = data[beginIndex];
          for (let i = beginIndex; i < endIndex; i++) {
            data[i] = data[i + 1]
          }
          data[endIndex] = tem;
        }
        //向前移动
        if (beginIndex > endIndex) {
          let tem = data[beginIndex];
          for (let i = beginIndex; i > endIndex; i--) {
            data[i] = data[i - 1]
          }
          data[endIndex] = tem;
        }
        this.setData({
          tempFilePaths: data,
          isStopBodyScroll: this.data.isStopBodyScroll
        });
      }
    }
    this.setData({
      hidden: true,
      flag: false,
      maskImg:''
    })
  },
  //滑动
  touchm: function (e) {
    console.log(e)
    if (this.data.flag) {
      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      console.log(e.touches[0].pageX, e.touches[0].pageY)
      console.log(this.data.isStopBodyScroll)
      this.data.isStopBodyScroll = true
      this.setData({
        x: x - 70,
        y: y - 170,
        isStopBodyScroll: this.data.isStopBodyScroll
      })
    }
  },
  // 
  onReady: function () {

  },
  onShow: function () {

  },

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