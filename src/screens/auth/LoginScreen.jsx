import { Pressable, View, Text } from 'react-native'
import styles from './styles/styles'
import SizedBox from '../../components/SizedBox'
import { useNavigation } from '@react-navigation/native'
import ROUTES from '../../navigation/routes'

const LoginScreen = () => {

  const navigation = useNavigation()

  return (
    <View style={styles.container}>

      <Pressable style={{ width: '80%' }} onPress={() => { navigation.navigate(ROUTES.LOGIN_HUB_MANAGER) }}>
        <Text style={[styles.headingTextMedium, styles.buttonRed]}>Login as hub manager 🧑‍💼</Text>
      </Pressable>

      <SizedBox height={20} />

      <Pressable style={{ width: '80%' }} onPress={() => { navigation.navigate(ROUTES.LOGIN_PARCEL_RIDER) }}>
        <Text style={[styles.headingTextMedium, styles.buttonRed]}>Login as rider 🚴</Text>
      </Pressable>

    </View>
  )
}

export default LoginScreen
