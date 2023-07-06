import { createRenderer } from '@euv/runtime-core'
import { extend } from '@euv/shared'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

import { baseCompile } from '../../compiler-core/src/compile'

export function compile(template: string, options) {
  return baseCompile(template, options)
}

const rendererOptions = extend({ patchProp }, nodeOps)

let renderer

function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}

export const render = (...args) => {
  ensureRenderer().render(...args)
}