import { EMPTY_OBJ, hasChanged, isObject, noop } from '@euv/shared'
import { ReactiveEffect } from 'packages/reactivity/src/effect'
import { isReactive } from 'packages/reactivity/src/reactive'
import { queuePreFlushCb } from './scheduler'

/**
 * watch 配置项属性
 */
export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate
  deep?: boolean
}

/**
 * 指定的 watch 函数
 * @param source 监听的响应性数据
 * @param cb 回调函数
 * @param options 配置对象
 * @returns
 */
export function watch(source, cb: Function, options?: WatchOptions) {
  return doWatch(source as any, cb, options)
}

function doWatch(
  source,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {
  let getter: () => any

  if (isReactive(source)) {
    getter = () => source
    deep = true
  } else {
    getter = noop
  }

  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let oldValue = {}

  const job = () => {
    if (cb) {
      const newVal = effect.run()
      if (deep || hasChanged(newVal, oldValue)) {
        cb(newVal, oldValue)
        oldValue = newVal
      }
    }
  }

  let scheduler = () => queuePreFlushCb(job)
  const effect = new ReactiveEffect(getter, scheduler)

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}

/**
 * 依次执行 getter，从而触发依赖收集
 */
export function traverse(value: unknown) {
  if (!isObject(value)) {
    return value
  }

  for (const key in value as object) {
    traverse((value as any)[key])
  }
  return value
}
