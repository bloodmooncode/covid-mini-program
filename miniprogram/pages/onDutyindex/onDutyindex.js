/* eslint-disable camelcase */
let app = getApp();
const db = wx.cloud.database();

const _ = db.command;
Page({
  data: {
    team: '',
    name: '',
    captain: false,
    groupdate: [],
  },
  onLoad() {
    this.getUserInfo();
  },
  onPullDownRefresh() {
    db.collection('onDuty').where({
      team: app.globalData.group,
      progress: true,
      dormitory: _.eq('0').or(_.eq(app.globalData.dormitory)),
    }).orderBy('submit_time', 'desc').field({
      datesend: true,
      // interval: true,
      _id: true,
      time_begin: true,
      time_end: true,
      place: true,
    }).get().then(res => {
      wx.stopPullDownRefresh();
      this.setData({
        groupdate: res.data,
      });
    });
  },

  /**
   * 获取志愿服务列表
   */
  getDuty() {
    db.collection('onDuty').where({
      team: app.globalData.group,
      progress: true,
      dormitory: _.eq('0').or(_.eq(app.globalData.dormitory)),
    }).orderBy('submit_time', 'desc').field({
      datesend: true,
      // interval: true,
      _id: true,
      time_begin: true,
      time_end: true,
      place: true,
    }).get().then(res => {
      this.setData({
        groupdate: res.data,
      });
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    // 无用户信息时 数据库获取
    let _this = this;
    wx.cloud.callFunction({
      name: 'getUserInfo',
    }).then(function (res) {
      let { result } = res;
      if (result.flag) {
        result.data['openid'] = result.data['_id'];
        app.globalData = result.data;
        _this.setData({
          team: app.globalData.group,
          name: app.globalData.name,
          captain: app.globalData.captain,
        });
        _this.getDuty();
      } else {
        wx.redirectTo({
          url: '/pages/info/info',
        });
      }
    });
  },

  tocaptain() {
    wx.navigateTo({
      url: '/pages/onDutyindex/captain/captain',
    });
  },
  tolook() {
    wx.navigateTo({
      url: '/pages/onDutyindex/look/look',
    });
  },
  toInfo() {
    wx.navigateTo({
      url: '/pages/info/info',
    });
  },
  // getUserInfoFromStorage() {
  //   return wx.getStorageSync('user')
  // },
  // storeUserInfo(userInfo) {
  //   wx.setStorageSync('user', userInfo)
  // },
});
