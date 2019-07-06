var app = getApp();
var Bmob = require('../../dist/Bmob-1.7.1.min.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    avatar: '../../images/setting_user_avatar.png', 
    name:'(未登陆)',
    childname:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    menuitems: [
      { text: '登录账号', url: '../login/login', icon: '../../images/icon.png', tips: '' },
      { text: '教师注册账号', url: '../teacher_register/teacher_register', icon: '../../images/setting_teacher.png', tips: '' },
      { text: '家长注册账号', url: '../register/register', icon: '../../images/setting_parent.png', tips: '' },
      { text: '教师发布流程', url: '../teacher_publish/teacher_publish', icon: '../../images/setting_teacher_publish.png', tips: '' },
      { text: '家长取消预约', url: '../register/register', icon: '../../images/setting_parent_manager.png', tips: '' },
      { text: '学生课程签到', url: '../student/student_sign_in/student_sign_in', icon: '../../images/student_check_in.png', tips: '' }
    ]
  },

  setAvatarData: function(){
    var that = this;
    that.setData({
      avatar: '../../images/setting_user_avatar.png'
    })
  },

  jumpToLogin: function(){
    //获取用户当前信息
    let current = Bmob.User.current()
    console.log(current)
    if(current != null){
      return
    }
    wx.navigateTo({
      url: '../../pages/login/login',
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
  },

  jumpToTeacherRegister: function(){
    //获取用户当前信息
    let current = Bmob.User.current()
    console.log(current)

    wx.navigateTo({
      url: 'pages/teacher_register/teacher_register',
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // app.getUserInfo(function (data) {
    //   that.setData({
    //     userInfo: data
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
    var that = this;
    let current = Bmob.User.current()
    if (current != '' && current != null) {
      that.setData({
        name: current.username+'(已登陆)',
        childname: current.self_name
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})