function debounce(method, wait, immediate) {
  let timeout;
  // debounced函数为返回值
  // 使用Async/Await处理异步，如果函数异步执行，等待setTimeout执行完，拿到原函数返回值后将其返回
  // args为返回函数调用时传入的参数，传给method
  let debounced = function (...args) {
    return new Promise(resolve => {
      // 用于记录原函数执行结果
      let result;
      // 将method执行时this的指向设为debounce返回的函数被调用时的this指向
      let context = this;
      // 如果存在定时器则将其清除
      if (timeout) {
        clearTimeout(timeout);
      }
      // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
      if (immediate) {
        // 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
        // 这样确保立即执行后wait毫秒内不会被再次触发
        let callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null
        }, wait);
        // 如果满足上述两个条件，则立即执行并记录其执行结果
        if (callNow) {
          result = method.apply(context, args);
          resolve(result)
        }
      } else {
        // 如果immediate为false，则等待函数执行并记录其执行结果
        // 并将Promise状态置为fullfilled，以使函数继续执行
        timeout = setTimeout(() => {
          // args是一个数组，所以使用fn.apply
          // 也可写作method.call(context, ...args)
          result = method.apply(context, args);
          resolve(result)
        }, wait)
      }
    })
  };

  // 在返回的debounced函数上添加取消方法
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null
  };

  return debounced
}

export default debounce;

//使用方法

/*
function square(num) {
  return Math.pow(num, 2)
}

let debouncedFn = debounce(square, 1000, false)

window.addEventListener('resize', async () => {
  let val
  try {
    val = await debouncedFn(4)
  } catch (err) {
    console.error(err)
  }
  // 停止缩放1S后输出：
  // 原函数的返回值为：16
  console.log(`原函数返回值为${val}`)
}, false)
*/