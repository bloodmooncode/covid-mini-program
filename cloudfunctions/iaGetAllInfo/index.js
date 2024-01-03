// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();
cloud.init();


// 云函数入口函数
exports.main = async () => {
  try {
    return await db.collection('iaInfo').aggregate()
      .match({

      })
      .limit(2000)
      .sort({
        submitDate: -1,
      })
      .end();
  } catch (e) {
    return e;
  }
};
