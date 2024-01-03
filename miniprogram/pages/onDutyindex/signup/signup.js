/* eslint-disable camelcase,prefer-destructuring */
const db = wx.cloud.database();
const onDuty = db.collection('onDuty');
const _ = db.command;
const app = getApp();
let _id;

let work;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: '',
    work: '',
    onduty: {},
    mywork: [0, 0, 0, 0, 0, 0],
    dlDisabled: false,
    dormitoryLimit: true,
    dormitories: [
      '未选择宿舍',
      '海天苑1号楼A座',
      '海天苑1号楼B座',
      '海天苑1号楼C座',
      '海天苑2号楼A座',
      '海天苑2号楼B座',
      '海天苑2号楼C座',
      '海天苑2号楼D座',
      '海天苑2号楼E座',
      '海天苑2号楼F座',
      '海天苑2号楼G座',
      '海天苑3号楼A座',
      '海天苑3号楼B座',
      '星天苑A座',
      '星天苑B座',
      '星天苑C座',
      '星天苑D座',
      '星天苑E座',
      '星天苑F座',
      '星天苑G座',
      '星天苑H座A',
      '星天苑H座A女',
      '星天苑H座B',
      '星天苑H座C',
      '云天苑A座',
      '云天苑B座',
      '云天苑C座',
      '云天苑D座',
      '云天苑E座',
      '云天苑F座',
      '1号楼A座',
      '1号楼B座',
      '1号楼C座',
      '2号楼',
      '3号楼A座',
      '3号楼B座',
      '3号楼C座',
      '4号楼',
      '5号楼',
      '6号楼',
      '11舍',
      '12舍',
      '北村三号楼',
      '7号楼',
      '其他',
    ],
  },

  people_count(_id) {
    db.collection('onDuty').where({
      _id,
    }).orderBy('submit_time', 'desc').field({
      count: true,
      information_desk: true,
    }).get().then(res => {
      return res.data[0].count < res.data[0].information_desk.limit;
    });
  },

  // selectWork(e) {
  //   work = e.detail.value
  // },
  get_ticket(limit) {
    let member = work + '.member';
    let { openid } = app.globalData;
    let nickname = app.globalData.name;
    let { stuid } = app.globalData;
    let { phone } = app.globalData;
    let { college } = app.globalData;
    let { dormitory } = app.globalData;
    let { sfid } = app.globalData;
    let submit_time = new Date().getTime();
    db.collection('onDuty').where({
      _id,
      count: _.lt(limit),
    }).update({
      data: {
        count: _.inc(1),
        [member]: _.push({
          openid,
          nickname,
          stuid,
          phone,
          college,
          dormitory,
          sfid,
          submit_time,
        }),
        openid: _.addToSet(app.globalData.openid),
      },
    }).then(function (d) {
      if (d.stats.updated > 0) {

        /*抢购成功*/
        wx.hideLoading();
        wx.showModal({
          content: '报名成功，请关注后续通知',
          confirmColor: '#68C08B',
        });
      } else {
        wx.hideLoading();
        wx.showModal({
          content: '报名失败，请刷新重试',
          confirmColor: '#68C08B',
        });
      }
    });

  },
  getWork(e) {
    this.setData({
      dlDisabled: true,
    });
    let limit = e.currentTarget.dataset.count;
    work = 'information_desk';
    // if (!work) {
    //   wx.showToast({
    //     title: '请选择',
    //     icon: 'none'
    //   })
    //   return
    // }
    wx.requestSubscribeMessage({
      // tmplIds: ['_Vs_yfS8lXCqxQgmtggpFbYTVJtMO2m1bxIyFqBoaro'],
      tmplIds: ['o6lZlvtwYjZxA9btzfkL8ae-gndWT10vOrykMBmwRT0'],
      success: res => {
        // console.log()
        let temp_flag = res['o6lZlvtwYjZxA9btzfkL8ae-gndWT10vOrykMBmwRT0'];
        if (temp_flag === 'accept') {
          wx.showLoading({
            title: '正在报名',
            mask: true,
          });
          this.get_ticket(limit);
        } else {
          this.setData({
            dlDisabled: false,
          });
          wx.showModal({
            content: '请允许接收订阅消息',
            confirmColor: '#68C08B',
          });
        }

      },
      fail: () => {
        this.setData({
          dlDisabled: false,
        });
      },
    });

  },

  resetWork() {
    wx.showModal({
      content: '重新选择可能会导致现有岗位被其他志愿者申请哦，是否重新选择',
      confirmColor: '#68C08B',
      complete: res => {
        if (res.confirm) {
          let member = work + '.member';
          onDuty.doc(_id).update({
            data: {
              count: _.inc(-1),
              [member]: _.pull({
                openid: app.globalData.openid,
              }),
              openid: _.pull(app.globalData.openid),
            },
          });
          this.setData({
            work: '',
          });
          work = '';

        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.type === 'share') {
      this.getUserInfo();
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    _id = options._id;
    let _this = this;
    onDuty.doc(_id).watch({
      onChange(snapshot) {
        let onduty = snapshot.docChanges[0].doc;
        _this.setData({
          onduty,
        });
        _this.test_hasWork(onduty);
        // 判断宿舍楼
        if (onduty.dormitory === '0' || onduty.dormitory === app.globalData.dormitory) {
          _this.setData({
            dormitoryLimit: false,
          });
        }
        wx.hideLoading();
        if (!onduty.progress) {
          wx.redirectTo({
            url: '/pages/onDutyindex/onDutyindex',
          });
          wx.showToast({
            title: '报名已结束',
            icon: 'none',
          });
        }
      },
      onError(){},
    });
    this.setData({
      _id,
    });
  },

  test_hasWork(onduty) {
    let { openid } = app.globalData;
    let information_desk = onduty.information_desk.member;
    let array = [information_desk];
    for (let i in array[0]) {
      if (array[0][i].openid === openid) {
        work = 'information_desk';
        this.setData({
          work,
        });
      }
    }
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    wx.showLoading({
      title: '加载用户',
      mask: 'none',
    });
    wx.cloud.callFunction({
      name: 'getUserInfo',
    }).then(function (res) {
      let { result } = res;
      if (result.flag) {
        result.data['openid'] = result.data['_id'];
        app.globalData = result.data;
      } else {
        wx.redirectTo({
          url: '/pages/info/info',
        });
      }
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
    });
  },
});
