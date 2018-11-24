let inputCheckMap = {
  account: [{
    reg: /^[a-zA-Z0-9]{1,20}$/,
    msg: '账号为1-20位，数字及字母,不得含有空格'
  }],
  password: [{
    reg: /^.{8,16}$/,
    msg: `密码不能为空,长度为8-16位`
  },
  {
    reg: /^(?!.*[<>/\\\s])/,
    msg: `密码不能含空格<>/\\`
  }],
  name: [{
    reg: /^(?!_)(?!.*?_$)[\u4e00-\u9fa5a-zA-Z\s]{1,30}$/,
    msg: `名字只能为中文或字母,不能仅含有空格,且字符长度不能超过30个`
  }],
  jobNumber: [{
    reg: /^[a-zA-Z0-9\u4e00-\u9fa5._-]{1,30}$/,
    msg: '工号不能超过30个字符,不得含有空格，由中文、数字、字母及_.-组成'
  }],
  // IC卡号
  icNumber: [{
    reg: /(^[0-9]{1,30}$)/,
    msg: 'IC卡号由1到30位纯数字组成,不得含有空格'
  }],
  // 手机号、电话
  phone: [{
    reg: /(^[0-9]{8}$)|(^[0-9]{10}$)|(^[0-9]{11}$)/,
    msg: '手机号由11/10/8位纯数字组成,不得含有空格'
  }],
  // 身份证
  idNumber: [{
    reg: /^(?!.*[<>/\\\s])/,
    msg: `身份证号码不能含有空格`
  },
  {
    reg: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}(([1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
    msg: '请输入正确的身份证号码'
  }],
  config_password: [{
    reg: /(^[0-9]{4}$)/,
    msg: `密码只能为数字,不能为空,长度为4位`
  },
  {
    reg: /^(?!.*[<>/\\\s])/,
    msg: `密码不能含空格<>/\\`
  }],
  admin_password: [{
    reg: /^.{8,16}$/,
    msg: `密码不能为空,长度为8-16位`
  },
  {
    reg: /^(?!.*[<>/\\\s])/,
    msg: `密码不能含空格<>/\\`
  }],
  admin_password_confirm: [{
    reg: /^.{8,16}$/,
    msg: `密码不能为空,长度为8-16位`
  },
  {
    reg: /^(?!.*[<>/\\\s])/,
    msg: `密码不能含空格<>/\\`
  }]
}
let ctx = null
export default {
  initCtx(that) {
    ctx = that
  },
  checkInput(key, value, errKey, errObj = null) {
    for (let i = 0; i < inputCheckMap[key].length; i++) {
      if (!inputCheckMap[key][i].reg.test(String(value).trim())) {
        if (errObj) {
          // errObj只需要是字符串即可
          ctx[errObj][errKey] = inputCheckMap[key][i].msg
        } else {
          ctx.errMsg = inputCheckMap[key][i].msg
        }
        return false
      }
    }
    if (errObj) {
      ctx[errObj][errKey] = ''
    } else {
      ctx.errMsg = ''
    }
    return true
  }
}
