(function() {
  var countLeft = 0;
  var service = getlotteryService();
  var lottery = new Lottery(options);

  var options = {};

  var enabledDraw = true;
  lottery.onStart = function(ins, index, cycle) {
    setActive(index);
    //检查登录
    ensureLogin(function(logined, data) {
      //登录状态检查
      if (!logined) {
        showNeedLogin();
        stopAndEnaleDraw();
        return;
      }

      // 执行抽奖
      service.luckDraw({});
    });
    console.log("start....", index, cycle);
  };

  lottery.onUpdate = function(ins, index, times) {
    setActive(index);
  };

  lottery.onEnded = function(ins, index, prizeIndexes) {
    setActive(index);
  };

  lottery.onError = function(ins, code, message) {
    console.log("onError", code, message);
  };

  function stopAndEnaleDraw() {
    lottery.stop();
    enabledDraw = true;
  }

  function setActive(index) {}

  $("#btnDraw").on("click", function() {
    // 不允许抽奖
    if (!enabledDraw) {
      return;
    }
    enabledDraw = false;
    ensureLogin(function(logined, data) {
      if (!logined) {
        showNeedLogin();
        enabledDraw = true;
        return;
      }
      // 检查剩余抽奖次数, 然后抽奖
      service.getDrawInfo({
        success: function(data) {
          if (data.count <= 0) {
            showDialog();
            enabledDraw = true;
            return;
          }
          countLeft = Math.max(0, data.count);
          $drawTimes.text(countLeft);
          if (countLeft > 0) {
            lottery.start();
          }
        }
      });
    });
  });

  function showDialog(content) {
    alert(content);
  }

  function showNeedLogin() {}

  // 获得用户登录信息
  function ensureLogin(cb) {
    cb(true);
  }

  // 跳转到登录
  function gotoLogin() {
    window.location.href = getLoginUrl();
  }

  function getDateStr(str) {
    var dateObj = new Date(str);
    var year = dateObj.getFullYear();
    var month = padLeft(dateObj.getMonth() + 1, 2, "0");
    var date = padLeft(dateObj.getDate(), 2, "0");
    var hours = padLeft(dateObj.getHours(), 2, "0");
    var minutes = padLeft(dateObj.getMinutes(), 2, "0");
    var seconds = padLeft(dateObj.getSeconds(), 2, "0");
    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  }

  function padLeft(str, length, ch) {
    var strr = str + "";
    while (strr.length < length) {
      strr = ch + strr;
    }
    return strr;
  }

  // 查询个人抽奖次数和已中奖统计信息
  function updateSelfDrawInfo() {}

  $(function() {
    // 查询个人抽奖次数和已中奖统计信息
    updateSelfDrawInfo();

    // 获取奖品列表
    service.getSelfDrawInfo();

    // 获取中奖列表
    service.getDrawRankList();

    // 查询登录状态
    ensureLogin(function(logined, data) {});
  });
})();
