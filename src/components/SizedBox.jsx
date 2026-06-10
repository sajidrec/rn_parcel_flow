import React from 'react'
import { View } from 'react-native'

const SizedBox = ({ height = 10, width = '100%' }) => {
  return (
    <View
      style={{
        height,
        width,
      }}
    />
  )
}

export default SizedBox