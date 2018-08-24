import React from 'react'
import { Mutation } from 'react-apollo'
import ToggleField from '../../../../components/ToggleField'

import { SET_DISPONIBILITY } from './../chat-queries'

export default () => (
  <Mutation mutation={SET_DISPONIBILITY}>
    {(availability, { data }) => (
      <ToggleField
        active
        onChange={(k, value) => availability({ variables: { connection: value } })}
        label='Availability'
      />
    )}
  </Mutation>
)
