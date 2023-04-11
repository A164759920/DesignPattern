# 发布订阅模式

## 考虑 trigger 参数不写死的原因

- 使得 callback 的方式更加灵活,只需固定第一个 key,其余参数个数**可以不受限制**

## Array.prototype.shift.call(arguments);

- 取出 arguments 类数组的第一个元素,且改变原 arguments
  - shift 取出数组头元素
  - call 改变指向,使 arguments 使用 Array 的 shift 方法

## for..in.. 用法

- 用于遍历对象

## 清除数组

- 区分使用 **_.length=0_** 和 **_= []_** 两种方法的不同
