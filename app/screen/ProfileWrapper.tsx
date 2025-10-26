import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const ProfileWrapper = ({ navigation }: any) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));
  
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
  
    return (
      <Animated.View style={[{ flex: 1, backgroundColor: '#121212' }, animatedStyle]}>
        <TempProfileScreen navigation={navigation} />
      </Animated.View>
    );
  };
  

export default ProfileWrapper;
