import { loadConfigFromFile } from 'vite';

export const RENDER_TYPE = 'render_type'
export const RENDER_TYPE_STATIC = 'static'
export const RENDER_TYPE_DYNAMIC = 'dynamic'

export const isRenderStatic = (headers) =>
  headers.get(RENDER_TYPE) === RENDER_TYPE_STATIC;

export const isBrowser = () => {
  return (typeof window !== 'undefined')
}

export async function getBaseUrl() {
  console.log('getBaseUrl', import.meta.env)

  if (import.meta.env.DEV) {
    const oconfig = await loadConfigFromFile()
    console.log(`config`, config)
    return 'http://localhost:3002' //!!
  } else if (typeof window !== 'undefined') {
    return window.location.origin
  }

  /* if (import.meta.url) {
   *   return new URL(url).origin
   * } */

  /*
   *   if (import.meta.env.DEV) {
   *     return import.meta.env.VITE_DEV_SERVER_URL;
   *   } else if (typeof window !== 'undefined') {
   *     return window.location.origin;
   *   } else {
   *     return 'http://localhost:5173'; // fallback for SSR
   *   }
   *  */
}

export function getRenderMode() {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return 'ssr'; // Server-side rendering
  }

  // In the browser, we can check for SSG hydration data
  if (window.__staticRouterHydrationData) {
    return 'ssg'; // Static Site Generation
  }

  // If we're in the browser but no SSG data, it's client-side rendering
  return 'client';
}

export async function formatFullUrl(url) {
  return new URL(url, getBaseUrl()).href
}
