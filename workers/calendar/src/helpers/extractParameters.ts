type Parameters = {
  streetId: string
}

/**
 * Try to get params from request url.
 * Valid pathname is `/calendar/:streetId`
 *  @throws Will throw an Error, when request have unexpected parameters.
 */
export function extractParameters(request: Request): Parameters | undefined {
  const url = new URL(request.url)
  const paths = url.pathname
    .replace(/^\/+/g, '') // remove leading slash
    .replace(/\/+$/, '') // remove trailing slash
    .split('/')
    .slice(1)

  if (paths.length === 1 && paths[0].length > 0) {
    return { streetId: paths[0] }
  }

  return undefined
}
