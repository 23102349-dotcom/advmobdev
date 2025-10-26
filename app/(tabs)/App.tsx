import { useTheme } from '@/providers/ThemeProvider';
import { useAppDispatch } from '@/store/hooks';
import { setThemeMode } from '@/store/themeSlice';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import your screens
import CameraScreen from '../screen/CameraScreen';
import MapScreen from '../screen/MapScreen';
import PlaylistBuilderScreen from '../screen/PlaylistBuilderScreen';
import PlaylistDetail from '../screen/PlaylistDetails';
import ProfileScreen from '../screen/ProfileScreen';
import Registration from '../screen/Registration';
import Signup from '../screen/Signup';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const defaultScreenOptions = {
  headerStyle: { backgroundColor: '#121212' },
  headerTintColor: '#fff',
  headerTitle: '',
  ...TransitionPresets.SlideFromRightIOS,
  safeAreaInsets: { top: 0 },
  headerStatusBarHeight: 0,
  cardOverlayEnabled: false,
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { colors, themeMode } = useTheme();
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    try {
      const newMode = themeMode === 'light' ? 'dark' : 'light';
      dispatch(setThemeMode(newMode));
    } catch (error) {
      console.error('Theme toggle error:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.tint,
      }}
    >
        <MaterialIcons 
          name={themeMode === 'light' ? 'light-mode' : 'dark-mode'} 
          size={20} 
          color={colors.tint} 
        />
        <Text style={{ 
          marginLeft: 10, 
          fontSize: 16, 
          fontWeight: '500', 
          color: colors.text 
        }}>
          {themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}
        </Text>
      </TouchableOpacity>
  );
};

// Hamburger menu button for header right
const DrawerToggleButton = ({ navigation }: any) => {
  const { colors } = useTheme();
  
  return (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{ marginRight: 15, padding: 8, borderRadius: 20 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
  );
};

// Wrapper component with animated scaling effect for drawer screens
const AnimatedWrapper = ({ children, navigation }: any) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    const open = navigation.addListener('drawerOpen', () => {
      scale.value = withTiming(0.85, { duration: 300 });
    });
    const close = navigation.addListener('drawerClose', () => {
      scale.value = withTiming(1, { duration: 300 });
    });

    return () => {
      open();
      close();
    };
  }, [navigation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: colors.background }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// Now use AnimatedWrapper inside each wrapper for your screens

const HomeWrapper = ({ navigation }: any) => (
  <AnimatedWrapper navigation={navigation}>
    <PlaylistDetail />
  </AnimatedWrapper>
);

const PlaylistBuilderWrapper = ({ navigation }: any) => (
  <AnimatedWrapper navigation={navigation}>
    <PlaylistBuilderScreen />
  </AnimatedWrapper>
);

const ProfileWrapper = ({ navigation }: any) => (
  <AnimatedWrapper navigation={navigation}>
    <ProfileScreen />
  </AnimatedWrapper>
);

const MapWrapper = ({ navigation }: any) => (
  <AnimatedWrapper navigation={navigation}>
    <MapScreen />
  </AnimatedWrapper>
);

