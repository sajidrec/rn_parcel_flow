import { Text, Alert, Pressable, View } from 'react-native'
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';
import SizedBox from '../../components/SizedBox';
import InputComponent from '../../components/InputComponent';
import { Picker } from '@react-native-picker/picker';
import ButtonComponent from '../../components/ButtonComponent';
import { createTask } from '../../api/tasks';

const CreateTaskScreen = () => {

  const [images, setImages] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [sourcePlaceName, setSourcePlaceName] = useState('Fetching location...');

  const [sourceLocation, setSourceLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [destinationLocation, setDestinationLocation] = useState({
    latitude: null,
    longitude: null,
    name: '',
  });

  const [weight, setWeight] = useState('1');
  const [pricePerKg, setPricePerKg] = useState('1');

  const locations = {
    Gulshan: { latitude: 23.7806, longitude: 90.4193 },
    Banani: { latitude: 23.7935, longitude: 90.4066 },
    Badda: { latitude: 23.7809, longitude: 90.4255 },
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(result.assets.map(item => item.uri));
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setSourceLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    const [place] = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    setSourcePlaceName(
      `${place.street || ''}, ${place.district || place.city || ''}, ${place.country || ''}`.trim()
    );
  };

  useEffect(() => {
    const init = async () => {
      const granted = await requestLocationPermission();

      if (granted) {
        getCurrentLocation();
      }
    };

    init();
  }, []);

  const totalPrice =
    Number(weight || 0) * Number(pricePerKg || 0);

  const handleCreateTask = async () => {
    if (!images.length) {
      Alert.alert('Please select at least one image');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Title is required');
      return;
    }

    if (!sourceLocation.latitude) {
      Alert.alert('Source location not found. Please wait for location to load.');
      return;
    }

    if (!destinationLocation.latitude) {
      Alert.alert('Destination is required');
      return;
    }

    const formData = new FormData();

    images.forEach((uri, index) => {
      formData.append('images', {
        uri,
        type: 'image/jpeg',
        name: `image_${index}.jpg`,
      });
    });

    formData.append('title', title);
    formData.append('description', description);

    formData.append('sourceLocation', JSON.stringify(sourceLocation));
    formData.append('destinationLocation', JSON.stringify(destinationLocation));

    console.log('formData entries:');
    for (const pair of (formData)._parts || []) {
      console.log(pair[0], ':', pair[1]);
    }

    try {
      await createTask(formData);
      Alert.alert('Success', 'Task created successfully!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>

      <Pressable onPress={pickImages} style={{ borderWidth: 1, borderColor: '#070708', padding: 10, borderRadius: 5, marginBottom: 15 }}  >
        <Text style={{ color: '#0e1013', justifyContent: 'center', alignItems: 'center', fontSize: 16, fontWeight: '500' }}>
          + Select Images *
        </Text>
      </Pressable>

      <View>
        <Text style={{ fontSize: 12, color: "#484444" }}>
          {images.length > 0
            ? `${images.length} image(s) selected`
            : 'No images selected'}
        </Text>

      </View>

      <SizedBox height={12} />

      <InputComponent
        placeholder="Product name"
        value={title}
        onChangeText={setTitle}
        label="Title *"
      />

      <InputComponent
        label="Description"
        placeholder='About product'
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
        Current hub location :
        {sourcePlaceName}
      </Text>

      <SizedBox height={20} />

      <View>
        <Text style={{ marginBottom: 6, fontSize: 15, fontWeight: 'bold' }}>Select Destination *</Text>

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

      <ButtonComponent
        title="Create Task"
        onPress={handleCreateTask}
      />

    </ScrollView>
  )
}

export default CreateTaskScreen