import { View, Text, Alert, ToastAndroid } from 'react-native'
import { useState } from 'react'
import styles from './styles/styles'
import InputComponent from '../../components/InputComponent'
import ButtonComponent from '../../components/ButtonComponent'
import SizedBox from '../../components/SizedBox'
import { useNavigation } from '@react-navigation/native'
import ROUTES from '../../navigation/routes'
import { login } from '../../api/auth_hub_manager'

const LoginHubManager = () => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const navigation = useNavigation();

  const tryLogin = async () => {
    try {
      await login(email, pass);
      ToastAndroid.show('Welcome back!', ToastAndroid.SHORT);
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.HUB_MANAGER_HOME }],
      });
    }
    catch (e) {
      ToastAndroid.show(e.response.data.message, ToastAndroid.SHORT);
    }
  }

  return (
    <View style={styles.container}>
      <>
        <Text style={styles.headingText}>Hub Manager Login</Text>

        <SizedBox height={20} />
      </>

      <InputComponent inputWidth='80%' type='email' value={email} onChangeText={setEmail} label='Enter email address' />

      <InputComponent inputWidth='80%' type='password' value={pass} onChangeText={setPass} label='Enter password' />

      <ButtonComponent width='80%' title='Login' onPress={tryLogin} />

    </View>
  )
}

export default LoginHubManager