import { View, Text } from 'react-native'
import { useState } from 'react'
import styles from './styles/styles'
import InputComponent from '../../components/InputComponent'
import ButtonComponent from '../../components/ButtonComponent'
import SizedBox from '../../components/SizedBox'

const LoginParcelRider = () => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <View style={styles.container}>
      <>
        <Text style={styles.headingText}>Parcel Rider Login</Text>

        <SizedBox height={20} />
      </>

      <InputComponent inputWidth='80%' type='email' value={email} onChangeText={setEmail} label='Enter username' />

      <InputComponent inputWidth='80%' type='password' value={pass} onChangeText={setPass} label='Enter password' />

      <ButtonComponent width='80%' title='Login' onPress={() => { console.log('login pressed') }} />

    </View>
  )
}

export default LoginParcelRider