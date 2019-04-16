function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function toThousands(num) {
    return (num || "").replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
function hashCode(s) {
  let h;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  if (h < 0) {
    h *= -1;
  }
  return h;
}
module.exports = {
  formatTime: formatTime,
  toThousands:toThousands,
  hashCode: hashCode
}
