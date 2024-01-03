// pages/index/psy/index.js
const db = wx.cloud.database();
const pcConsultant = db.collection('pcConsultant');
const pcPublicClass = db.collection('pcPublicClass');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consultantInfo: [],
    publicClassInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const _this = this;
    Promise.all([_this.getConsultantData(), _this.getPosterData()]).then(function (values){
      _this.setData({
        consultantInfo: values[0].data,
        publicClassInfo: values[1].data[0],
      });
    });
  },

  getConsultantData() {
    return new Promise((resolve, reject) => {
      pcConsultant.where({
        // 状态为1时，说明可以接受咨询
        status: 1,
      }).get({
        success(res){
          resolve(res);
        },
        fail(err){
          reject(err);
        },
      });
    });
  },

  getPosterData(){
    return new Promise((resolve, reject) => {
      pcPublicClass.where({
        // 状态为1时，说明可以接受咨询
        status: 1,
      }).get({
        success(res){
          resolve(res);
        },
        fail(err){
          reject(err);
        },
      });
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
