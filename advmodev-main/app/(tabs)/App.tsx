import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Import your screen
import Playlist from "../screen/Playlist";

export type RootDrawerParamList = {
  Playlist: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Playlist">
        <Drawer.Screen name="Playlist" component={Playlist} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
