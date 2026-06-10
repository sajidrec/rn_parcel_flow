import styles from './styles/styles';
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import ROUTES from '../../navigation/routes';

const SplashScreen = () => {

  const navigation = useNavigation();

  useEffect(
    () => {
      const timer = setTimeout(() => {
        navigation.replace(ROUTES.LOGIN)
      }, 2000)

      return () => clearTimeout(timer)
    }, []
  )

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Parcel Flow</Text>
    </View>
  )
}

export default SplashScreen
