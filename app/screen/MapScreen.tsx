import { useTheme } from '@/providers/ThemeProvider';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Custom map styles (dark theme)
const customMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#181818' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1b1b1b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8a8a' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#373737' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3c3c3c' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#4e4e4e' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d3d' }],
  },
];

interface PointOfInterest {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  geofenceRadius: number; // in meters
}

const MapScreen = () => {
  const { colors } = useTheme();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [insideGeofence, setInsideGeofence] = useState<Set<string>>(new Set());
  const [customMarkers, setCustomMarkers] = useState<CustomMarker[]>([]);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Mock Points of Interest (music-themed landmarks)
  const [pointsOfInterest] = useState<PointOfInterest[]>([
    {
      id: 'poi1',
      title: '🎵 Music Plaza',
      description: 'Discover trending playlists',
      coordinate: {
        latitude: 14.5995, // Example coordinates (Manila area)
        longitude: 120.9842,
      },
      geofenceRadius: 100,
    },
    {
      id: 'poi2',
      title: '🎸 Rock Arena',
      description: 'Classic rock collection',
      coordinate: {
        latitude: 14.6042,
        longitude: 120.9822,
      },
      geofenceRadius: 100,
    },
    {
      id: 'poi3',
      title: '🎧 Jazz Corner',
      description: 'Smooth jazz favorites',
      coordinate: {
        latitude: 14.5950,
        longitude: 120.9900,
      },
      geofenceRadius: 100,
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        const { status: foregroundStatus } =
          await Location.requestForegroundPermissionsAsync();

        if (foregroundStatus !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert(
            'Location Permission',
            'Please enable location services to use map features.'
          );
          setLoading(false);
          return;
        }

        // Request background location permission (for geofencing)
        if (Platform.OS !== 'web') {
          const { status: backgroundStatus } =
            await Location.requestBackgroundPermissionsAsync();

          if (backgroundStatus !== 'granted') {
            Alert.alert(
              'Background Location',
              'Background location access will enhance geofencing features.'
            );
          }
        }

        // Get initial location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
        setLoading(false);

        // Start watching location with high accuracy
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 10, // Or when user moves 10 meters
          },
          (newLocation) => {
            setLocation(newLocation);
            checkGeofences(newLocation);
          }
        );
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Failed to get location');
        setLoading(false);
        Alert.alert('Error', 'Unable to retrieve your location. Please try again.');
      }
    })();

    // Cleanup subscription on unmount
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // Geofencing logic
  const checkGeofences = (currentLocation: Location.LocationObject) => {
    pointsOfInterest.forEach((poi) => {
      const distance = getDistanceFromLatLonInMeters(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        poi.coordinate.latitude,
        poi.coordinate.longitude
      );

      const wasInside = insideGeofence.has(poi.id);
      const isInside = distance <= poi.geofenceRadius;

      if (isInside && !wasInside) {
        // Entered geofence
        setInsideGeofence((prev) => new Set(prev).add(poi.id));
        Alert.alert(
          '📍 Entered Geofence',
          `You've entered ${poi.title}! ${poi.description}`,
          [{ text: 'OK' }]
        );
      } else if (!isInside && wasInside) {
        // Left geofence
        setInsideGeofence((prev) => {
          const newSet = new Set(prev);
          newSet.delete(poi.id);
          return newSet;
        });
        Alert.alert(
          '📍 Left Geofence',
          `You've left ${poi.title}`,
          [{ text: 'OK' }]
        );
      }
    });
  };

  // Calculate distance between two coordinates (Haversine formula)
  const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371000; // Radius of Earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  // Center map on user location
  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  // Zoom in
  const zoomIn = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    }
  };

  // Zoom out
  const zoomOut = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading map...
        </Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <MaterialIcons name="location-off" size={64} color={colors.icon} />
        <Text style={[styles.errorText, { color: colors.text }]}>{errorMsg}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.tint }]}
          onPress={() => {
            setLoading(true);
            setErrorMsg(null);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        initialRegion={{
          latitude: location?.coords.latitude || 14.5995,
          longitude: location?.coords.longitude || 120.9842,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onMapReady={() => setMapReady(true)}
      >
        {/* Custom markers for points of interest */}
        {pointsOfInterest.map((poi) => (
          <React.Fragment key={poi.id}>
            <Marker
              coordinate={poi.coordinate}
              title={poi.title}
              description={poi.description}
              pinColor={insideGeofence.has(poi.id) ? '#4CAF50' : '#FF5722'}
            />
            {/* Geofence circle */}
            <Circle
              center={poi.coordinate}
              radius={poi.geofenceRadius}
              fillColor="rgba(255, 87, 34, 0.2)"
              strokeColor="rgba(255, 87, 34, 0.5)"
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controlsContainer}>
        {/* Center on user button */}
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.card }]}
          onPress={centerOnUser}
        >
          <MaterialIcons name="my-location" size={24} color={colors.tint} />
        </TouchableOpacity>

        {/* Zoom controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.card, marginBottom: 8 }]}
            onPress={zoomIn}
          >
            <MaterialIcons name="add" size={24} color={colors.tint} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.card }]}
            onPress={zoomOut}
          >
            <MaterialIcons name="remove" size={24} color={colors.tint} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Panel */}
      <View style={[styles.infoPanel, { backgroundColor: colors.card }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Location Tracking Active</Text>
        <Text style={[styles.infoText, { color: colors.icon }]}>
          Lat: {location?.coords.latitude.toFixed(6)}
        </Text>
        <Text style={[styles.infoText, { color: colors.icon }]}>
          Lon: {location?.coords.longitude.toFixed(6)}
        </Text>
        <Text style={[styles.infoText, { color: colors.icon }]}>
          Accuracy: ±{location?.coords.accuracy?.toFixed(0)}m
        </Text>
        {insideGeofence.size > 0 && (
          <View style={[styles.geofenceBadge, { backgroundColor: colors.tint }]}>
            <Text style={styles.geofenceBadgeText}>
              Inside {insideGeofence.size} geofence(s)
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f1e6',
  },
  map: {
    width: '95%',
    height: '70%',
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    right: 20,
    top: 120,
    alignItems: 'center',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  zoomControls: {
    marginTop: 16,
  },
  infoPanel: {
    width: '95%',
    marginTop: 12,
    marginHorizontal: 10,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    marginVertical: 2,
  },
  geofenceBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  geofenceBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MapScreen;