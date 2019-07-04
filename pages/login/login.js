const app = getApp();
var Bmob = require('../../dist/Bmob-1.7.1.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit: function (e) {
    var that = this;
    console.log(e.detail.value);
    var username = e.detail.value.phone;
    var psd = e.detail.value.pwd;
    if(username == ''){
      app.showToast("手机号码不能为空", that, 1000);
      return
    }
    if (psd == '') {
      app.showToast("密码不能为空", that, 1000);
      return
    }

    Bmob.User.login(username, psd).then(res => {
      console.log(res)
      app.showToast("成功登陆", that, 1000);
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/setting/setting'
        })
      }, 1000);
    }).catch(err => {
      console.log(err)
      if(err.code == 101){
        app.showToast("用户或密码不正确", that, 1000);
      }
    });
  },

  forJumpToRegister: function(e) {
    wx.navigateTo({
      url: '/pages/register/register',
      events: {
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        console.log(res.data);
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  }
})