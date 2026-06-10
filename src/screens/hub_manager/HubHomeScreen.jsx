import { View, Text, Pressable, Alert } from 'react-native';
import styles from './styles/styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ROUTES from '../../navigation/routes';

const HubHomeScreen = () => {

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

            await AsyncStorage.removeItem('token');

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
    <View style={[styles.container, { marginLeft: '70%' }]}>
      <Pressable style={{ backgroundColor: "#f70e0e", padding: '5%', margin: "2%", justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: '8%', width: 'auto' }} onPress={handleLogout}><Text style={{ color: "#fff", fontSize: 18, fontWeight: 'bold', }}>Logout</Text></Pressable>
    </View>
  )
}

export default HubHomeScreen