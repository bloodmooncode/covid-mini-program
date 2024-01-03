// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();
cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  try {
    const submitInfo = event;
    return await db.collection('iaInfo').add({
      data: submitInfo,
    });
  } catch (e) {
    // console.error(e);
  }
};
