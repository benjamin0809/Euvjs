import { baseFlags, isArray, isFunction, isObject, isString } from '@euv/shared'
import { normalizeClass } from 'packages/shared/src/normalizeProp'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

export interface VNode {
  [baseFlags.VNODE]: true
  type: any
  props: any
  children: any
  shapeFlag: number
  key: any
}

export function isVNode(value: any): value is VNode {
  return value ? value[baseFlags.VNODE] === true : false
}

/**
 * 生成一个 VNode 对象
 * @param type vnode.type
 * @param props 标签属性或自定义属性
 * @param children 子节点
 * @returns vnode 对象
 */
export function createVNode(type, props, children) {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0

  if (props) {
    let { class: klass, style } = props
    if (klass) {
      props.class = normalizeClass(klass)
    }
  }
  return createBaseVNode(type, props, children, shapeFlag)
}

/**
 * 创建基础的VNode
 * @param type
 * @param props
 * @param children
 * @param shapeFlag
 */
export function createBaseVNode(type, props, children, shapeFlag) {
  const vnode = {
    [baseFlags.VNODE]: true,
    type,
    props,
    shapeFlag
  } as VNode
  normalizeChildren(vnode, children)
  return vnode
}

export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    // TODO object
  } else if (isFunction(children)) {
    // TODO function
  } else {
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.children = children
  vnode.shapeFlag |= type
}

export function isSameVNodeType(n1: VNode, n2: VNode) {
  return n1.type === n2.type && n1.key === n2.key
}
