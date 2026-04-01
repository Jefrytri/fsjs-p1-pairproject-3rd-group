const QRCode = require('qrcode')

async function generatePostQR(postId) {
  const url = `http://localhost:3000/posts/${postId}`
  return await QRCode.toDataURL(url)
}

module.exports = { generatePostQR }