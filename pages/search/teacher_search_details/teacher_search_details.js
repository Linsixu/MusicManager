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
    modifyDiarys: false,

    //时间器
    isPickerRender: false,
    isPickerShow: false,
    startTime: "",
    endTime: "",
    className:"",
    teacherName:"",
    studentName:"",
    tableName:"",
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
    this.dialog = this.selectComponent(".mydialog");
    console.log('-----event-----',options);
    that.tableName = options.tableName;
    //教师or学生搜索
    that.startTime = options.start_time;
    that.endTime = options.end_time;
    that.className = options.className;
    that.teacherName = options.teacherName;
    that.studentName = options.studentName;

    if(that.tableName == 'TeacherClass'){
       getTeacherClassList(this);
    }else{
      getSignInClassList(this);
    }
  },
  noneWindows: function () {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function () {
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
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    //搜索数据
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
function getTeacherClassList(t, k) {
  that = t;
  const query = Bmob.Query('TeacherClass');
  if(that.className != '' && that.className != null){
    query.equalTo("class_name", "==", that.className);
    console.log("----className-----", that.className);
  }
  if(that.teacherName != '' && that.teacherName != null){
    query.equalTo("teacher_name", "==", that.teacherName);
    console.log("----teacher_name-----", that.teacherName);
  }
  if (that.studentName != '' && that.studentName != null) {
    query.equalTo("student_name", "==", that.studentName);
    console.log("----student_name-----", that.studentName);
  }
  if (that.startTime != '' && that.startTime != null) {
    query.equalTo("start_time", ">=", that.startTime);
    console.log("----start_time-----", that.startTime);
  }
  if (that.endTime != '' && that.endTime != null) {
    query.equalTo("end_time", "<=", that.endTime);
    console.log("----end_time-----", that.endTime);
  }
  query.find().then(res => {
    console.log(res)
    that.setData({
      diaryList: res
    }, function () {
    })
  });
}

function getSignInClassList(t, k) {
  that = t;
  const query = Bmob.Query('StudentSignIn');
  if (that.className != '' && that.className != null) {
    query.equalTo("class_name", "==", that.className);
  }
  if (that.teacherName != '' && that.teacherName != null) {
    query.equalTo("teacher_name", "==", that.teacherName);
  }
  if (that.studentName != '' && that.studentName != null) {
    query.equalTo("student_name", "==", that.studentName);
  }
  if (that.startTime != '' && that.startTime != null) {
    query.equalTo("start_time", ">=", that.startTime);
  }
  if (that.endTime != '' && that.endTime != null) {
    query.equalTo("end_time", "<=", that.endTime);
  }
  query.find().then(res => {
    console.log(res)
    that.setData({
      diaryList: res
    }, function () {
    })
  });
}