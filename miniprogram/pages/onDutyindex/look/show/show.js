/* eslint-disable camelcase,prefer-destructuring */
let _id;
const db = wx.cloud.database();
const onDuty = db.collection('onDuty');
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    captain: false,
    degs: [0, 0, 0, 0, 0, 0],
    tags: [],
    onduty: {},
    modalName: null,
    value: '',
  },

  delettag(e) {
    let member = e.currentTarget.dataset.work + '.member';
    onDuty.doc(_id).update({
      data: {
        [member]: _.pull(e.currentTarget.dataset.name),
        count: _.inc(-1),
      },
    });
  },
  add_member(e) {
    let member = e.currentTarget.dataset.work + '.member';
    let openid = Math.random().toString(36).substring(2);
    let nickname = e.detail.value;
    let stuid = '手动添加';
    let phone = '手动添加';
    let submit_time = new Date();
    onDuty.doc(_id).update({
      data: {
        count: _.inc(1),
        // [member]: _.addToSet(add_userinfo)
        [member]: _.push({ openid, nickname, stuid, phone, submit_time }),
      },
    });
  },
  rotateAnim(event) {
    //  console.log(event.currentTarget.dataset.id)
    let deg = this.data.degs[event.currentTarget.dataset.id];
    deg = deg == 0 ? 90 : 0;
    this.setData({
      ['degs[' + event.currentTarget.dataset.id + ']']: deg,
    });
  },
  sendone(nickname, openid, stuid) {
    // var timegang=this.data.onduty.date,
    // timegang = timegang.replace(/(-)/, '年');
    // timegang = timegang.replace(/(-)/, '月');
    // timegang = timegang + '日'
    wx.cloud.callFunction({
      name: 'send',
      data: {
        touser: openid,
        page: 'pages/onDutyindex/look/detail/detail?_id=' + _id,
        name1: nickname,
        number: stuid,
        time: this.data.onduty.date,
      },
    });
  },
  reopen() {
    onDuty.doc(_id).update({
      data: {
        progress: true,
      },
    });
  },

  finish() {
    wx.showModal({
      content: '结束报名将推送通知给队员（只能一次）',
      confirmText: '确定通知',
      cancelText: '我再想想',
      confirmColor: '#68C08B',
      complete: res0 => {
        if (res0.confirm) {
          onDuty.doc(_id).update({
            data: {
              progress: false,
            },
          });
          onDuty.doc(_id).get().then(ssd => {
            ssd.data.information_desk.member.forEach(element => {
              this.sendone(element.nickname, element.openid, element.stuid);
            });
            // ssd.data.openid.forEach(element => {
            //   console.log('调用到这里了')
            //   this.sendone(element)
            // });
          });

        }
      },
    });

  },

  excel() {
    let _this = this;
    wx.showLoading({
      title: '生成中..',
    });

    wx.cloud.callFunction({
      name: 'excel',
      data: {
        _id,
      },
      success(res) {
        wx.hideLoading();
        wx.showModal({
          content: '请选择保存方式',
          confirmText: '复制地址',
          confirmColor: '#68C08B',
          cancelText: '保存本地',
          complete: res0 => {
            if (res0.confirm) {
              _this.getFileUrl(res.result.fileID);
            } else if (res0.cancel) {
              _this.download(res.result.fileID);
            }
          },
        });
      },
    });
  },

  download(fileID) {
    wx.cloud.downloadFile({
      fileID,
      success: res1 => {

        wx.saveFile({
          tempFilePath: res1.tempFilePath,
          success(res2) {

            wx.showModal({
              content: '已保存在本地' + res2.savedFilePath + '目录下,是否现在打开',
              confirmColor: '#68C08B',
              complete: res3 => {
                if (res3.confirm) {

                  wx.openDocument({
                    filePath: res2.savedFilePath,
                    showMenu: true,
                  });
                }
              },
            });
          },
        });
      },
    });
  },

  //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl(fileID) {
    let _this = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        _this.setData({
          fileUrl: res.fileList[0].tempFileURL,
        });
        _this.copyFileUrl();
      },
    });
  },

  //复制excel文件下载链接
  copyFileUrl() {
    let _this = this;
    wx.setClipboardData({
      data: _this.data.fileUrl,
      success() {
        wx.getClipboardData({
          success() {
            wx.showToast({
              title: '已复制在剪贴板',
            });
          },
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    _id = options._id;
    let _this = this;
    onDuty.doc(_id).watch({
      onChange(snapshot) {
        let onduty = snapshot.docChanges[0].doc;
        _this.setData({
          onduty,
          value: '',
        });
      },
      onError(){},
    });
  },
  showImg(){
    wx.previewImage({
      urls: [this.data.onduty.imgList],
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
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        title: this.data.onduty.date + '日报班任务',
        path: 'pages/onDutyindex/signup/signup?_id=' + _id + '&type=share',
      };
    }
  },
});
