import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import ButtonComponent from '../../components/ButtonComponent';
import SizedBox from '../../components/SizedBox';
import * as Location from 'expo-location';

const MapScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const task = route.params?.task;

  const [region, setRegion] = useState({
    latitude: task.sourceLocation?.latitude || 0,
    longitude: task.sourceLocation?.longitude || 0,
    latitudeDelta: 0.035,
    longitudeDelta: 0.035,
  });

  const [currentLocation, setCurrentLocation] = useState(task.sourceLocation);

  useEffect(() => {
    let intervalId;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const updateLocation = async () => {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            name: 'Product Location',
          });

          setRegion(
            {
              latitude: location.coords.latitude || 0,
              longitude: location.coords.longitude || 0,
              latitudeDelta: 0.035,
              longitudeDelta: 0.035,
            }
          );
          console.log('location updated');
        } catch (error) {
          console.log('Location error:', error);
        }
      };

      // Initial fetch
      await updateLocation();

      // Update every 5 seconds
      intervalId = setInterval(updateLocation, 5000);
    };

    startTracking();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No task data available</Text>
        <ButtonComponent title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const sourceLocation = currentLocation;
  const destLocation = task.destinationLocation;

  const hasSource = sourceLocation?.latitude && sourceLocation?.longitude;
  const hasDest = destLocation?.latitude && destLocation?.longitude;

  const coordinates = [];
  if (hasSource) {
    coordinates.push({
      latitude: sourceLocation.latitude,
      longitude: sourceLocation.longitude,
    });
  }
  if (hasDest) {
    coordinates.push({
      latitude: destLocation.latitude,
      longitude: destLocation.longitude,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task: {task.title}</Text>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >

        {hasSource && (
          <Marker
            coordinate={{
              latitude: sourceLocation.latitude,
              longitude: sourceLocation.longitude,
            }}
            title="Product Location"
            description={sourceLocation.name || 'Currently product is here'}
            pinColor="red"
          />
        )}

        {hasDest && (
          <Marker
            coordinate={{
              latitude: destLocation.latitude,
              longitude: destLocation.longitude,
            }}
            title="Destination"
            description={destLocation.name || 'Delivery Location'}
            pinColor="green"
          />
        )}

        {coordinates.length === 2 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="#fc3700"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      <View style={styles.footer}>
        <View style={styles.infoRow}>

          {hasDest && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Destination</Text>
              <Text style={styles.infoValue}>
                {destLocation.name || `${destLocation.latitude.toFixed(4)}, ${destLocation.longitude.toFixed(4)}`}
              </Text>
            </View>
          )}
        </View>

        <SizedBox height={12} />

        <ButtonComponent
          title="Confirm Handover"
          onPress={() => {
            Alert.alert(
              'Handover Confirmed',
              `You have handed over: ${task.title}`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  footer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
});

export default MapScreen;