var salesOffices = {}; // 定义售楼处
salesOffices.clientList = {}; // 缓存列表，存放订阅者的回调函数
salesOffices.listen = function (key, fn) {
  // 增加订阅者
  // 先判断类型
  if (!this.clientList[key]) {
    this.clientList[key] = [];
  }
  this.clientList[key].push(fn);
};
// 执行回调
salesOffices.trigger = function () {
  // 取出类数组的第一个元素
  // shift取出数组的头元素，且改变原数组
  var key = Array.prototype.shift.call(arguments);
  var fns = this.clientList[key];
  if (!fns || fns.length === 0) {
    return false;
  }
  // fns.forEach((fn) => {
  //   fn.apply(this, arguments);
  // });

  for (var i = 0, fn; (fn = fns[i++]); ) {
    // apply第二个参数枚举给出
    fn.apply(this, arguments);
  }
};
// 注册订阅者
salesOffices.listen("squ88", function (price) {
  console.log("price" + price);
});
// 发布
salesOffices.trigger("squ88", 200);
