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

  test: function(){
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
    this.dialog = this.selectComponent(".mydialog");
    getList(this);
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
    if(currentUser == null){
      app.showToast("请登陆", that, 1000);
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/setting/setting'
        })
      }, 1000);
    } else if (currentUser.isteacher == false){
      app.showToast("不是老师无法使用", that, 1000);
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/setting/setting'
        })
      }, 1000);
    }else{
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
    that = this
    that.setData({
      writeDiary: true
    })
  },
  addClassMsg: function (event) {
    var className = event.detail.value.title;
    var start_time = event.detail.value.class_start_time;
    var end_time = event.detail.value.class_end_time;
    console.log("event", event)
    console.log("start_time=" + start_time)
    console.log("end_time=" + end_time)
    if (!className) {
      common.showTip("标题不能为空", "loading");
    }
    else if (!start_time && start_time != null && !end_time && end_time!=null) {
      common.showTip("内容不能为空", "loading");
    }
    else {
      that.setData({
        loading: true
      })
      var currentUser = Bmob.User.current();
      console.log("登陆用户信息"+currentUser)
      if(currentUser == null){
        app.showToast("请登陆", that, 1000);
        return
      }
      var teahername = currentUser.self_name;
      console.log(teahername)
      const query = Bmob.Query('TeacherClass');
      query.set("start_time", start_time)
      query.set("teacher_name",teahername)
      query.set("end_time", end_time)
      query.set("class_name", className)
      query.save().then(res => {
        console.log(res+"上传成功");
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
      }).catch(err => {
        console.log(err)
      })
    }

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
    },function() {
    })
  });
}

function modify(t, e) {
  var that = t;
  //修改日记
  var modyTitle = e.detail.value.title;
  var modyContent = e.detail.value.content;
  var objectId = e.detail.value.content;
  var thatTitle = that.data.nowTitle;
  var thatContent = that.data.nowContent;
  if ((modyTitle != thatTitle || modyContent != thatContent)) {
    if (modyTitle == "" || modyContent == "") {
      common.showTip('标题或内容不能为空', 'loading');
    }
    else {
      console.log(modyContent)
      var Diary = Bmob.Object.extend("diary");
      var query = new Bmob.Query(Diary);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(that.data.nowId, {
        success: function (result) {

          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('title', modyTitle);
          result.set('content', modyContent);
          result.save();
          common.showTip('日记修改成功', 'success', function () {
            that.onShow();
            that.setData({
              modifyDiarys: false
            })
          });

          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    }
  }
  else if (modyTitle == "" || modyContent == "") {
    common.showTip('标题或内容不能为空', 'loading');
  }
  else {
    that.setData({
      modifyDiarys: false
    })
    common.showTip('修改成功', 'loading');
  }
}