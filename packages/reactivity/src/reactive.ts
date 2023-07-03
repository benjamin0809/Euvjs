import { mutableHandler } from "./baseHandler";

/**
* 响应性 Map 缓存对象
* key：target
* val：proxy
*/
export const reactiveMap = new WeakMap<object, any>()

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
    proxyMap.set(target, p)
    return p
}