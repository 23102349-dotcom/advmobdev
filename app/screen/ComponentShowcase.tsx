import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, TouchableOpacity, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';


import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


export default function TabTwoScreen() {
  const [text, setText] = useState('');
  const handlePress = () => {
    console.log('Explore button pressed');
    console.log('Input text:', text);
    Alert.alert('You typed:', text);
    setText('');
  };
  

  return (
    <KeyboardAvoidingView style={{ flex: 1 , paddingVertical: 10}}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  
     >
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636'}} 
      headerImage={
        <Image
        source={require('@/assets/images/favicon.png')}
        style={{ width: '100%', height: '100%' }}
        contentFit="contain"
         />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      
      <ThemedText style={{ paddingVertical: 10}}>This app includes example code to help you get started.</ThemedText>
            <Collapsible title="File-based routing">
              <ThemedText>
                This app has two screens:{' '}
                <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
                <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
              </ThemedText>
              <ThemedText>
                The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
                sets up the tab navigator.
              </ThemedText>
              <ExternalLink href="https://docs.expo.dev/router/introduction">
                <ThemedText type="link">Learn more</ThemedText>
              </ExternalLink>
            </Collapsible>
            <Collapsible title="Android, iOS, and web support">
              <ThemedText>
                You can open this project on Android, iOS, and the web. To open the web version, press{' '}
                <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
              </ThemedText>
            </Collapsible>
            <Collapsible title="Images">
              <ThemedText>
                For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
                <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
                different screen densities
              </ThemedText>
              <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
              <ExternalLink href="https://reactnative.dev/docs/images">
                <ThemedText type="link">Learn more</ThemedText>
              </ExternalLink>
            </Collapsible>
            <Collapsible title="Custom fonts">
              <ThemedText>
                Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
                <ThemedText style={{ fontFamily: 'SpaceMono' }}>
                  custom fonts such as this one.
                </ThemedText>
              </ThemedText>
              <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
                <ThemedText type="link">Learn more</ThemedText>
              </ExternalLink>
            </Collapsible>
            <Collapsible title="Light and dark mode components">
              <ThemedText>
                This template has light and dark mode support. The{' '}
                <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
                what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
              </ThemedText>
              <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
                <ThemedText type="link">Learn more</ThemedText>
              </ExternalLink>
            </Collapsible>
            <Collapsible title="Animations">
              <ThemedText>
                This template includes an example of an animated component. The{' '}
                <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
                the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
                library to create a waving hand animation.
              </ThemedText>
              {Platform.select({
                ios: (
                  <ThemedText>
                    The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
                    component provides a parallax effect for the header image.
                  </ThemedText>
                   ),
                  })}
                </Collapsible>
     
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Feedback</ThemedText>
      </ThemedView>
      <TextInput
      style={styles.textInput}
        placeholder="Type anything here..."
        multiline
        value={text}
        onChangeText={setText}
        textAlignVertical="top" 
      />
       <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Send Feedback</Text>
        </TouchableOpacity>    
    </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: 0,
    left: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    width: 139,
    
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    
  },
  textInput: {
    marginTop: 20,
    marginHorizontal: 16,
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
