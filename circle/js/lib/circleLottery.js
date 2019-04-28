(function() {
  var CIRCLR_ANGLE = 360;
  var EPSILON = 1;

  var defaultOption = {
    startIndex: 0, // 初始位置
    pits: 8, // 总坑数
    rate: 1.5,
    interval: 100, // 初始间隔
    cycle: 20, //转动基本次数：即至少需要转动多少次再进入抽奖环节
    getInterval: null, // 自定义旋转间隔函数,
    stepAngle: CIRCLR_ANGLE / 16 // 步进角度
    //onStart: null, // 当开始
    //onUpdate: null, // 旋转一次
    //onEnded: null,  // 结束
    //onError: null  // 异常, 比如转动次数已经达到设定值, 但是没有设置奖项
  };

  var slice = Array.prototype.slice;

  function Lottery(options) {
    this.originOptions = options;
    this.options = _.extend({}, defaultOption, options);

    // 定时器Id
    this.ticketId = null;
    // 奖项
    this.prizeIndexes = null;
    // 设置中奖后的转动次数
    this.times = 0;
    // 当前位置
    this.index = 0;
    // 模拟结果
    this.animatingResult = false;
    // 进行中
    this.processing = false;
    // 上次转动时间
    this.lastTime = null;
    // 累计次数
    this.totalTimes = 0;
    // 当前角度
    this.currentAngle = 0;
    // 平均每个礼品占的角度
    this.pitAngle = CIRCLR_ANGLE / this.options.pits;
    // 步进角度
    this.stepAngle = this.options.stepAngle;
    // 实际的转动基本次数, 大于开始中奖
    this.cycle = Math.max(
      this.options.cycle,
      Math.random((CIRCLR_ANGLE * 3) / this.stepAngl)
    );
  }

  Lottery.prototype.start = function() {
    if (this.processing) {
      return;
    }

    this.processing = true;
    // 增加随机数
    this.cycle =
      this.options.cycle + Math.floor(Math.random() * this.options.pits * 4);

    this.emit("Start", this, this.index, this.cycle);

    this.lastTime = Date.now();
    var that = this;
    this.innerStart(function(next) {
      that.totalTimes++;
      if (that.animatingResult) {
        that.times++;
      }

      that.index = that.getNextIndex();
      var continu = that.judge();
      if (!continu) {
        that.stop();
        return;
      }

      that.printInfo();
      that.emit("Update", that, that.index, that.times, that.totalTimes);
      next();
    });
  };

  Lottery.prototype.getNextIndex = function() {
    this.currentAngle = this.totalTimes * this.stepAngle;
    var angles = this.currentAngle % 360;
    return (
      Math.floor(angles / this.pitAngle) +
      ((angles % this.pitAngle) - this.pitAngle / 2 <= EPSILON ? 0 : 1)
    );
  };

  Lottery.prototype.judge = function() {
    var cycle = this.cycle;
    var times = this.times;

    // 到达旋转次数
    if (times > cycle) {
      // 没有设置奖项
      if (!$.isArray(this.prizeIndexes)) {
        this.printInfo();
        this.emit("Error", this, 404, "未设置奖项");
        this.stop();
        return false;
      }

      if (
        this.prizeIndexes.indexOf(this.index) >= 0 &&
        Math.abs((this.totalTimes * this.stepAngle) % this.pitAngle) <= EPSILON
      ) {
        this.printInfo();
        this.emit("Ended", this, this.index, this.prizeIndexes);
        return false;
      }
    }
    return true;
  };

  Lottery.prototype.emit = function(type) {
    var params = slice.call(arguments);
    var restParams = params.slice(1);
    var type = params[0];

    var method = this["on" + type];
    if (_.isFunction(method)) {
      method.apply(this, restParams);
    }
  };

  Lottery.prototype.stop = function() {
    this.clearJob();
    this.animatingResult = false;
    this.ticketId = null;
    this.prizeIndexes = null;
    this.times = 0;
    this.processing = false;
    this.totalTimes = 0;
  };

  Lottery.prototype.getInterval = function() {
    var getIntervalFn = this.options;
    if (_.isFunction(getIntervalFn)) {
      return getIntervalFn(this, this.index, this.times, this.cycle);
    } else {
      return Math.floor(
        this.options.interval * Math.pow(this.options.rate, this.times / 10)
      );
    }
  };

  Lottery.prototype.clearJob = function() {
    clearTimeout(this.ticketId);
  };

  Lottery.prototype.innerStart = function(cb) {
    var that = this;
    var next = function() {
      that.next(function() {
        cb && cb(next);
      });
    };
    next();
  };

  Lottery.prototype.next = function(cb) {
    var interval = this.getInterval();
    this.ticketId = setTimeout(cb, interval);
  };

  Lottery.prototype.reset = function() {
    this.stop();
    this.options = _.extend({}, defaultOption, this.originOptions);
    this.index = 0;
  };

  Lottery.prototype.setPrize = function(prizeIndexes) {
    if (this.animatingResult) {
      return;
    }
    this.prizeIndexes = prizeIndexes;
    // 设置值后, 开始模拟中奖
    this.animatingResult = true;
  };

  Lottery.prototype.printInfo = function() {
    var now = Date.now();
    console.log(
      "index:",
      this.index,
      "times:",
      this.times,
      "totalTime",
      this.totalTimes,
      "cycle:",
      this.cycle,
      "interval:",
      now - this.lastTime
    );
    this.lastTime = now;
  };

  window.Lottery = Lottery;
})();
