import { View, Text, Alert } from 'react-native'
import { Pressable } from 'react-native';
import ROUTES from '../../navigation/routes';
import styles from './styles/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ParcelRiderHomeScreen = () => {

  const navigation = useNavigation();

  const handleLogout = () => {

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userInfo');

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: ROUTES.LOGIN,
                },
              ],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={{ backgroundColor: "#f70e0e", padding: '1%', margin: "1%", justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: '6%', width: '30%', alignSelf: 'flex-end' }} onPress={handleLogout}><Text style={{ color: "#fff", fontSize: 18, fontWeight: 'bold' }}>Logout</Text></Pressable>
    </View>
  )
}

export default ParcelRiderHomeScreen