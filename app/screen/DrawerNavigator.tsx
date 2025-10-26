import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import HomeWrapper from './HomeWrapper';
import PlaylistBuilderWrapper from './PlaylistBuilderWrapper';
import ProfileWrapper from './ProfileWrapper';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#121212',
          width: 280,
        },
        drawerActiveTintColor: '#1DB954',
        drawerInactiveTintColor: '#fff',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeWrapper}
      />
      <Drawer.Screen 
        name="PlaylistBuilder" 
        component={PlaylistBuilderWrapper}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileWrapper} // <- Correct wrapper with ProfileScreen inside
      />
    </Drawer.Navigator>
  );
}
