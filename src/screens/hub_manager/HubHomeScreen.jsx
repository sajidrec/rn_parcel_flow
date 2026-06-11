import { View, Text, Pressable, Alert } from 'react-native';
import styles from './styles/styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ROUTES from '../../navigation/routes';
import ButtonComponent from '../../components/ButtonComponent.jsx'
import '../../components/SizedBox.jsx'
import SizedBox from '../../components/SizedBox.jsx';

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
    <View style={[styles.container]}>
      <Pressable style={{ backgroundColor: "#f70e0e", padding: '1%', margin: "1%", justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: '6%', width: '30%', alignSelf: 'flex-end' }} onPress={handleLogout}><Text style={{ color: "#fff", fontSize: 18, fontWeight: 'bold' }}>Logout</Text></Pressable>

      <SizedBox height={25} />


      <ButtonComponent width='80%' title='Create New Task' onPress={() => navigation.navigate(ROUTES.CREATE_TASK)} />


    </View>
  )
}

export default HubHomeScreen