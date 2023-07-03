import { track, trigger } from "./effect"

const get = createGetter()

function createGetter() {
    return function get(target: object, prop: string | symbol, receiver: object) {
        const res = Reflect.get(target, prop, receiver)
        track(target, prop)
        return res
    }
}

const set = createSetter()

function createSetter() {
    return function set(
        target: object,
        prop: string | symbol,
        value: unknown,
        receiver: object
    ) {
        const res = Reflect.set(
            target,
            prop,
            value,
            receiver
        )
        trigger(target, prop, value)
        return res
    }
}
export const mutableHandler: ProxyHandler<object> = {
    get,
    set
}
