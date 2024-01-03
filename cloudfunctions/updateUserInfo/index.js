// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const db = cloud.database();
  let userTable = db.collection('user');
  // 是否队长
  let userData = await userTable.doc(openid).get().then(function (res) {
    return {
      flag: true,
      data: res.data,
    };
  }).catch(() => {
    return {
      flag: false,
    };
  });
  // 设置队长属性
  let captain = false;
  if (userData.flag && userData.data.captain) {
    captain = true;
  }
  let result = {
    group: '西北工业大学疫情防控志愿服务',
    captain,
    name: event.name,
    college: event.college,
    dormitory: event.dormitory,
    phone: event.phone,
    stuid: event.stuid,
    openid,
    sfid: event.sfid,
  };
  // 插入或更新
  return await userTable.doc(openid).set({
    data: {
      group: '西北工业大学疫情防控志愿服务',
      captain,
      name: event.name,
      college: event.college,
      dormitory: event.dormitory,
      phone: event.phone,
      stuid: event.stuid,
      sfid: event.sfid,
    },
  }).then(function (res) {
    return { res, result };
  });
};
