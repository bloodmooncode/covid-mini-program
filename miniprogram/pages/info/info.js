// pages/info/info.js
let app = getApp();
Page({
  data: {
    name: '',
    college: 0,
    dormitory: 0,
    phone: '',
    stuid: '',
    sfid: '',
    flag: false,
    show: false,
    colleges: [
      '未选择学院',
      '航空学院',
      '航天学院',
      '航海学院',
      '材料学院',
      '机电学院',
      '力学与土木建筑学院',
      '动力与能源学院',
      '电子信息学院',
      '自动化学院',
      '计算机学院',
      '数学与统计学院',
      '物理科学与技术学院',
      '化学与化工学院',
      '管理学院',
      '公共政策与管理学院',
      '软件学院',
      '生命学院',
      '外国语学院',
      '教育实验学院',
      '国际教育学院',
      '国家保密学院',
      '马克思主义学院',
      '西北工业大学伦敦玛丽女王大学工程学院',
      '微电子学院',
      '网络空间安全学院',
      '民航学院',
      '生态环境学院',
      '体育部',
      '无人系统技术研究院',
      '文化遗产研究院',
      '柔性电子研究院',
      '医学研究院',
      '光电与智能研究院',
      '其他',
    ],
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
  onLoad() {
    this.getUserInfo();
    this.getShowFlag();
  },

  getShowFlag() {
    let _this = this;
    let db = wx.cloud.database();
    let table = db.collection('show');
    table.get().then(res => {
      // eslint-disable-next-line prefer-destructuring
      let { show } = res.data[0];
      if (show) {
        _this.setData({
          show: true,
        });
      } else {
        _this.setData({
          college: 1,
          phone: '15945678900',
          stuid: '2019300000',
          sfid: '430421200011100091',
          dormitory: 1,
        });
      }
    });
  },

  toIndex() {
    wx.navigateTo({
      url: '/pages/onDutyindex/onDutyindex',
    });
  },

  /**
   * 更新用户信息 更新后会保存到storage
   */
  updateUserInfo() {
    if (this.check()) {
      let _this = this;
      wx.showLoading({
        title: '更新中',
      });
      wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: {
          name: this.data.name,
          college: this.data.college,
          dormitory: this.data.dormitory,
          phone: this.data.phone,
          stuid: this.data.stuid,
          sfid: this.data.sfid,
        },
      }).then(function () {
        wx.showToast({
          title: '信息上传成功',
          icon: 'none',
        });
        _this.setData({
          flag: true,
        });
        // _this.storeUserInfo(res.result.result)
        wx.redirectTo({
          url: '/pages/onDutyindex/onDutyindex',
        });
      }).catch(() => {
        wx.showToast({
          title: '信息上传错误',
          icon: 'none',
        });
      });
    }
  },

  storeUserInfo(userInfo) {
    wx.setStorageSync('user', userInfo);
  },
  getUserInfoFromStorage() {
    return wx.getStorageSync('user');
  },

  /**
   * 获取用户信息，若缓存有 则不执行
   * 获取后，会用保存新数据
   */
  getUserInfo() {
    // let userInfo = this.getUserInfoFromStorage()
    // if (userInfo != '') {
    //     app.globalData = userInfo
    //     this.setData({
    //         name: userInfo.name,
    //         dormitory: userInfo.dormitory,
    //         college: userInfo.college,
    //         phone: userInfo.phone,
    //         stuid: userInfo.stuid,
    //         sfid: userInfo.sfid,
    //         flag: true
    //     })
    //     return
    // }
    let _this = this;
    wx.cloud.callFunction({
      name: 'getUserInfo',
    }).then(function (res) {
      let {
        result,
      } = res;
      if (result.flag) {
        if (result.data.dormitory === undefined) {
          wx.showToast({
            title: '请完善宿舍信息',
            icon: 'none',
          });
        }
        result.data['openid'] = result.data['_id'];
        // _this.storeUserInfo(result.data)
        app.globalData = result.data;
        _this.setData({
          name: result.data.name,
          college: result.data.college,
          dormitory: result.data.dormitory,
          phone: result.data.phone,
          stuid: result.data.stuid,
          sfid: result.data.sfid,
          flag: true,
        });
      } else {
        wx.showToast({
          title: '未注册',
          icon: 'none',
        });
        _this.setData({
          flag: false,
        });
      }
    });
  },

  /**
   * 检查需要输入的字段
   */
  check() {
    if (this.data.name === '' || this.data.college === 0 || this.data.dormitory === 0 || this.data.stuid === '') {
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
      });
      return false;
    } else if (!this.checkMobile(this.data.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      });
      return false;
    } else if (!this.checkId(this.data.sfid) && !this.checkPasspoort(this.data.sfid)) {
      wx.showToast({
        title: '身份证/护照格式不正确',
        icon: 'none',
      });
      return false;
    } else {
      return true;
    }
  },

  /**
   * 检查护照号
   *
   * @param {护照号} str
   */
  checkPasspoort(str) {
    let re = /^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g|E|e]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/;
    return re.test(str);
  },

  /**
   * 身份证检查
   * @param {*} id
   */
  checkId(id) {
    // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
    let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if (!format.test(id)) {
      return false;
    }
    //区位码校验
    //出生年月日校验  前正则限制起始年份为1900;
    let year = id.substr(6, 4),
      month = id.substr(10, 2),
      date = id.substr(12, 2),
      time = Date.parse(month + '-' + date + '-' + year),
      nowTime = Date.parse(new Date()),
      dates = new Date(year, month, 0).getDate();
    if (time > nowTime || date > dates) {
      return false;
    }
    //校验码判断
    let c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let idArray = id.split('');
    let sum = 0;
    for (let k = 0; k < 17; k++) {
      sum += parseInt(idArray[k]) * parseInt(c[k]);
    }
    return idArray[17].toUpperCase() === b[sum % 11].toUpperCase();
  },

  /**
   * 检查手机号码格式
   *
   * @param {*} str
   */
  checkMobile(str) {
    let re = /^1\d{10}$/;
    return re.test(str);
  },

  /**
   * 学院选择框
   *
   * @param {*} e
   */
  bindPickerChange(e) {
    this.setData({
      college: e.detail.value,
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

});
