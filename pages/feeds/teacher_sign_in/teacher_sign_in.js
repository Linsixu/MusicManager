//index.js
//获取应用实例
var Bmob = require('../../../dist/Bmob-1.7.1.min.js');
var common = require('../../../utils/common.js');
var app = getApp();
var that;
Page({

  data: {
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    diaryList: [],
    className: '',
    teacher_name: '',
    phone: '',
    objectId: 0,
    belong: [],
    modifyDiarys: false,

    //时间器
    isPickerRender: false,
    isPickerShow: false,
    startTime: "",
    endTime: "",
    pickerConfig: {
      endDate: true,
      column: "minute",
      dateLimit: true,
      initStartTime: "2019-01-01 12:32:44",
      initEndTime: "2019-12-01 12:32:44",
      limitStartTime: "2015-05-06 12:32:44",
      limitEndTime: "2055-05-06 12:32:44"
    }
  },
 


  /**时间选择器***/

  onReady: function (e) {
  },

  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    if(currentUser == null){
      wx.navigateTo({
        url: '../../teacher_register/teacher_register'
      })
    }
    this.dialog = this.selectComponent(".mydialog");
    that.objectId = options.objectId;
    that.belong = options.belong;
    that.teacher_name = options.teacher_name;
    that.startTime = options.start_time;
    that.endTime = options.end_time;
    that.className = options.class_name;
    console.log("----------objectId----------", that.teacher_name);
    this.setData({
      startTime: options.start_time,
      endTime: options.end_time,
      className: options.class_name,
      phone: options.phone,
    });
  },

  showRemind: function (event) {
    that = this;
    var currentUser = Bmob.User.current();
    wx.showModal({
      title: '预约提示',
      content: '是否预约',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.signInMsg(this);
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  },

  signInMsg: function (event) {
    that = this;
    var currentUser = Bmob.User.current();

    const query = Bmob.Query('TeacherClass');
    query.get(that.objectId).then(res => {
      console.log(res)
      if(res.sign_in == true){
        app.showToast("已被预约", that, 1000);
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          });
        }, 1000);
      }else{
        //更新数据
        res.set('sign_in',true);
        //添加课程与学生关系
        const pointer = Bmob.Pointer('_User');
        const poiID = pointer.set(currentUser.objectId);
        res.set('belong_student', poiID)
        
        //插入到学生签到数据库中
        const pointer1 = Bmob.Pointer('TeacherClass');
        const poiMsg = pointer1.set(that.objectId);
        const query1 = Bmob.Query('StudentSignIn');
        console.log("teacher_name", that.endTime)
        query1.set("teacher_name", that.teacher_name);
        query1.set("start_time", that.startTime);
        query1.set("end_time", that.endTime);
        query1.set("class_name", that.className);
        query1.set("belong", poiMsg);
        query1.save().then(res1 => {
          console.log(res1)
          res.save()
          app.showToast("已成功预约", that, 1000);
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            });
          }, 1000);
        }).catch(err1 => {
          console.log(err1)
          app.showToast("预约失败", that, 1000);
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            });
          }, 1000);
        })
        
      }
    }).catch(err => {
      console.log(err)
    })
  },

  noneWindows: function () {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function () {
    var currentUser = Bmob.User.current();
    console.log("teacher=" + currentUser.isteacher);
    if (currentUser == null) {
      app.showToast("请登陆", that, 1000);
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/setting/setting'
        })
      }, 1000);
    } else if (currentUser.isteacher == false) {
      app.showToast("不是老师无法使用", that, 1000);
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/setting/setting'
        })
      }, 1000);
    } else {
      getList(this);
    }
    // wx.getSystemInfo({
    //   success: (res) => {
    //     that.setData({
    //       windowHeight: res.windowHeight,
    //       windowWidth: res.windowWidth
    //     })
    //   }
    // })
  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  toAddDiary: function () {
    wx.navigateTo({
      url: 'publish_details/publish_details'
    })
  },
  closeLayer: function () {
    that.setData({
      writeDiary: false
    })
  },
  deleteDiary: function (event) {

  },
  toModifyDiary: function (event) {

  },
  modifyDiary: function (e) {
    var t = this;
    modify(t, e)
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getList(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    getList(this);
  },
  inputTyping: function (e) {
    //搜索数据
    getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },
  closeAddLayer: function () {
    that.setData({
      modifyDiarys: false
    })
  },
})


/*
* 获取数据
*/
function getList(t, k) {
  that = t;
  const query = Bmob.Query('TeacherClass');
  var list = [];
  query.find().then(res => {
    that.setData({
      diaryList: res
    }, function () {
    })
  });
}