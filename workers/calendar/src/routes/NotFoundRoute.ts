export function NotFoundRoute() {
  return () =>
    new Response('Not Found', {
      status: 404,
    })
}
