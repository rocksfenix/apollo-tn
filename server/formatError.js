import { isInstance as isApolloErrorInstance, formatError as formatApolloError } from 'apollo-errors'

function formatError (error) {
  const { originalError } = error
  if (isApolloErrorInstance(originalError)) {
    // log internalData to stdout but not include it in the formattedError
    console.log(JSON.stringify({
      type: `error`,
      data: originalError.data,
      internalData: originalError.internalData
    }))
  }
  return formatApolloError(error)
}

export default formatError

// import { isInstance as isApolloErrorInstance, formatError as formatApolloError } from 'apollo-errors'

// // CUSTOM FORMAT ERROR PARSERE
// export default (error) => {
//   const { originalError } = error

//   console.log(originalError, error)
//   if (isApolloErrorInstance(originalError)) {
//     // log internalData to stdout but not include it in the formattedError
//     console.log(JSON.stringify({
//       type: `error`,
//       data: originalError.data,
//       internalData: originalError.internalData
//     }))
//   }

//   try {
//     if (originalError.name === 'ValidationError') {
//       const keys = Object.keys(originalError.errors)
//       console.log('kEYS', keys)
//       console.log('kEYS', keys.map(k => ({
//         message: originalError.errors[k].message,
//         name: 'ForbiddenError',
//         field: k,
//         path: error.path
//       })))

//       return keys.map(k => ({
//         message: originalError.errors[k].message,
//         name: 'ForbiddenError',
//         field: k,
//         path: error.path
//       }))
//     }
//     const errorResponse = {
//       message: error.message,
//       name: originalError.name,
//       field: originalError.data.field,
//       path: error.path
//     }
//     return errorResponse
//   } catch (error) {
//     return formatApolloError(error)
//   }
// }
