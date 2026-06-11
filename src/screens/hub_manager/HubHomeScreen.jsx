import { View, Text, Pressable, Alert, FlatList } from 'react-native';
import styles from './styles/styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ROUTES from '../../navigation/routes';
import ButtonComponent from '../../components/ButtonComponent.jsx'
import '../../components/SizedBox.jsx'
import SizedBox from '../../components/SizedBox.jsx';
import { useEffect, useState } from 'react';
import { getTaskList } from '../../api/tasks.js';
import { Image } from 'react-native';
import { API_BASE_URL } from '../../api/config.js'

const HubHomeScreen = () => {

  const [taskLists, setTaskLists] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchTaskList = async () => {
    try {
      const data = await getTaskList();
      setTaskLists(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {

    fetchTaskList();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTaskList();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container]}>
      <Pressable style={{ backgroundColor: "#f70e0e", padding: '1%', margin: "1%", justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: '6%', width: '30%', alignSelf: 'flex-end' }} onPress={handleLogout}><Text style={{ color: "#fff", fontSize: 18, fontWeight: 'bold' }}>Logout</Text></Pressable>

      <SizedBox height={25} />

      <FlatList
        data={taskLists}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text>{item.title}</Text>

            {item.images?.length > 0 && (
              <Image
                source={{
                  uri: `${API_BASE_URL}/uploads/tasks/${item.images[0]}`,
                }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 8,
                  marginTop: 8,
                }}
              />
            )}
          </View>
        )}
      />

      <SizedBox height={25} />
      <ButtonComponent width='80%' title='Create New Task' onPress={() => navigation.navigate(ROUTES.CREATE_TASK)} />


    </View>
  )
}

export default HubHomeScreen