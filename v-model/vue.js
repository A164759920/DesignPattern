/**
 * TODO:
 * - 获取页面元素
 * - 放入临时内存区域
 * - 应用Vue数据 (将Vue中的数据解析到页面上)
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
  Object.keys(data_instance).forEach((key) => {
    let value = data_instance[key]; // 闭包
    Observer(value); // 递归监听对象的子属性
    Object.defineProperty(data_instance, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`访问了${key}-${value}`);
        return value;
      },
      set(newValue) {
        console.log(`修改了属性值:旧=${value}-新=${newValue}`);
        value = newValue;
        // 若修改的newValue为对象，则也需要进行数据劫持
        Observer(newValue);
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
      if (result_regex) {
        const arr = result_regex[1].split(".");
        // 此处若存在对象嵌套，需要链式获取$data中的值
        const value = arr.reduce((prev, cur) => prev[cur], vm.$data);
        // 使用replace方法进行替换 => 先匹配到{{}}中的内容,再替换为data对象中映射的内容
        node.nodeValue = node.nodeValue.replace(pattern, value);
      }
      return;
    }
    // 递归处理
    node.childNodes.forEach((child) => {
      fragment_compile(child);
    });
  }
  vm.$el.appendChild(fragment);
}
