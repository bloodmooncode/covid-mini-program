Page({
  data: {},
  onLoad(options) {
    const { url = '', filename = '' } = options;
    if (!url || !filename) {
      return;
    }

    const downloadUrl = decodeURIComponent(url);

    wx.downloadFile({
      url: downloadUrl,
      success({ tempFilePath }) {
        wx.openDocument({
          filePath: tempFilePath,
          showMenu: true,
        });
      },
    });
  },
});
