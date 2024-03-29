const formatNumber = num => {
  const n = String(num);
  return n[1] ? n : '0' + n;
};

const formatName = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber) + [hour, minute, second].map(formatNumber) + '.png';
};
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const pickerData = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join('-');
};

const messageData = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return [year].map(formatNumber) + '年' + [month].map(formatNumber) + '月' + [day].map(formatNumber) + '日 ' + [hour, minute].map(formatNumber).join(':');
};


module.exports = {
  formatTime,
  formatName,
  pickerData,
  messageData,
};
