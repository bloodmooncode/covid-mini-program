const db = wx.cloud.database();
const iaAdmin = db.collection('iaAdmin');
Page({
  data: {
    // 是否已经获得手机号
    hasPhone: true,
    // 是否为管理员
    isAdmin: false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    // 如需尝试获取用户信息可改为false
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },
  onLoad() {
    // 进入时，首先读取缓存，查看是否存在用户手机号
    let phone = wx.getStorageSync('phone');
    const _this = this;

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    if (phone) {
      // 如果缓存中存在手机号，读取并判断是否为管理员
      _this.setData({
        phone,
      });
      // 如果获取到缓存中的手机号，判断是否为管理员
      _this.judgeAdmin(phone).then(res => {
        // res为judgeAdmin判断是否为管理员的结果
        _this.setData({
          isAdmin: res,
        });
      });
    } else {
      // 如果缓存中不存在手机号，默认为不是管理员
      _this.setData({
        isAdmin: false,
        hasPhone: false,
      });
    }
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      desc: '展示用户信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
    });
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },

  judgeAdmin(userPhone) {
    return new Promise((resolve, reject) => {
      iaAdmin.where({
        phone: userPhone,
      }).get({
        success(res) {
          if (res.data.length != 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail(err) {
          reject(err);
        },
      });
    });
  },

  getPhoneNumber(e) {
    const _this = this;
    if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '请授权您的手机号哦~',
        icon: 'error',
      });
    } else {
      wx.cloud.callFunction({
        name: 'iaGetPhoneNumber',
        data: {
          phoneNumber: wx.cloud.CloudID(e.detail.cloudID),
        },
        success(res) {
          let {
            phoneNumber,
          } = res.result.event.phoneNumber.data;
          _this.setData({
            hasPhone: true,
            phone: phoneNumber,
          });
          // 用户点击获取手机号后，对于获取到的结果，判断是否为管理员
          _this.judgeAdmin(phoneNumber).then(res => {
            if (res){
              _this.setData({
                isAdmin: true,
              });
              wx.showToast({
                title: '验证成功！',
              });
            } else {
              // 如果不是，设置isAdmin为false，同时弹窗提示
              _this.setData({
                isAdmin: false,
              });
              wx.showToast({
                title: '您不是管理员哦',
                icon: 'error',
              });
            }
          });
          // 同时将手机号存入缓存
          wx.setStorage({
            key: 'phone',
            data: phoneNumber,
          });
        },
      });
    }
  },

  linkToManage() {
    wx.navigateTo({
      url: '/pages/info-aggregator/info-manage/index',
    });
  },
  linkToInfo(e) {
    let {
      type,
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/info-aggregator/info-manage/info/index?type=' + type,
    });
  },
  linkToPublish() {
    wx.navigateTo({
      url: '/pages/info-aggregator/info-publish/index',
    });
  },
});