// Drawer Navigator setup
function DrawerNavigator() {
  const { colors } = useTheme();
  
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      detachInactiveScreens={false}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitle: '',
        headerRight: () => <DrawerToggleButton navigation={navigation} />,
        drawerPosition: 'right',
        drawerStyle: { backgroundColor: colors.background, width: 280 },
        drawerActiveTintColor: colors.tint,
        drawerInactiveTintColor: colors.icon,
        drawerLabelStyle: { fontSize: 16, fontWeight: '500' },
        drawerItemStyle: { marginVertical: 5, borderRadius: 8 },
        drawerActiveBackgroundColor: colors.tint + '20',
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.5)',
        safeAreaInsets: { top: 0 },
        headerStatusBarHeight: 0,
      })}
      drawerContent={(props) => (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ padding: 20, paddingTop: 60 }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: colors.text, 
              marginBottom: 20 
            }}>
              Menu
            </Text>
            <ThemeToggle />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 16,
                    marginVertical: 2,
                    borderRadius: 8,
                    backgroundColor: colors.background,
                  }}
                  onPress={() => {
                    props.navigation.navigate('Home');
                    props.navigation.closeDrawer();
                  }}
                >
                  <MaterialIcons name="home" size={20} color={colors.tint} />
                  <Text style={{ 
                    marginLeft: 15, 
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: colors.text 
                  }}>
                    Home
                  </Text>
                </TouchableOpacity>
            
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 16,
                    marginVertical: 2,
                    borderRadius: 8,
                    backgroundColor: colors.background,
                  }}
                  onPress={() => {
                    props.navigation.navigate('PlaylistBuilder');
                    props.navigation.closeDrawer();
                  }}
                >
                  <MaterialIcons name="library-add" size={20} color={colors.tint} />
                  <Text style={{ 
                    marginLeft: 15, 
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: colors.text 
                  }}>
                    Playlist
                  </Text>
                </TouchableOpacity>
            
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 16,
                    marginVertical: 2,
                    borderRadius: 8,
                    backgroundColor: colors.background,
                  }}
                  onPress={() => {
                    props.navigation.navigate('Profile');
                    props.navigation.closeDrawer();
                  }}
                >
                  <MaterialIcons name="person" size={20} color={colors.tint} />
                  <Text style={{ 
                    marginLeft: 15, 
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: colors.text 
                  }}>
                    Profile
                  </Text>
                </TouchableOpacity>
            
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 16,
                    marginVertical: 2,
                    borderRadius: 8,
                    backgroundColor: colors.background,
                  }}
                  onPress={() => {
                    props.navigation.navigate('Map');
                    props.navigation.closeDrawer();
                  }}
                >
                  <MaterialIcons name="map" size={20} color={colors.tint} />
                  <Text style={{ 
                    marginLeft: 15, 
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: colors.text 
                  }}>
                    Map
                  </Text>
                </TouchableOpacity>
          </View>
        </View>
      )}
    >
      <Drawer.Screen
        name="Home"
        component={HomeWrapper}
            options={{
              drawerLabel: 'Home',
              drawerIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
            }}
      />
      <Drawer.Screen
        name="PlaylistBuilder"
        component={PlaylistBuilderWrapper}
        options={{
          drawerLabel: 'Playlist Builder',
          drawerIcon: ({ color, size }) => <MaterialIcons name="library-add" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileWrapper}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Map"
        component={MapWrapper}
        options={{
          drawerLabel: 'Map',
          drawerIcon: ({ color, size }) => <MaterialIcons name="map" color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
}

// Main App component with Stack Navigator
export default function App() {
  return (
    <Stack.Navigator initialRouteName="Signup" screenOptions={defaultScreenOptions}>
      {/* Auth Screens */}
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />

      {/* Main Drawer */}
      <Stack.Screen name="DrawerWrapper" component={DrawerNavigator} options={{ headerShown: false }} />

      {/* Other screens */}
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetail}
        options={({ navigation }) => ({
          title: 'Playlist Detail',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15, padding: 8 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              <TouchableOpacity style={{ padding: 8, marginRight: 5 }}>
                <MaterialIcons name="share" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 8 }}>
                <MaterialIcons name="more-vert" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="PlaylistBuilder"
        component={PlaylistBuilderScreen}
        options={({ navigation }) => ({
          title: 'Playlist Builder',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15, padding: 8 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 15, padding: 8 }}>
              <MaterialIcons name="save" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="TempProfile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'Profile',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15, padding: 8 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              <TouchableOpacity style={{ padding: 8, marginRight: 5 }}>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 8 }}>
                <MaterialIcons name="settings" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={({ navigation }) => ({
          title: 'Camera',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15, padding: 8 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 15, padding: 8 }}>
              <MaterialIcons name="flip-camera-android" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
