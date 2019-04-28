(function() {
  var builtOption = {
    cache: false,
    timeout: 5000,
    contentType: "application/json",
    error: function defaultNetErrorHandler() {
      console.log("抽奖服务发生异常......");
    },
    complete: function complete(xhr, status) {
      console.log(status);
    }
  };

  window.getlotteryService = function getlotteryService(options) {
    var defaultOption = _.extend({}, options || {}, builtOption);

    function getOption(option) {
      return _.extend({}, option, defaultOption);
    }

    return {
      // 获得奖品列表
      getPrizeList: function(option) {
        try {
          $.ajax(getOption(option));
        } catch (e) {
          throw e;
        }
      },
      // 抽奖
      luckDraw: function(option) {
        try {
          $.ajax(getOption(option));
        } catch (e) {
          throw e;
        }
      },
      // 个人抽奖信息, 总次数, 已抽次数
      getSelfDrawInfo: function(option) {
        try {
          $.ajax(getOption(option));
        } catch (e) {
          throw e;
        }
      },
      // 个人中奖纪录
      getSelfDrawRecord: function(option) {
        try {
          $.ajax(getOption(option));
        } catch (e) {
          throw e;
        }
      },
      // 中奖排行
      getDrawRankList: function(option) {
        try {
          $.ajax(getOption(option));
        } catch (e) {
          throw e;
        }
      }
    };
  };
})();
