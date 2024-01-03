// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

/**
 * 获取用户信息 若已注册返回flag+data 反之返回flag:false
 * 
 */
exports.main = async () => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const db = cloud.database();
  let userTable = db.collection('user');
  return await userTable.doc(openid).get().then(function (res){
    return {
      flag: true,
      data: res.data,
    };
  }).catch(() => {
    return {
      flag: false,
    };
  });
};
