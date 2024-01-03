/* eslint-disable camelcase */
let app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team: '',
    groupdate: [],
  },
  tolook() {
    wx.navigateTo({
      url: '/pages/onDutyindex/look/detail/detail',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      team: app.globalData.group,
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
    db.collection('onDuty').where({
      team: app.globalData.group,
    }).orderBy('submit_time', 'desc').field({
      datesend: true,
      time_begin: true,
      time_end: true,
      // interval: true,
      progress: true,
      _id: true,
    }).get().then(res => {
      this.setData({
        groupdate: res.data,
      });
    });
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
