# Advanced Mobile Development Activities

---

## Week 1 - Screenshots
![](https://github.com/23102349-dotcom/advmobdev/blob/main/Screenshot/Image_20250829_134629_521.png?raw=true)
![](https://github.com/23102349-dotcom/advmobdev/blob/main/Screenshot/Image_20250829_134629_656.png?raw=true)

---

## Week 2 - Screenshots
![](https://github.com/23102349-dotcom/advmobdev/blob/main/Screenshot/ca61db9f-9cf2-4dcd-bd01-b43f00a2f831.jpg?raw=true)
![](https://github.com/23102349-dotcom/advmobdev/blob/main/Screenshot/7c87a5bd-b9e1-400d-8ce1-01dbc1dc3ef7.jpg?raw=true)

---

## Week 3 - Advanced Navigation

**Implementation:** `app/navigation/AdvancedNavigation.tsx`

### Features

#### Gestures
- Integrated `react-native-gesture-handler` for swipe gestures.  
- Added swipe-to-open/close Drawer Navigation with adjustable sensitivity (`minDistance: 20`).  
- Tap-to-select navigation on Playlists for detailed playlist viewing.  
- Wrapped app root with `GestureHandlerRootView` for Android gesture support.

#### Custom Transitions
- Used `react-native-reanimated` for smooth navigation transitions.  
- 300 ms transition for Profile and Settings screens.  
- 200 ms fade transition for the Sign-up screen.  
- Added drawer scale animation (content scales to 0.9 when opened).

#### Navigation Persistence
- Implemented navigation state saving using `@react-native-async-storage/async-storage`.  
- Stores last visited screen and drawer open/closed state.  
- Restores navigation state on app launch with fallback to Home screen.

**Screenshot:**  
![](https://github.com/23102349-dotcom/advmobdev/blob/main/Screenshot/db0754ef-dca9-4072-a3e3-f957724f6aac.jpg?raw=true)

---

## Week 4 - Activities

### Activity 1: Spotify Playlist Builder App
**Implementation:** `app/Home/PlaylistBuilder.tsx`

#### Features
- **State Management:**  
  Uses `useReducer` for complex playlist state (songs, history, future, input).  
  Supports add, remove, and clear playlist with undo/redo functionality.

- **Animations:**  
  Implemented `react-native-reanimated` with `FadeIn` and `FadeOut` for smooth list transitions.

- **Gestures:**  
  Integrated `react-native-gesture-handler`’s `Swipeable` for swipe-to-delete song interaction.

- **State Persistence:**  
  Playlist and history saved in `AsyncStorage` and restored on app reload.

- **Performance Optimization:**  
  Used `React.memo` to optimize song list rendering.

- **UI Consistency:**  
  Themed components (`ThemedButton`, `ThemedText`, `ThemedView`) for design consistency.

---

### Activity 2: Spotify Profile Creation Form
**Implementation:** `app/SignUp.tsx` (Enhanced existing signup form)

#### Features
- **Real-Time Validation:**  
  - Username (3–20 characters, alphanumeric/underscores).  
  - Email (must contain @ and domain).  
  - Genre (must be from predefined list: Pop, Rock, Jazz, Classical, Hip-Hop).

- **Dynamic Feedback:**  
  Instant error messages displayed below invalid fields.  
  Shake animation on validation failure using `react-native-reanimated`.

- **Form Caching:**  
  Integrated `AsyncStorage` for caching and auto-fill on reload.  
  Clears cache on successful submission.

- **Dynamic Profile Preview:**  
  Real-time updates for username, email, and genre.  
  Genre-based placeholder image (`https://via.placeholder.com/100?text=[Genre]`).  
  Fade-in animation on preview section for smooth transitions.

- **Performance Optimization:**  
  Used `React.memo` to prevent unnecessary re-renders.

---

## Week 5 - Activities

### Activity 1: Theme Switcher
**Implementation:** `app/theme/ThemeProvider.tsx`

#### Features
- **Global State Management:**  
  Implemented Redux store using Redux Toolkit for light/dark/custom themes.  
  Global theme applied across all screens in the Spotify app.

- **Animated Theme Transitions:**  
  Used `react-native-reanimated` for fade and color interpolation transitions.  
  Ensures smooth color updates on theme switch.

- **Custom Theme Options:**  
  Added color picker for accent customization.  
  Provided three preset options: Light, Dark, and Custom.

- **Persistence:**  
  Theme settings saved and restored using `AsyncStorage`.

- **Testing:**  
  Verified global theme updates across all screens with persisted state after app restart.

---

### Activity 2: Camera with Filters
**Implementation:** `app/Profile/CameraScreen.tsx`

#### Features
- **Camera Integration:**  
  Implemented `expo-camera` for capturing photos directly in the app.  
  Added capture and toggle buttons for switching camera view.

- **Real-Time Filters:**  
  Integrated `expo-gl` shaders for grayscale and sepia filters.  
  Enabled real-time filter switching during preview.

- **Editing Tools:**  
  Added crop and rotate functionalities for captured photos.  
  Supports saving edited images locally.

- **Filter Intensity Control:**  
  Introduced sliders to adjust filter opacity/intensity.  
  Smooth real-time updates using `react-native-reanimated`.

- **Performance Optimization:**  
  Used `React.memo` to optimize rendering of filter previews.

- **Persistence:**  
  Updated profile picture persists across app restarts via local storage.

---

## Week 6 - Activities

### Activity 2: Enhancing with Location-Based Map Features
**Implementation:** `app/Map/LocationMap.tsx`

#### Features
- **Real-Time Location Tracking:**  
  Integrated `react-native-geolocation-service` to track user’s current location.  
  Displayed on map using `react-native-maps`.

- **Custom Markers:**  
  Added at least three mock points of interest (e.g., nearby landmarks).

- **Map Controls:**  
  Enabled zoom and pan for user interactivity.

- **Geofencing Alerts:**  
  Triggered notifications when entering or leaving defined regions (100m radius).

- **Custom Map Styling:**  
  Applied dark/retro JSON map style for enhanced visual design.

- **Cross-Platform Testing:**  
  Verified functionality on both Android and iOS for responsiveness.

- **Documentation:**  
  Included screenshots of the map with markers and custom style, along with implementation notes.
