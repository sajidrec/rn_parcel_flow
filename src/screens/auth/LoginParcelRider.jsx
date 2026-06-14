import { View, Text } from 'react-native'
import { useState } from 'react'
import styles from './styles/styles'
import InputComponent from '../../components/InputComponent'
import ButtonComponent from '../../components/ButtonComponent'
import SizedBox from '../../components/SizedBox'
import { useNavigation } from '@react-navigation/native'
import ROUTES from '../../navigation/routes'
import { login } from '../../api/auth_rider'
import { saveUserInfo } from '../../storage/auth_storage'
import { ToastAndroid } from 'react-native'


const LoginParcelRider = () => {

  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('');

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const tryLogin = async () => {
    try {
      setLoading(true);
      const userInfo = await login(userName, pass);
      console.log(userInfo);

      try {
        await saveUserInfo(userInfo);

        console.log('user info saved : ', userInfo);
      }
      catch (e) {
        console.log('Error while saving user info : ', e);
      }
      finally {
        setLoading(false);
      }


      ToastAndroid.show('Welcome back!', ToastAndroid.SHORT);
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.PARCEL_RIDER_HOME }],
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
        <Text style={styles.headingText}>Parcel Rider Login</Text>

        <SizedBox height={20} />
      </>

      <InputComponent inputWidth='80%' type='email' value={userName} onChangeText={setUserName} label='Enter username' />

      <InputComponent inputWidth='80%' type='password' value={pass} onChangeText={setPass} label='Enter password' />

      {loading ? <Text>Loading...</Text> : <ButtonComponent width='80%' title='Login' onPress={tryLogin} />}


    </View>
  )
}

export default LoginParcelRider