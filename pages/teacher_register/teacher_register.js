const app = getApp();
var Bmob = require('../../dist/Bmob-1.7.1.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    this.dialog = this.selectComponent(".mydialog");
  },

  register: function (e) {
    var that = this;
    var name = e.detail.value.username;
    var psd = e.detail.value.password;
    var againtpsd = e.detail.value.password1;
    var teahcer_name = e.detail.value.teahcer_name;

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(name)) {
      app.showToast("请输入正确的手机号码", that, 1000);
      return
    }
    if (name == '') {
      app.showToast("请输入手机号码", that, 1000);
      return
    }
    if (psd == '') {
      app.showToast("请输入密码", that, 1000);
      return
    }

    if (againtpsd == '') {
      app.showToast("请再次输入密码验证", that, 1000);
      return
    }

    if (teahcer_name == '') {
      app.showToast("请填写教师名称", that, 1000);
      return
    }

    let params = {
      username: name,
      password: psd,
      teacher_name: teahcer_name,
      phone: name,
      isteacher: true,
      self_name: teahcer_name,
    }
    if (psd != againtpsd) {
      app.showToast("两次输入密码不同", that, 1000);
      return
    }
    Bmob.User.register(params).then(res => {
      app.showToast("注册成功", that, 1000);
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/setting/setting'
        })
      }, 1000);
    }).catch(err => {
      console.log(err)
      if (err.code == 202) {
        app.showToast("该用户已存在", that, 1000);
      }
    });
    console.log(e.detail.value);
  }
})