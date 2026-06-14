import { useState } from 'react';
import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import ButtonComponent from '../../components/ButtonComponent';
import SizedBox from '../../components/SizedBox';

const MapScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const task = route.params?.task;

  const [region, setRegion] = useState({
    latitude: 23.7806,
    longitude: 90.4193,
    latitudeDelta: 0.035,
    longitudeDelta: 0.035,
  });

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No task data available</Text>
        <ButtonComponent title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const sourceLocation = task.sourceLocation;
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
        initialRegion={region}
        onRegionChangeComplete={(reg) => setRegion(reg)}
      >
        {/* <UrlTile
          urlTemplate="https://www.openstreetmap.org/#map=19/23.793698/90.410935"

          maximumZ={10}

          flipY={false}
        /> */}

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