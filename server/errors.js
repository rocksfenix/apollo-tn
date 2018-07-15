import { createError } from 'apollo-errors'

export const ForbiddenError = createError('ForbiddenError', {
  message: 'You are not allowed to do this'
})

export const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
  message: 'You must be logged in to do this'
})

export const NotFound = createError('NotFound', {
  message: 'The resource is not exist'
})

export const UnknownError = createError('UnknownError', {
  message: 'An unknown error has ocurred'
})
