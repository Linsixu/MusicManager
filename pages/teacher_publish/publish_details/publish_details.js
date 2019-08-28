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
    modifyDiarys: false,

    //时间器
    isPickerRender: false,
    isPickerShow: false,
    startTime: "",
    endTime: "",
    accounts: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"],
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
  /***时间选择器**/
  pickerShow: function () {
    wx.hideKeyboard();
    console.log("123")
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  pickerHide: function () {
    console.log("333")
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
  onLoad: function () {
    this.dialog = this.selectComponent(".mydialog");
  },
  addClassMsg: function (event) {
    that = this;
    console.log("event="+event.value);
    var className = event.detail.value.class_name;
    var start_time = event.detail.value.start_time;
    var end_time = event.detail.value.end_time;
    var phone = event.detail.value.phone_number;
    var weekend = event.detail.value.weekend;
    console.log("event", event)
    console.log("start_time=" + start_time)
    console.log("end_time=" + end_time)
    if (className == null || className == '') {
      app.showToast("课堂名字不能为空", that, 1000);
    }
    else if (phone == null || phone == '') {
      app.showToast("手机号码不能为空", that, 1000);
    }
    else if (start_time == '' || start_time == null || end_time == '' || end_time == null) {
      app.showToast("开始与结束时间不能为空", that, 1000);
    } else if (weekend == '' || weekend == null) {
      app.showToast("星期不能为空", that, 1000);
    } 
    else {
      that.setData({
        loading: true
      })
      var currentUser = Bmob.User.current();
      console.log("登陆用户信息" + currentUser)
      if (currentUser == null) {
        app.showToast("请登陆", that, 1000);
        return
      }
      var teahername = currentUser.self_name;
      console.log(teahername)
      const query = Bmob.Query('TeacherClass');
      query.set("start_time", start_time)
      query.set("teacher_name", teahername)
      query.set("end_time", end_time)
      query.set("class_name", className)
      query.set("phone",phone)
      query.set("weekend", weekend)
      query.save().then(res => {
        console.log(res + "上传成功");
        const pointer = Bmob.Pointer('_User');
        const poiID = pointer.set(currentUser.objectId);
        console.log("id=" + currentUser.objectId);
        var teacherId = res.objectId;
        console.log("teacherId=" + teacherId);
        query.get(teacherId).then(res => {
          res.set('belong', poiID)
          res.save()
          console.log(res + "成功123")
        })
        app.showToast("发布成功", that, 1000);
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          });
        }, 800);
      }).catch(err => {
        console.log(err)
      })
    }
  },

  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
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