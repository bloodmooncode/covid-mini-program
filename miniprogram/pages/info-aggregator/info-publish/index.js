const db = wx.cloud.database();
const iaInfo = db.collection('iaInfo');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ['群聊汇总', '紧急联系方式', '爱心捐赠', '其他'],
    type: '',
    text: '',
    imgList: [],
    contact: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  setType(e) {
    this.setData({
      type: e.currentTarget.dataset.type,
    });
  },

  setText(e) {
    this.setData({
      text: e.detail.value,
    });
  },

  setContact(e) {
    this.setData({
      contact: e.detail.value,
    });
  },

  chooseImage() {
    let _this = this;
    wx.chooseImage({
      //选择1张图片
      count: 1,
      success: (res) => {
        // console.log(res);
        wx.showLoading({
          title: '正在上传..',
        });
        wx.cloud.uploadFile({
          cloudPath: res.tempFilePaths[0].replace('http://tmp/', 'info-aggregator/submit/').replace('wxfile://', 'info-aggregator/submit/'),
          // 文件路径
          filePath: res.tempFilePaths[0],
          success: res => {
            let {
              imgList,
            } = _this.data;
            imgList.push(res.fileID);
            _this.setData({
              imgList,
            });
            wx.hideLoading();
          },
          fail: err => {
            // console.log(err);
            // handle error
            wx.showToast({
              title: err,
              icon: 'none',
            });
          },
        });
      },
    });
  },

  delImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList,
    });
  },

  submit() {
    if (!(this.data.type && this.data.text && this.data.contact)) {
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
      });
      return;
    }
    wx.showLoading({
      title: '正在提交..',
      mask: true,
    });
    iaInfo.add({
      data: {
        type: this.data.type,
        text: this.data.text,
        image: this.data.imgList,
        contact: this.data.contact,
        status: 0,
        submitDate: new Date(),
      },
    }).then(res => {
      if (res.errMsg === 'collection.add:ok') {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
});
