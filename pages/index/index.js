//index.js
//获取应用实例
var Bmob = require('../../dist/Bmob-1.7.1.min.js');
var common = require('../../utils/common.js');
var app = getApp();
var that;
Page({

  data: {
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    diaryList: [],
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
  onLoad: function () {
    var currentUser = Bmob.User.current();
    if (currentUser == null) {
      app.showToast("请登陆", this, 1000);
    }
    this.dialog = this.selectComponent(".mydialog");
  },
  noneWindows: function () {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function () {
    var currentUser = Bmob.User.current();
    if (currentUser != null) {
      getList(this);
    }
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
  var currentUser = Bmob.User.current();
  const pointer = Bmob.Pointer('_User');
  const poiID = pointer.set(currentUser.objectId);

  const query = Bmob.Query('StudentSignIn');
  //userId 字段名称关联用户表 ，类型Pointer
  const query1 = query.equalTo("userId", "==", poiID);
  const query2 = query.equalTo("student_name", '==', currentUser.self_name);
  query.or(query1, query2);
  query.find().then(res => {
    console.log("----成功加载个人用户预定信息----",res);
    that.setData({
      diaryList: res
    }, function () {
    })
  })
}