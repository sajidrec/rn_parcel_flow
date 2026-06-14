import { View, Text, Pressable, Alert, FlatList } from 'react-native';
import styles from './styles/styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ROUTES from '../../navigation/routes';
import ButtonComponent from '../../components/ButtonComponent.jsx';
import '../../components/SizedBox.jsx';
import SizedBox from '../../components/SizedBox.jsx';
import { useState } from 'react';
import { deleteTask, getTaskList } from '../../api/tasks.js';
import { Image } from 'react-native';
import { API_BASE_URL } from '../../api/config.js';
import { useCallback } from 'react';

const ParcelRiderHomeScreen = () => {

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
    setRefreshing(true);
    try {
      const data = await getTaskList();
      setTaskLists(data);
    } catch (e) {
      console.log(e);
    }
    finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTaskList();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTaskList();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container]}>
      <Pressable style={{ backgroundColor: "#f70e0e", padding: '1%', margin: "1%", justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: '6%', width: '30%', alignSelf: 'flex-end' }} onPress={handleLogout}><Text style={{ color: "#fff", fontSize: 18, fontWeight: 'bold' }}>Logout</Text></Pressable>

      <SizedBox height={25} />

      <FlatList style={{ width: '90%' }}
        data={[...taskLists].reverse()}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text style={{ fontSize: 16, color: '#333' }}>{item.description}</Text>
            {item.images?.length > 0 && (
              <Image
                source={{
                  uri: `${API_BASE_URL}/uploads/tasks/${item.images[0]}`,
                }}
                style={{
                  resizeMode: 'contain',
                  height: 200,
                }}
              />
            )}

            <SizedBox />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <ButtonComponent style={{ flex: 1 }} title='Delete' onPress={async () => {
                  Alert.alert(
                    'Delete Item',
                    'Are you sure?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => console.log('Cancelled', item.id),
                      },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                          setRefreshing(true);
                          try {

                            await deleteTask(item.id);

                            await fetchTaskList();

                          } catch (error) {
                            console.log(error);
                          }
                          finally {
                            setRefreshing(false);
                          }

                        },
                      },
                    ]
                  );
                }} />
              </View>
              <View style={{ flex: 1 }}>
                <ButtonComponent title='Update' onPress={async () => {
                  navigation.navigate(ROUTES.UPDATE_HUB_TASK, {
                    task: item
                  });
                }} />
              </View>

            </View>



          </View>
        )}
      />

      <SizedBox height={25} />
      <ButtonComponent width='95%' title='Create New Task' bgColor='#156920' onPress={() => navigation.navigate(ROUTES.CREATE_TASK)} />
      <SizedBox />

    </View>
  )
}

export default ParcelRiderHomeScreen