import { View, Text } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import SizedBox from '../../components/SizedBox';
import InputComponent from '../../components/InputComponent';
import { Picker } from '@react-native-picker/picker';
import ButtonComponent from '../../components/ButtonComponent';
import { updateTask } from '../../api/tasks';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';


const HubUpdateTaskScreen = () => {
  const route = useRoute();
  const item = route.params.task;
  const navigation = useNavigation();


  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  const [updateTaskLoading, setUpdateTaskLoading] = useState(false);

  const [destinationLocation, setDestinationLocation] = useState({
    latitude: item.destinationLocation?.latitude || null,
    longitude: item.destinationLocation?.longitude || null,
    name: item.destinationLocation?.name || '',
  });

  const locations = {
    Gulshan: { latitude: 23.7806, longitude: 90.4193 },
    Banani: { latitude: 23.7935, longitude: 90.4066 },
    Badda: { latitude: 23.7809, longitude: 90.4255 },
  };

  const handleUpdateTask = async () => {
    setUpdateTaskLoading(true);


    if (!title.trim()) {
      Alert.alert('Title is required');
      setUpdateTaskLoading(false);
      return;
    }

    if (!destinationLocation.latitude) {
      Alert.alert('Destination is required');
      setUpdateTaskLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('destinationLocation', JSON.stringify(destinationLocation));

    console.log('formData entries:');
    for (const pair of (formData)._parts || []) {
      console.log(pair[0], ':', pair[1]);
    }

    try {
      console.log(item.id, formData);
      await updateTask(item.id, formData);
      Alert.alert('Success', 'Task updated successfully!');
      navigation.goBack();

    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update task');
      console.log(error);
    }
    finally {
      setUpdateTaskLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>

      <SizedBox height={12} />

      <InputComponent
        placeholder="Product name"
        value={title}
        onChangeText={setTitle}
        label={<Text>Title <Text style={{ color: 'red' }}>*</Text></Text>}
      />

      <InputComponent
        label="Description"
        placeholder='About product'
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <SizedBox height={20} />

      <View>
        <Text style={{ marginBottom: 6, fontSize: 15, fontWeight: 'bold' }}>Select Destination <Text style={{ color: 'red' }}>*</Text></Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <Picker
            selectedValue={destinationLocation.name}
            onValueChange={(value) =>
              setDestinationLocation({
                name: value,
                latitude: locations[value]?.latitude || null,
                longitude: locations[value]?.longitude || null,
              })
            }
          >
            <Picker.Item label="Select destination..." value="" />
            <Picker.Item label="Gulshan" value="Gulshan" />
            <Picker.Item label="Banani" value="Banani" />
            <Picker.Item label="Badda" value="Badda" />
          </Picker>
        </View>
      </View>

      <SizedBox />

      {updateTaskLoading ? <ActivityIndicator size={'large'} color={'green'} /> : <ButtonComponent
        title="Update Task"
        onPress={handleUpdateTask}
      />}


    </ScrollView>
  )
}

export default HubUpdateTaskScreen