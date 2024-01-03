/* eslint-disable camelcase */
const db = wx.cloud.database();
const onDuty = db.collection('onDuty');
let util = require('../../../utils/util.js');
let app = getApp();

let id;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2021-12-25',
    year: '',
    month: '',
    day: '',
    time_begin: '08:00',
    time_end: '12:00',
    imgList: [],
    captain: false,
    // datesend:'',

    place: '',
    dormitory: '0',
    // expostor: 2,
    // hall_desk: 2,
    // teenager_learn: 2,
    // expose_robot: 2,
    // expostor_desk: 4,
    // interval: '上午',
    // interval_picker: ['上午', '下午' ,'晚上'],
    information_desk: 50,
    number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    submit: false,
    // textInput:"志愿服务小贴士：四要四坚决 思想要高度重视、认识要清晰准确 行动要积极配合、防护要全面到位 坚决做到身体素质不胜任的绝不上岗 坚决做到岗位知识不熟悉的绝不上岗 坚决做到防护措施不到位的绝不上岗 坚决做到核酸阴性无证明的绝不上岗"
    textInput: '报名成功后请根据通知加入相关群聊',
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

  submit(e) {
    wx.showLoading({
      title: '发布中..',
      mask: 'true',
    });
    let duty = {};
    let setDuty = e.detail.value;

    // duty.expostor = {}
    duty.information_desk = {};
    // duty.expostor_desk = {}
    // duty.expose_robot = {}
    // duty.teenager_learn = {}
    // duty.hall_desk = {}
    // duty.interval = setDuty.interval
    duty.date = setDuty.date;
    // 处理date默认时无datesend的问题
    // let realDateSend = this.data.datesend
    // if(realDateSend==''){
    //   let datesend = new Date(this.data.date)
    //   let month = datesend.getMonth() + 1
    //   realDateSend = datesend.getFullYear()+ '年' + month + '月' + datesend.getDate() + '日'
    // }
    // duty.datesend = realDateSend
    let datesend = new Date(this.data.date);
    let month = datesend.getMonth() + 1;
    duty.datesend = datesend.getFullYear() + '年' + month + '月' + datesend.getDate() + '日';

    duty.team = app.globalData.group;

    duty.place = this.data.place === '' ? '无' : this.data.place;
    duty.dormitory = this.data.dormitory;

    duty.time_begin = this.data.time_begin;
    duty.time_end = this.data.time_end;
    duty.submit_time = util.formatTime(new Date());
    duty.progress = true;

    // duty.expostor.limit = setDuty.expostor
    duty.information_desk.limit = setDuty.information_desk;
    // duty.expostor_desk.limit = setDuty.expostor_desk
    // duty.expose_robot.limit = setDuty.expose_robot
    // duty.teenager_learn.limit = setDuty.teenager_learn
    // duty.hall_desk.limit = setDuty.hall_desk

    // duty.expostor.member = []
    duty.information_desk.member = [];
    // duty.expostor_desk.member = []
    // duty.expose_robot.member = []
    // duty.teenager_learn.member = []
    // duty.hall_desk.member = []
    duty.openid = [];
    duty.count = 0;
    duty.notice = this.data.textInput;
    duty.imgList = this.data.imgList;

    let _this = this;
    onDuty.add({
      data: duty,
    }).then(res => {
      wx.setStorageSync('historyPlace', _this.data.place);
      wx.showToast({
        title: '发布成功',
        mask: 'true',
        success: () => {
          id = res._id;
        },
      });
      this.setData({
        submit: true,
      });
    });
  },

  textareaAInput(e) {
    this.setData({
      textInput: e.detail.value,
    });
  },

  information_deskChange(e) {
    this.setData({
      information_desk: parseInt(e.detail.value),
    });
  },

  // intervalChange(e) {
  //   this.setData({
  //     interval: this.data.interval_picker[e.detail.value],
  //     expostor_desk: e.detail.value == 0 ? 4 : 2
  //   })
  // },

  dateChange(e) {
    // var datesend = new Date(e.detail.value)
    // var month = datesend.getMonth() + 1
    // var datesend_temp = datesend.getFullYear()+ '年' + month + '月' + datesend.getDate() + '日'
    this.setData({
      date: e.detail.value,
      // datesend:datesend_temp
    });

  },
  TimeChange(e) {
    if (e.currentTarget.dataset.pickertype === 'begin') {
      this.setData({
        time_begin: e.detail.value,
      });
    } else {
      this.setData({
        time_end: e.detail.value,
      });
    }

  },
  ChooseImage() {
    let _this = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        wx.showLoading({
          title: '上传图片中..',
          mask: 'true',
        });
        wx.cloud.uploadFile({
          cloudPath: util.formatName(new Date()),
          filePath: res.tempFilePaths[0],
          success: res => {
            wx.hideLoading();
            if (_this.data.imgList.length !== 0) {
              _this.setData({
                imgList: _this.data.imgList.concat(res.fileID),
              });
            } else {
              _this.setData({
                imgList: res.fileID,
              });
            }
          },
          fail: () => {
            wx.hideLoading();
            // handle error
            wx.showModal({
              title: '温馨提示',
              content: '图片上传失败，请联系管理员',
              cancelText: '取消',
              confirmText: '确认',
              success: () => {},
            });
          },
        });
      },
    });
  },
  ViewImage() {
    let urls = [this.data.imgList];
    wx.previewImage({
      urls,
    });
  },
  DelImg() {
    wx.showModal({
      title: '温馨提示',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          // this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: [],
          });
        }
      },
    });
  },

  /**
   * 宿舍选择框
   *
   * @param {*} e
   */
  dormitoryChange(e) {
    this.setData({
      dormitory: e.detail.value,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let date = util.pickerData(new Date());
    let place = wx.getStorageSync('historyPlace');
    this.setData({
      date,
      captain: app.globalData.captain,
      place,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        title: this.data.date + '日报班任务',
        path: 'pages/onDutyindex/signup/signup?_id=' + id + '&type=share',
      };
    }
  },
});
