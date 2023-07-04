import { isObject } from '@euv/shared'
import { mutableHandler } from './baseHandler'

/**
 * 响应性 Map 缓存对象
 * key：target
 * val：proxy
 */
export const reactiveMap = new WeakMap<object, any>()

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandler, reactiveMap)
}
function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  const currentProxy = proxyMap.get(target)
  if (currentProxy) {
    return currentProxy
  }
  const p = new Proxy(target, baseHandlers)
  p[ReactiveFlags.IS_REACTIVE] = true
  proxyMap.set(target, p)
  return p
}

/**
 * 转为reactive对象
 * @param value 数据（）
 * @returns
 */
export function toReactive<T extends unknown>(value: T) {
  return isObject(value) ? reactive(value as object) : value
}

/**
 * 判断一个数据是否为 Reactive
 */
export function isReactive(value: unknown): boolean {
  return (value && value[ReactiveFlags.IS_REACTIVE]) === true
}

