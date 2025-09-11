import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import screens
import Playlist from '../screen/Playlist';
import Registration from '../screen/Registration';
import Signup from '../screen/Signup';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Custom Drawer content
function CustomDrawerContent(props: any) {
  return (
    <View style={styles.drawerContent}>
      <DrawerItemList {...props} />
    </View>
  );
}

// Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Playlist"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#121212' },
        drawerInactiveTintColor: '#b3b3b3',
        drawerActiveTintColor: '#1DB954',
        drawerPosition: 'right', // This opens the Drawer on the right side
        // Back button on the left
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.backSymbol}>{'<'}</Text>
          </TouchableOpacity>
        ),
        // Burger menu icon on the right
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="#fff" style={styles.burgerIcon} />
          </TouchableOpacity>
        ),
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Playlist"
        component={Playlist}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="musical-notes" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Root Navigator
function App() {
  return (
    <Stack.Navigator initialRouteName="Signup">
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registration"
        component={Registration}
        options={({ navigation }) => ({
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.backSymbol}>{'<'}</Text>
            </TouchableOpacity>
          ),
        })}
      />
      {/* Drawer Navigator */}
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default App;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
    paddingLeft: 20,
  },
  backSymbol: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  burgerIcon: {
    marginRight: 15, // Space from the right edge
  },
});
