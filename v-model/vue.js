/**
 * TODO:
 * - 获取页面元素
 * - 放入临时内存区域
 * - 应用Vue数据 (将Vue中的0数据解析到页面上)
 * - 渲染页面 (减少操作DOM的次数)
 */
class Vue {
  constructor(obj_instance) {
    this.$data = obj_instance.data;
    // 监听$data中的每一个属性
    Observer(this.$data);
    Compile(obj_instance.el, this);
  }
}
/**
 * FIXME:思考，若为$data添加一个【新属性】,并且【新属性】
 * 的值为【一个对象】，该【对象】是否有get和set
 */
function Observer(data_instance) {
  // 只劫持object类型
  // 递归为空或子属性非object
  if (!data_instance || typeof data_instance !== "object") return;
  const dependency = new Dependency(data_instance);
  console.log(dependency);
  Object.keys(data_instance).forEach((key) => {
    let value = data_instance[key]; // 闭包 存储$data中的原始值
    Observer(value); // 递归监听对象的子属性
    Object.defineProperty(data_instance, key, {
      enumerable: true,
      configurable: true,
      get() {
        // console.log(`【getter】访问了${key}-${value}`);
        // FIXME:将Watcher添加到实例dependency的list中
        Dependency.temp && dependency.addSub(Dependency.temp);
        return value;
      },
      set(newValue) {
        // console.log(`【setter】修改了属性值:旧=${value}-新=${newValue}`);
        value = newValue;
        // 若修改的newValue为对象，则也需要进行数据劫持
        Observer(newValue);
        dependency.notify();
      },
    });
  });
}

function Compile(element, vm) {
  vm.$el = document.querySelector(element);
  // 文档碎片？
  const fragment = document.createDocumentFragment();
  // 将DOM保存到fragment中
  let child;
  while ((child = vm.$el.firstChild)) {
    // 向fragment中添加node，会删除原页面上的node
    fragment.append(child);
  }
  fragment_compile(fragment);
  function fragment_compile(node) {
    // text类型的nodeType = 3
    const pattern = /\{\{\s*(\S+)\s*\}\}/;
    if (node.nodeType === 3) {
      const result_regex = pattern.exec(node.nodeValue);
      const rawNodeValue = node.nodeValue; // FIXME:保存原始的【插值表达式】
      if (result_regex) {
        const arr = result_regex[1].split(".");
        // 此处若存在对象嵌套，需要链式获取$data中的值
        const value = arr.reduce((prev, cur) => prev[cur], vm.$data);
        // 使用replace方法进行替换 => 先匹配到{{}}中的内容,再替换为data对象中映射的内容
        // {{name}} => 用户名 FIXME:一次替换后{{}}就被覆盖了，需要在外单独保存
        node.nodeValue = rawNodeValue.replace(pattern, value);
        new Watcher(vm, result_regex[1], (newValue) => {
          node.nodeValue = rawNodeValue.replace(pattern, newValue);
        });
      }
      return;
    }
    if (node.nodeType === 1 && node.nodeName === "INPUT") {
      const attr = Array.from(node.attributes);
      attr.forEach((i) => {
        if (i.nodeName === "v-model") {
          // nodeValue中即为要替换的属性名
          // ########### 该部分实现数据到视图的变化 ###########
          const value = i.nodeValue
            .split(".")
            .reduce((prev, cur) => prev[cur], vm.$data);
          node.value = value;
          new Watcher(vm, i.nodeValue, (newValue) => {
            node.value = newValue;
          });
          // ########### 该部分实现输入框到数据的变化 ###########
          node.addEventListener("input", (e) => {
            const arr1 = i.nodeValue.split(".");
            const arr2 = arr1.slice(0, arr1.length - 1);
            const final = arr2.reduce((prev, cur) => prev[cur], vm.$data);
            final[arr1[arr1.length - 1]] = e.target.value;
          });
        }
      });
    }
    // 递归处理
    node.childNodes.forEach((child) => {
      fragment_compile(child);
    });
  }
  vm.$el.appendChild(fragment);
}

class Dependency {
  constructor(flag) {
    this.flag = flag;

    this.subscribers = [];
  }
  // 添加的sub是每个Watcher
  addSub(sub) {
    this.subscribers.push(sub);
  }
  notify() {
    this.subscribers.forEach((sub) => {
      sub.update();
    });
  }
}

// vm.$data.key => {{key}}
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    // 插值表达式{{}}中的值
    this.key = key;
    // 回调函数即为更新{{key}}的方法
    this.callback = callback;
    Dependency.temp = this;
    // 触发getter函数
    key.split(".").reduce((prev, cur) => prev[cur], vm.$data);
    Dependency.temp = null; // 每次添加Watcher后将该temp清空，避免重复添加
  }
  // update方法为实例调用，访问相应的类内属性加this
  update() {
    // 获取新的值
    const newValue = this.key
      .split(".")
      .reduce((prev, cur) => prev[cur], this.vm.$data);
    // 调用相应的回调函数更新页面内容
    this.callback(newValue);
  }
}
