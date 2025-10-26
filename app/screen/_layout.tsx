import { Drawer } from "expo-router/drawer";
import React from "react";

export default function RootLayout() {
  return (
    <Drawer>
      {/* This is your Home or Tabs */}
      {/* Playlist inside Drawer */}
      <Drawer.Screen
        name="Playlist"
        options={{ drawerLabel: "Playlist" }}
      />
    </Drawer>
  );
}
