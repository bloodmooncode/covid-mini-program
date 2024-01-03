// pages/index/Info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    // 单次加载能够获得的数据
    infoList: [],
    // 所有数据的拼接
    allList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      type,
    } = options;
    this.setData({
      type,
    });
    this.getData(type);
  },

  getData(type) {
    return new Promise((resolve, reject) => {
      // console.log("getData")
      const _this = this;
      const {
        page,
      } = _this.data;
      let newPage = page + 20;
      let { allList } = _this.data;
      // 获取所有的类别为已审核，类别为群聊汇总的数据, 使用云函数防止20上限
      wx.cloud.callFunction({
        name: 'iaGetAllGroupInfo',
        data: {
          type,
          page,
        },
        success(res) {
          let data = res.result.list;
          // 如果data长度为0，说明此时page过大，已经加载不到数据
          if (data.length === 0) {
            wx.showToast({
              title: '已经没有新的东西啦~',
              icon: 'none',
            });
          } else {
            // 对数据里面的date型获取到本地后转换为的字符串处理
            for (let i = 0; i < data.length; i++) {
              let dateStr = data[i].submitDate.split('T');
              let [date, time] = dateStr;
              data[i].submitDate = date + '    ' + time.split('.')[0];
            }
            _this.setData({
              infoList: data,
              allList: allList.concat(data),
              page: newPage,
            });
          }
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });

  },

  preview(e){
    let { index } = e.currentTarget.dataset;
    let imageIndex = e.currentTarget.dataset.imageindex;
    let imageArray = [];
    imageArray.push(this.data.allList[index].image[imageIndex]);
    wx.previewImage({
      urls: imageArray,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 下拉刷新后，重新设置page为0，置空目前所有数据
    this.setData({
      allList: [],
      infoList: [],
      page: 0,
    });
    this.getData(this.data.type);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // console.log("bottom")
    const _this = this;
    _this.getData(this.data.type);
  }
});