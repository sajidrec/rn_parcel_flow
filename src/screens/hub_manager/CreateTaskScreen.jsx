import { Text, Alert, Pressable, View, Image } from 'react-native'
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
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateTaskScreen = () => {

  const [images, setImages] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [sourcePlaceName, setSourcePlaceName] = useState('Fetching location...');

  const [sourceLocation, setSourceLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [createTaskLoading, setCreateTaskLoading] = useState(false);

  const [destinationLocation, setDestinationLocation] = useState({
    latitude: null,
    longitude: null,
    name: '',
  });

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

  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([result.assets[0].uri]);
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setSourceLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      name: sourcePlaceName,
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

  const navigation = useNavigation();

  const handleCreateTask = async () => {
    setCreateTaskLoading(true);
    if (!images.length) {
      Alert.alert(
        'Photo Required',
        'Capture a product photo to continue.'
      );
      setCreateTaskLoading(false);
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        'Required Field',
        'Please enter a product title before creating the task.'
      );
      setCreateTaskLoading(false);
      return;
    }

    // if (!sourceLocation.latitude) {
    //   Alert.alert('Source location not found. Please wait for location to load.');
    //   setCreateTaskLoading(false);
    //   return;
    // }

    if (!destinationLocation.latitude) {
      Alert.alert(
        'Destination Required',
        'Please select a destination hub.'
      );
      setCreateTaskLoading(false);
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
      setCreateTaskLoading(false);
      navigation.goBack();

    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create task');
      console.log(error);
      setCreateTaskLoading(false);
    }
  };

  return (

    <ScrollView contentContainerStyle={{
      padding: 14,
    }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          marginBottom: 4,
        }}
      >
        Create Task
      </Text>

      <Text
        style={{
          color: '#6B7280',
          marginBottom: 24,
        }}
      >
        Add a new delivery task
      </Text>

      {images.length === 0 ? (
        <Pressable
          onPress={captureImage}
          style={{
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: '#D1D5DB',
            borderRadius: 16,
            paddingVertical: 30,
            alignItems: 'center',
            backgroundColor: '#FAFAFA',
          }}
        >
          <Ionicons name="camera-outline" size={60} color="#6B7280" />

          <Text
            style={{
              marginTop: 8,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Capture Product Photo <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Text
            style={{
              color: '#6B7280',
              marginTop: 4,
              fontSize: 13,
            }}
          >
            Tap to open camera
          </Text>
        </Pressable>
      ) : (
        <View
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            elevation: 2,
          }}
        >
          <Image
            source={{ uri: images[0] }}
            style={{
              width: '100%',
              aspectRatio: 4 / 3,
            }}
            resizeMode="cover"
          />

          <Pressable
            onPress={captureImage}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(0,0,0,0.7)',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Ionicons name="camera-reverse-outline" size={16} color="white" />
            <Text
              style={{
                color: 'white',
                marginLeft: 6,
                fontWeight: '600',
              }}
            >
              Retake
            </Text>
          </Pressable>

          <View
            style={{
              padding: 12,
            }}
          >
            <Text
              style={{
                color: '#16A34A',
                fontWeight: '600',
              }}
            >
              ✓ Photo captured
            </Text>
          </View>
        </View>
      )}

      <SizedBox height={12} />

      <View style={{
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}>
        <InputComponent
          placeholder="Product name"
          value={title}
          onChangeText={setTitle}
          label={
            <Text>
              Title <Text style={{ color: "red" }}>*</Text>
            </Text>
          }
        />

        <InputComponent
          label="Description"
          placeholder='About product'
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>



      <View
        style={{
          backgroundColor: '#F3F4F6',
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          opacity: 0.8,
        }}
      >
        <Text
          style={{
            fontWeight: '600',
            marginBottom: 6,
            color: '#9CA3AF',
          }}
        >
          Current Hub Location
        </Text>

        <Text
          style={{
            color: '#6B7280',
          }}
        >
          {sourcePlaceName}
        </Text>
      </View>

      <SizedBox height={20} />

      <View>
        <Text style={{ marginBottom: 6, fontSize: 15, fontWeight: 'bold' }}>Select Destination <Text style={{ color: 'red' }}>*</Text></Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 12,
            backgroundColor: '#FFF',
          }}
        >
          <Picker
            selectedValue={destinationLocation.name}
            dropdownIconColor="#4F46E5"
            style={{
              height: 55,
              color: "#111827",
            }}
            onValueChange={(value) =>
              setDestinationLocation({
                name: value,
                latitude: locations[value]?.latitude || null,
                longitude: locations[value]?.longitude || null,
              })
            }
          >
            <Picker.Item label="Select destination..." value="" />
            <Picker.Item label="📍 Gulshan" value="Gulshan" />
            <Picker.Item label="📍 Banani" value="Banani" />
            <Picker.Item label="📍 Badda" value="Badda" />
          </Picker>
        </View>
      </View>

      <SizedBox />

      {createTaskLoading ? <ActivityIndicator size={'large'} color={'green'} /> : <ButtonComponent
        title="Create Task"
        onPress={handleCreateTask}
      />}


    </ScrollView>
  )
}

export default CreateTaskScreen