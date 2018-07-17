import cookie from 'js-cookie'
import Constants from '../config'
import jwtDecode from 'jwt-decode'

const { JWT_KEY, JWT_RFS_KEY } = Constants

export const signin = (token, refreshToken) => {
  cookie.set(JWT_KEY, token)
  cookie.set(JWT_RFS_KEY, refreshToken)

  const t = jwtDecode(token)

  if (!t.acpp) {
    window.location = '/accept-terms'
  } else {
    window.location = '/'
  }
}

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
      path: '/'
    })
  }
}

export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1
    })
  }
}

export const getCookie = (key, req) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req)
}

const getCookieFromBrowser = key => {
  return cookie.get(key)
}

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const rawCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${key}=`))
  if (!rawCookie) {
    return undefined
  }
  return rawCookie.split('=')[1]
}

export const logout = (redirect = '/') => {
  if (process.browser) {
    cookie.remove(JWT_KEY)
    cookie.remove(JWT_RFS_KEY)
    if (process.browser && typeof redirect === 'string') {
      window.location = redirect
    } else {
      window.location = '/'
    }
  }
}
