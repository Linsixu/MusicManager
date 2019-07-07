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
    belong:[],
    signIn:false,
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

  test: function () {
    app.showToast("请登陆", that, 1000);
  },
  /***时间选择器**/
  pickerShow: function () {
    console.log("123")
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  pickerHide: function () {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function (e) {
    console.log("3333")
    console.log("picker发送选择改变，携带值为", e.detail.value);
    console.log(this.data.sensorList);

    this.getData(this.data.sensorList[e.detail.value].id);
    // let startDate = util.formatTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
    // let endDate = util.formatTime(new Date());
    this.setData({
      index: e.detail.value,
      sensorId: this.data.sensorList[e.detail.value].id
      // startDate,
      // endDate
    });
  },
  setPickerTime: function (val) {
    console.log("setPickerTime")
    console.log(val);
    let data = val.detail;
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime
    });
  },
  /**时间选择器***/

  onReady: function (e) {
  },

  onLoad: function (options) {
    that = this;
    if(options.objectId != null){
      console.log("----------object----------", options);
      this.dialog = this.selectComponent(".mydialog");
      that.objectId = options.objectId;
      that.belong = options.belong;
      if(options.sign_in == "true"){
        that.signIn = true;
      }else{
        that.signIn = false;
      }
      console.log("----------sign_in----------", that.signIn);
      this.setData({
        startTime: options.start_time,
        endTime: options.end_time,
        className: options.class_name,
        phone: options.phone,
        signIn: that.signIn,
      });
    }else{
      app.showToast("请先登陆", that, 1000);
      setTimeout(function () {
        wx.navigateBack({
          delta: 1,
        });
      }, 1000);
    }
  },

  delete: function () {
    that = this;
    var currentUser = Bmob.User.current();
    if (currentUser.objectId != that.belong) {
      app.showToast("不能修改别的老师信息", that, 1000);
      return
    }
    wx.showModal({
      title: '删除提示',
      content: '是否删除该信息',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击主操作');
          const query = Bmob.Query('TeacherClass');
          query.destroy(that.objectId).then(res => {
            app.showToast("删除成功", that, 1000);
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              });
            }, 1000);
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  },

  radioChange: function (e) {
    that = this;
    if (e.detail.value == "true"){
      that.signIn = true;
    }else{
      that.signIn = false;
    }
  },

  updateMsg: function (event){
    that = this;
    var currentUser = Bmob.User.current();
    if (currentUser.objectId != that.belong) {
      app.showToast("不能修改别的老师信息", that, 1000);
      return
    }
    var className = event.detail.value.class_name;
    var start_time = event.detail.value.start_time;
    var end_time = event.detail.value.end_time;
    var phone = event.detail.value.phone_number;
    var finally_sign_in = that.signIn;
    console.log('radio发生change事件，携带value值为：', typeof (finally_sign_in));
    const query = Bmob.Query('TeacherClass');
    query.get(that.objectId).then(res => {
      console.log(res)
      res.set('class_name', className);
      res.set('phone', phone);
      res.set('start_time', start_time);
      res.set('end_time', end_time);
      res.set('sign_in', finally_sign_in);
      //删除关联到学生预定表
      if (!finally_sign_in){
        res.unset("belong_student");
        var signInMsgId = res.sign_in_msg.objectId;
        if (signInMsgId != null){
          res.unset("sign_in_msg");
          //删除学生预定表某个信息
          const query3 = Bmob.Query('StudentSignIn');
          query3.destroy(signInMsgId).then(res2 => {
            console.log("-----成功删除预定信息表内容",res2)
          }).catch(err2 => {
            console.log(err2)
          })
        }
      }
      res.save();
      app.showToast("更新成功", that, 1000);
      setTimeout(function () {
        wx.navigateBack({
          delta: 1,
        });
      }, 1000);
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
    console.log("-----currentUser-------", currentUser);
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