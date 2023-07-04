import { extend } from '@euv/shared'
import { ComputedRefImpl } from './computed'
import { Dep, createDep } from './dep'
type KeyToDepMap = Map<any, Dep>

const targetMap = new WeakMap<any, KeyToDepMap>()
export let activeEffect: ReactiveEffect | undefined
export type EffectScheduler = (...args: any[]) => any


export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
}
export function track(target: object, prop: string | symbol) {
  console.log('track: 收集依赖')
  if (!activeEffect) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(prop)
  if (!dep) {
    depsMap.set(prop, (dep = createDep()))
  }
  trackEffects(dep)
}

export function trigger(target: object, prop: string | symbol, value: unknown) {
  console.log('trigger: 触发依赖')
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  let dep: Dep | undefined = depsMap.get(prop)

  if (!dep) {
    return
  }
  triggerEffects(dep)
}

export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn)
  if(options) {
    extend(_effect, options)
  }
  if (!options?.lazy) {
    _effect.run()
  }
}

export class ReactiveEffect<T = any> {
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}
  computed?: ComputedRefImpl<T>
  run() {
    activeEffect = this
    return this.fn()
  }

  stop() {}
}

export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

/**
 *
 * @param effect
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}

/**
 * 派发更新
 * @param dep
 */
export function triggerEffects(dep: Dep) {
  //   const effects = Array.from(dep)
  const effects = Array.isArray(dep) ? dep : [...dep]
  // 先触发所有的计算属性依赖，在触发所有的非计算属性的依赖
  // ！important
  effects.forEach(effect => {
    if (effect.computed) {
      triggerEffect(effect)
    }
  })

  effects.forEach(effect => {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  })
}
