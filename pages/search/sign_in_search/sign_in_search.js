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
  jumpToSearch: function (event) {
    that = this;
    console.log("event=" + event.value);
    var className = event.detail.value.class_name;
    var start_time = event.detail.value.start_time;
    var end_time = event.detail.value.end_time;
    var teacher_name = event.detail.value.teacher_name;

    wx.navigateTo({
      url: '../teacher_search_details/teacher_search_details?className=' + className + '&teacherName=' + teacher_name + '&start_time=' + start_time + '&end_time=' + end_time + '&tableName=StudentSignIn',
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