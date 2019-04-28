var _ = {};

_.isFunction = function isFunction(fn) {
  return typeof fn === "function" || fn instanceof Function;
};

/***
 * extend,不是深拷贝
 */
_.extend = function extend(target) {
  if (arguments.length < 2) {
    return arguments[0];
  }
  var params = Array.prototype.slice.call(arguments);
  for (var i = 0; i < params.length; i++) {
    var obj = params[i];
    for (var key in obj) {
      target[key] = obj[key];
    }
  }
  return target;
};
