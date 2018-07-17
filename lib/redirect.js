import Router from 'next/router'
export const getJwt = ctx => {
  return getCookie('jwt', ctx.req)
}

export const isAuthenticated = ctx => !!getJwt(ctx)

export const redirect = (target, ctx = {}) => {
  if (ctx.res) {
    // server
    // 303: "See other"
    ctx.res.writeHead(303, { Location: target })
    ctx.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.replace(target)
  }
}

export const redirectIfAuthenticated = ctx => {
  if (isAuthenticated(ctx)) {
    redirect('/user', ctx)
    return true
  }
  return false
}

export default redirect
