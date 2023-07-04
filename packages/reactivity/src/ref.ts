import { hasChanged } from "@euv/shared";
import { createDep, Dep } from "./dep";
import { activeEffect, ReactiveEffect, trackEffects, triggerEffects } from "./effect";
import { toReactive } from "./reactive";

export interface Ref<T = any> {
  value: T
  dep: Set<ReactiveEffect<any>>
}

/**
 * ref 函数
 * @param value unknown
 */
export function ref(value?: unknown) {
  return createRef(value, false)
}

/**
 * 创建 RefImpl 实例
 * @param rawValue 原始数据
 * @param shallow boolean 形数据，表示《浅层的响应性（即：只有 .value 是响应性的）》
 * @returns
 */
export function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T
  dep?: Dep = undefined
  readonly __v_isRef = true
  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = value
    // 如果 __v_isShallow 为 true，则 value 不会被转化为 reactive 数据，
    // 即如果当前 value 为复杂数据类型，则会失去响应性。
    //对应官方文档 shallowRef ：https://cn.vuejs.org/api/reactivity-advanced.html#shallowref
    this._value = __v_isShallow ? value : toReactive(value)
  }

  /**
   * 收集依赖
   */
  get value() {
    trackRefValue(this as Ref)
    return this._value
  }
  /**
   * 判断是否有值的变化，有变化记录旧值在_rawValue，
   * 重新reactive(newVal)
   * 再派发更新
   */
  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = toReactive(newVal)
      triggerRefValue(this as Ref)
    }
  }
}

/**
 * 为 ref 的 value 进行触发依赖工作
 */
export function triggerRefValue(ref: Ref) {
  if (ref.dep) {
    triggerEffects(ref.dep)
  }
}

/**
 * 收集ref的dep，ref不含有dep则创建一个
 * @param ref 
 */
export function trackRefValue(ref: Ref) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()))
  }
}
/**
 * 判断是否为ref对象
 * @param r 
 * @returns 
 */
export function isRef(r: any): r is Ref {
  return r?.__v_isRef === true
}