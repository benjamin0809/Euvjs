import { isFunction } from "@euv/shared"
import { Dep } from "./dep"
import { ReactiveEffect } from "./effect"
import { Ref, trackRefValue, triggerRefValue } from "./ref"

export function computed(getterOrOptions) {
  let getter
  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
  }
  const cRef = new ComputedRefImpl(getter)
  return cRef
}

export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  private _value!: T
  public _dirty = true

  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true

  constructor(getter) {
    this.effect = new ReactiveEffect(getter, () => {
      if(!this._dirty) {
        this._dirty = true
        triggerRefValue(this as Ref)
      }
    })
    this.effect.computed = this
  }

  get value() {
    trackRefValue(this as Ref)
    if(this._dirty) {
      this._dirty = false
      
      this._value = this.effect.run()
    }
    return this._value
  }
}