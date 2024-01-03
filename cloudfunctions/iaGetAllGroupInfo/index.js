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
    const { type } = event;
    const { page } = event;
    return await db.collection('iaInfo').aggregate()
      .match({
        status: 1,
        type,
      })
      .sort({
        submitDate: -1,
      })
      .skip(page)
      .end();
  } catch (e) {
    return e;
  }
};
