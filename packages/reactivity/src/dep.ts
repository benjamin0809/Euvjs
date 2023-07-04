import { ReactiveEffect } from "./effect"

export type Dep = Set<ReactiveEffect>

/**
 * 创建Dep
 * @param effects 
 * @returns 
 */
export const createDep = (effects?: ReactiveEffect[]): Dep => {
    const dep = new Set<ReactiveEffect>(effects) as Dep
    return dep
}