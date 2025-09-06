import { Drawer } from "expo-router/drawer";

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
