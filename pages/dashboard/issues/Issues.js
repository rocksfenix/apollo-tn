import React from 'react'
import gql from 'graphql-tag'
import { Subscription } from 'react-apollo'
// import styled from 'styled-components'

const NEW_CHAT = gql`
  subscription {
    newChat
  }
`

let access = []

export default () => (
  <div>
    {/* <h1>Issues</h1> */}
  </div>
)



// import React from 'react'
// import gql from 'graphql-tag'
// import { Subscription } from 'react-apollo'
// // import styled from 'styled-components'

// const NEW_USERS_SUBSCRIPTION = gql`
//   subscription {
//     userAccess {
//       email
//       _id
//       fullname,
//       access
//     }
//   }
// `

// let access = []

// export default () => (
//   <Subscription
//     subscription={NEW_USERS_SUBSCRIPTION}
//   >
//     {({ data, loading, error }) => {
//       if (error) { console.log(error) }
//       if (data) { console.log('data', data) }
//       if (data) access.push(data.userAccess)
//       return (
//         <div>
//           <h1>Access</h1>
//           <ul>
//             {access.map(a => (
//               <li key={a._id}>{a.fullname} - {a.email} - {a._id}</li>
//             ))}
//           </ul>
//         </div>
//       )
//     }}
//   </Subscription>
// )
