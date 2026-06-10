import styles from './styles/styles';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import ROUTES from '../../navigation/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {

  const navigation = useNavigation();

  useEffect(() => {

    const checkToken = async () => {

      try {

        const token =
          await AsyncStorage.getItem('token');

        console.log('fetched token is ', token);

        setTimeout(() => {

          if (token) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: ROUTES.HUB_MANAGER_HOME,
                },
              ],
            });
          } else {
            navigation.replace(ROUTES.LOGIN);
          }

        }, 2000);

      } catch (e) {
        navigation.replace(ROUTES.LOGIN);
      }
    };

    checkToken();

  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>
        Parcel Flow
      </Text>
    </View>
  );
};

export default SplashScreen;