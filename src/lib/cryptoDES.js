import CryptoJS from 'crypto-js'
let DES = {
  KEY: 'bb635dd47e5861f717472df95652077356a8f38dea6347851c191f66b7cf9dc8',
  encodeData: function (data) {
    if (data) {
      let key = CryptoJS.enc.Utf8.parse(this.KEY)
      return CryptoJS.DES.encrypt(data, key, {
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.ECB
      }).toString()
    } else {
      return ''
    }
  },
  decodeData: function (data) {
    if (data) {
      try {
        let key = CryptoJS.enc.Utf8.parse(this.KEY)
        return CryptoJS.DES.decrypt(data, key, {
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.ECB
        }).toString(CryptoJS.enc.Utf8)
      } catch (e) {
        return 'decode failure'
      } finally {
      }
    } else {
      return ''
    }
  }
}
export default DES
