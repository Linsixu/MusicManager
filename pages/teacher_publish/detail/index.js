// pages/index/detail/index.js
var Bmob = require('../../dist/Bmob-1.7.1.min.js');
Page({
  data: {
    rows: {}
  },
  onLoad: function (e) {
    // 页面初始化 options为页面跳转所带来的参数
    this.dialog = this.selectComponent(".mydialog");
    console.log(e.objectId)
    var objectId = e.objectId;
    var that = this;
    // if (!e.objectId) {
    //   common.showTip("请重新进入", "loading");
    //   return false;
    // }

    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);

    query.get(objectId, {
      success: function (result) {
        console.log(result, result.id);

        that.setData({
          rows: result,

        })
        // The object was retrieved successfully.        
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})