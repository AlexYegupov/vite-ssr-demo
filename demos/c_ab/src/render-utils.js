export const RENDER_TYPE = 'render_type'
export const RENDER_TYPE_STATIC = 'static'
export const RENDER_TYPE_DYNAMIC = 'dynamic'

export const isRenderStatic = (headers) =>
  headers.get(RENDER_TYPE) === RENDER_TYPE_STATIC;
