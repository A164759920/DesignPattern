**Array.prototype.shift.call(arguments);**

- 取出 arguments 类数组的第一个元素,且改变原 arguments
  - shift 取出数组头元素
  - call 改变指向,使 arguments 使用 Array 的 shift 方法
