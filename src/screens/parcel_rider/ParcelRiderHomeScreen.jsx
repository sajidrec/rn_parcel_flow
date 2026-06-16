import { View, Text, Alert } from 'react-native'
import { Pressable } from 'react-native';
import ROUTES from '../../navigation/routes';
import styles from './styles/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SizedBox from '../../components/SizedBox';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getTaskList } from '../../api/tasks.js';
import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Image } from 'react-native';
import { API_BASE_URL } from '../../api/config.js';
import ButtonComponent from '../../components/ButtonComponent.jsx';
import * as Location from 'expo-location';

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

  const [taskLists, setTaskLists] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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
    <View style={styles.container}>
      <Pressable style={{ backgroundColor: "#f70e0e", padding: '1%', margin: "1%", justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: '6%', width: '30%', alignSelf: 'flex-end' }} onPress={handleLogout}><Text style={{ color: "#fff", fontSize: 18, fontWeight: 'bold' }}>Logout</Text></Pressable>
      <SizedBox />

      <FlatList style={{ width: '90%' }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={[...taskLists].reverse()}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          console.log(item),
          <View style={{
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            elevation: 2,
          }}>


            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#111827',
            }}>{item.title}</Text>
            <Text style={{
              color: '#6B7280',
            }}>{item.description}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: '#9CA3AF',
                  fontWeight: '600',
                }}
              >
                DESTINATION
              </Text>

              <Text
                style={{
                  marginLeft: 8,
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                {item.destinationLocation?.name ?? 'N/A'}
              </Text>
            </View>
            {item.images?.length > 0 && (
              <Image
                source={{
                  uri: `${API_BASE_URL}/uploads/tasks/${item.images[0]}`,
                }}
                style={{
                  width: '100%',
                  aspectRatio: 16 / 9,
                  borderRadius: 12,
                  marginTop: 12,
                }}
                resizeMode="cover"
              />
            )}

            <SizedBox />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <ButtonComponent style={{ flex: 1 }} title='Pick Up' onPress={async () => {
                  Alert.alert(
                    'Confirm Pick Up',
                    'Are you sure?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => console.log('Cancelled', item.id),
                      },
                      {
                        text: 'Pick Up',
                        style: 'destructive',
                        onPress: async () => {
                          const { status } = await Location.requestForegroundPermissionsAsync();
                          console.log(status);
                          if (status !== 'granted') {
                            Alert.alert('Permission denied', 'Location permission is required.');
                            return;
                          }

                          const location = await Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.High,
                          });

                          const placeName = await Location.reverseGeocodeAsync({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                          });

                          const updatedTask = {
                            ...item,
                            sourceLocation: {
                              latitude: location.coords.latitude,
                              longitude: location.coords.longitude,
                            },
                          };
                          navigation.navigate(ROUTES.MAP, { task: updatedTask });
                        },
                      },
                    ]
                  );
                }} />
              </View>

            </View>

          </View>
        )}
      />
    </View>
  )
}

export default ParcelRiderHomeScreen