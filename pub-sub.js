// // 单独抽离发布订阅功能
// var event = {
//   clientList: {},
//   listen: function (key, fn) {
//     if (!this.clientList[key]) {
//       this.clientList[key] = [];
//     }
//     // 加入订阅队列
//     this.clientList[key].push(fn);
//   },
//   remove: function (key, fn) {
//     // fns为引用类型
//     var fns = this.clientList[key];
//     if (!fns) {
//       return false;
//     }
//     if (!fn) {
//       // 若fns存在，且fn不为空，则清除符合条件的fn
//       fns && (fns.length = 0);
//       // 该方法只是将原数组指向了一个新的空数组，并未实际清空原数组
//       // this.clientList[key] = [];
//     } else {
//       fns.forEach((_fn, index) => {
//         if (_fn === fn) {
//           fns.splice(index, 1); // 在回调队列中删除该callback
//         }
//       });
//     }
//   },
//   trigger: function () {
//     // 取出key对于的fns
//     var key = Array.prototype.shift.apply(arguments);
//     var fns = this.clientList[key];
//     if (!fns || fns.length === 0) {
//       return false;
//     }
//     // fns.forEach((fn) => {
//     //   fn.apply(this, arguments);
//     // });
//     for (var i = 0, fn; (fn = fns[i++]); ) {
//       fn.apply(this, arguments);
//     }
//   },
// };

// var installEvent = function (obj) {
//   // 对象拷贝，使得obj具有event的属性及对应的方法
//   Object.assign(obj, event);
//   // for (var prop in event) {
//   //   obj[prop] = event[prop];
//   // }
// };

// var salesOffices = {};
// installEvent(salesOffices);

// /**
//  * @example callback支持匿名和具名两种方式
//   salesOffices.listen("squ888", function (price) {
//   console.log("价格" + price);
//   });
//   salesOffices.listen("squ888", fn1 = function (price) {
//   console.log("价格" + price);
//   });
//  */
// salesOffices.listen(
//   "squ888",
//   (fn1 = function (price) {
//     console.log("价格" + price);
//   })
// );
// salesOffices.listen(
//   "squ888",
//   (fn2 = function (price) {
//     console.log("价格" + price);
//   })
// );
// salesOffices.listen(
//   "squ888",
//   (fn3 = function (price) {
//     console.log("价格" + price);
//   })
// );
// salesOffices.remove("squ888", fn1);
// salesOffices.trigger("squ888", 200);

// 全局Event
var Event = (function () {
  var clientList = {},
    $on,
    $emit,
    $remove;
  $on = function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  };
  $remove = function (key, fn) {
    // fns为引用类型
    var fns = clientList[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      // 若fns存在，且fn不为空，则清除符合条件的fn
      fns && (fns.length = 0);
      // 该方法只是将原数组指向了一个新的空数组，并未实际清空原数组
      // this.clientList[key] = [];
    } else {
      fns.forEach((_fn, index) => {
        if (_fn === fn) {
          fns.splice(index, 1); // 在回调队列中删除该callback
        }
      });
    }
  };
  $emit = function () {
    var key = Array.prototype.shift.call(arguments);
    var fns = clientList[key];
    if (!fns || fns.length === 0) {
      console.log(`${key}事件尚未注册`);
      return false;
    }
    fns.forEach((fn) => {
      fn.apply(this, arguments);
    });
  };
  return {
    $on,
    $emit,
    $remove,
  };
})();
module.exports = {
  Event,
};
