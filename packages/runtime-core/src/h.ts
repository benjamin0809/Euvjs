import { isObject } from '@euv/shared'
import { VNode, createVNode, isVNode } from './vnode'

export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const len = arguments.length
  if (len === 2) {
    if (isObject(propsOrChildren) && !Array(propsOrChildren)) {
      // 如果是 VNode，则 第二个参数代表了 children
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // 如果不是 VNode， 则第二个参数代表了 props
      return createVNode(type, propsOrChildren, [])
    } else {
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    // 如果参数在三个以上，则从第二个参数开始，把后续所有参数都作为 children
    if (len > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    }
    // 如果传递的参数只有三个，则 children 是单纯的 children
    else if (len === 3 && isVNode(children)) {
      children = [children]
    }
    // 触发 createVNode 方法，创建 VNode 实例
    return createVNode(type, propsOrChildren, children)
  }
}
