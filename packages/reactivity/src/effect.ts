import { Dep, createDep } from './dep'
type KeyToDepMap = Map<any, Dep>

const targetMap = new WeakMap<any, KeyToDepMap>()
export let activeEffect: ReactiveEffect | undefined

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

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    activeEffect = this
    return this.fn()
  }
}

export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}

export function triggerEffects(dep: Dep) {
//   const effects = Array.from(dep)
  const effects = Array.isArray(dep) ? dep : [...dep]
  effects.forEach(effect => {
    triggerEffect(effect)
  })
}
