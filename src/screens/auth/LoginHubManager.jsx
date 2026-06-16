import { View, Text, Alert, ToastAndroid } from 'react-native'
import { useState } from 'react'
import styles from './styles/styles'
import InputComponent from '../../components/InputComponent'
import ButtonComponent from '../../components/ButtonComponent'
import SizedBox from '../../components/SizedBox'
import { useNavigation } from '@react-navigation/native'
import ROUTES from '../../navigation/routes'
import { login } from '../../api/auth_hub_manager'
import { saveToken, saveUserInfo } from '../../storage/auth_storage'
import { ActivityIndicator } from 'react-native'

const LoginHubManager = () => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const tryLogin = async () => {
    try {
      setLoading(true);
      const userInfo = await login(email, pass);
      console.log(userInfo);

      try {
        await saveUserInfo(userInfo);

        console.log('user info saved : ', userInfo);
        setLoading(false);
      }
      catch (e) {
        console.log('Error while saving user info : ', e);
        setLoading(false);
      }


      ToastAndroid.show('Welcome back!', ToastAndroid.SHORT);
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.HUB_MANAGER_HOME }],
      });
      setLoading(false);
    }
    catch (e) {
      ToastAndroid.show(e.response.data.message, ToastAndroid.SHORT);
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <>
        <Text style={styles.headingText}>Hub Manager Login</Text>

        <SizedBox height={20} />
      </>

      <InputComponent inputWidth='80%' type='email' value={email} onChangeText={setEmail} label='Enter username' />

      <InputComponent inputWidth='80%' type='password' value={pass} onChangeText={setPass} label='Enter password' />

      {loading ? <ActivityIndicator size={'large'} color={'green'} /> : <ButtonComponent width='80%' title='Login' onPress={tryLogin} disabled={loading} />}

    </View>
  )
}

export default LoginHubManager