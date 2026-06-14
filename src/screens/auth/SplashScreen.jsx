import styles from './styles/styles';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import ROUTES from '../../navigation/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');

        const userInfo = userInfoString
          ? JSON.parse(userInfoString)
          : null;

        console.log('fetched user info:', userInfo);

        setTimeout(() => {
          if (userInfo?.access_token) {
            if (userInfo.user_type === 'hub_manager') {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ROUTES.HUB_MANAGER_HOME,
                  },
                ],
              });
            } else if (userInfo.user_type === 'rider') {

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ROUTES.PARCEL_RIDER_HOME,
                  },
                ],
              });
            }
          } else {
            navigation.replace(ROUTES.LOGIN);
          }
        }, 2000);
      } catch (e) {
        console.error(e);
        navigation.replace(ROUTES.LOGIN);
      }
    };

    checkUser();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>
        Parcel Flow
      </Text>
    </View>
  );
};

export default SplashScreen;