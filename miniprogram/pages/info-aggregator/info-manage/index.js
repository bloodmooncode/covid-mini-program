// pages/info-aggregator/info-manage/index.js
// const db = wx.cloud.database();
// const iaAdmin = db.collection('iaAdmin');
// const iaInfo = db.collection('iaInfo');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onCheckingList: [],
    checkedList: [],
    refusedList: [],
    cateItems: [{
        cateId: 1,
        cateName: '待审核',
      },
      {
        cateId: 2,
        cateName: '已审核',
      },
      {
        cateId: 3,
        cateName: '已拒绝',
      },
    ],
    curNav: 1,
    curIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取数据,接入触底加载
    this.getData();
  },

  getData() {
    return new Promise((resolve, reject) => {
      const _this = this;
      wx.cloud.callFunction({
        name: 'iaGetAllInfo',
        success(res) {
          let data = res.result.list;
          let onCheckingList = [];
          let checkedList = [];
          let refusedList = [];
          for (let i = 0; i < data.length; i++) {
            // 对数据里面的date型获取到本地后转换为的字符串处理
            let dateStr = data[i].submitDate.split('T');
            let [date, time] = dateStr;
            data[i].submitDate = date + '    ' + time.split('.')[0];
            // 根据类型分类到各个列表中
            if (data[i].status === -1) {
              refusedList.push(data[i]);
            } else if (data[i].status === 0) {
              onCheckingList.push(data[i]);
            } else {
              checkedList.push(data[i]);
            }
            _this.setData({
              onCheckingList,
              checkedList,
              refusedList,
            });
          }

          _this.setData({
            infoList: data,
          });
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });

  },

  check(event) {
    wx.showLoading({
      title: '审核中',
      mask: true,
    });

    const _this = this;
    let {
      index,
    } = event.currentTarget.dataset;
    let {
      option,
    } = event.currentTarget.dataset;
    wx.cloud.callFunction({
      name: 'iaCheck',
      data: {
        _id: this.data.onCheckingList[index]._id,
        option,
      },
      success() {
        wx.hideLoading();
        _this.onLoad();
        wx.showToast({
          title: '完成审核',
        });
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '发生错误，请重试',
        });
      },
    });
  },

  switchRightTab(e) {
    let {
      id
    } = e.target.dataset,
      index = parseInt(e.target.dataset.index);
    this.setData({
      curNav: id,
      curIndex: index,
    });
  },

  delete(e) {
    const _this = this;
    const {
      option
    } = e.currentTarget.dataset;
    let deleteId = '';
    if (option === 'checked') {
      deleteId = _this.data.checkedList[e.currentTarget.dataset.index]._id;
    } else if (option === 'refused') {
      deleteId = _this.data.refusedList[e.currentTarget.dataset.index]._id;
    }
    wx.showLoading({
      title: '删除中……',
      mask: true,
    });
    wx.cloud.callFunction({
      name: 'iaDeleteInfo',
      data: {
        deleteId,
      },
      success() {
        wx.hideLoading();
        _this.onLoad();
        wx.showToast({
          title: '删除成功',
        });
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '删除失败，请重试',
          icon: 'error',
        });
      },
    });
  },

  preview(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let {
      option
    } = e.currentTarget.dataset;
    let imageIndex = e.currentTarget.dataset.imageindex;
    let imageArray = [];
    switch (option) {
      case 'onChecking': {
        imageArray.push(this.data.onCheckingList[index].image[imageIndex]);
        break;
      }
      case 'checked':{
        imageArray.push(this.data.checkedList[index].image[imageIndex]);
        break;
      }
      case 'refused':{
        imageArray.push(this.data.refusedList[index].image[imageIndex]);
        break;
      }
    }

    wx.previewImage({
      urls: imageArray,
    });
  }
});